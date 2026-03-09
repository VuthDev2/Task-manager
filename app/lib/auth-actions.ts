'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '../../src/utils/supabase/service-role';
import nodemailer from 'nodemailer';

// LOGIN ACTION
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember') === 'on';

  const supabase = await createClient(remember);

  // Validate input
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const friendlyMessage =
      error.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : error.message;
    return { error: friendlyMessage };
  }

  // Check if email is verified
  if (!data.user.email_confirmed_at) {
    return { error: 'Please verify your email address first' };
  }

  // Fetch user role
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    return { error: 'Failed to load user profile' };
  }

  // Revalidate and redirect based on role
  revalidatePath('/', 'layout');

  if (profileData?.role === 'admin') {
    redirect('/admin/admin-tasks');
  } else {
    redirect('/user/user-dashboard');
  }
}

// SIGNUP ACTION
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const firstName = formData.get('first-name') as string;
  const lastName = formData.get('last-name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    return { error: 'All fields are required' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  // Determine the correct redirect URL (supports both local and production)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 0. Check if user already exists in profiles
  const serviceClient = createServiceRoleClient();
  const { data: existingProfile } = await serviceClient
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingProfile) {
    return { error: 'You already have an account with this email. Please log in instead.' };
  }

  // 1. Generate Signup Link manually via Service Role
  const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
    type: 'signup',
    email: email,
    password: password,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: `${firstName} ${lastName}`
      }
    },
  });

  if (linkError) {
    console.error('Error generating signup link:', linkError);
    return { error: linkError.message };
  }

  const signupLink = linkData.properties.action_link;

  // 2. Send the confirmation link via Nodemailer (Direct Gmail)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Task Manager" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirm your Task Manager account',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #000;">Welcome to Task Manager!</h2>
            <p>Thanks for signing up. Please click the button below to confirm your email and activate your account:</p>
            <div style="margin: 30px 0;">
              <a href="${signupLink}"
                 style="background-color: black; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Confirm Email
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Signup confirmation email sent successfully via Nodemailer');
  } catch (emailErr: any) {
    console.error('Nodemailer error (signup):', emailErr);
    // Even if confirmation email fails, the user is created in DB. 
    // But we should probably tell the user there was an issue sending the email.
    return { error: `Account created, but failed to send confirmation email: ${emailErr.message}. Please try resending it from the verification page.` };
  }

  // Fire-and-forget: send branded welcome email via Resend
  try {
    await fetch(`${siteUrl}/api/send-welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName }),
    });
  } catch (welcomeErr) {
    console.error('Welcome email failed to send:', welcomeErr);
  }

  // Revalidate and redirect to verification page
  revalidatePath('/', 'layout');
  redirect('/verify-email');
}

// LOGOUT ACTION
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

// GOOGLE SIGN-IN ACTION
export async function signInWithGoogle() {
  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        prompt: 'login',
      },
    },
  });

  if (error) {
    console.error('Google sign-in error:', error);
    return { error: error.message };
  }

  return { url: data.url };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }
  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}

// Add alias for signout (to match import in LoginLogoutButton)
export const signout = logout;

export async function resendVerificationEmail(email: string) {
  const serviceClient = createServiceRoleClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Generate a new magic link (serves as a confirmation link without requiring password)
  const { data, error: linkError } = await serviceClient.auth.admin.generateLink({
    type: 'magiclink',
    email: email,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (linkError) {
    console.error('Error generating resend link:', linkError);
    return { error: linkError.message };
  }

  const signupLink = data.properties.action_link;

  // 2. Send the link via Nodemailer (Direct Gmail)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Task Manager" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirm your Task Manager account',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #000;">Confirm your email</h2>
            <p>Please click the button below to confirm your email and activate your Task Manager account:</p>
            <div style="margin: 30px 0;">
              <a href="${signupLink}"
                 style="background-color: black; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Confirm Email
              </a>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Resend confirmation email sent successfully via Nodemailer');
    return { success: true };
  } catch (err: any) {
    console.error('Nodemailer error (resend):', err);
    return { error: `Email Error: ${err.message}` };
  }
}


export async function deleteAccount(formData: FormData) {
  const supabase = await createClient(); // regular client for checking session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify password (optional but recommended)
  const password = formData.get('password') as string;
  if (!password) {
    return { error: 'Password is required to delete your account.' };
  }

  // Re-authenticate user with password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  });
  if (signInError) {
    return { error: 'Incorrect password. Deletion cancelled.' };
  }

  // Use service role client for privileged operations
  const serviceClient = createServiceRoleClient();

  // 1. Delete all tasks where user is creator or assignee
  await serviceClient
    .from('tasks')
    .delete()
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

  // 2. Delete all categories created by user
  await serviceClient
    .from('categories')
    .delete()
    .eq('created_by', user.id);

  // 3. Delete all notifications for user
  await serviceClient
    .from('notifications')
    .delete()
    .eq('user_id', user.id);

  // 4. Delete profile (should cascade automatically, but do it explicitly)
  await serviceClient
    .from('profiles')
    .delete()
    .eq('id', user.id);

  // 5. Finally, delete the auth user itself
  const { error: deleteError } = await serviceClient.auth.admin.deleteUser(
    user.id
  );
  if (deleteError) throw new Error(deleteError.message);

  // Sign out and redirect to home
  await supabase.auth.signOut();
  redirect('/');
}
export async function requestPasswordReset(email: string, origin?: string) {
  const serviceClient = createServiceRoleClient();

  // Use the provided origin if available, otherwise fallback to env or localhost
  const siteUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  console.log('Generating reset link for:', email, 'with redirectTo:', `${siteUrl}/reset`);

  // 1. Generate a magic link for password reset
  const { data, error: linkError } = await serviceClient.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: {
      redirectTo: `${siteUrl}/reset`,
    },
  });

  if (linkError) {
    console.error('Error generating reset link:', linkError);
    return { error: linkError.message };
  }

  const { properties } = data;
  const resetLink = properties.action_link;

  // 2. Send the link via Nodemailer (Direct Gmail)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Task Manager" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Reset your Task Manager password',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #000;">Reset your password</h2>
            <p>You requested a password reset for your Task Manager account.</p>
            <p>Click the button below to set a new password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}"
                 style="background-color: black; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #666; font-size: 14px;">The link will expire in 1 hour.</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully via Nodemailer');
    return { success: true };
  } catch (err: any) {
    console.error('Nodemailer error:', err);
    return { error: `Email Error: ${err.message}` };
  }
}
