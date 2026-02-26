'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '../../src/utils/supabase/service-role';

// LOGIN ACTION
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember') === 'on';

  const supabase = createClient(remember);

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
  const supabase = createClient();

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

  // Sign up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: `${firstName} ${lastName}`
      }
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Revalidate and redirect to verification page
  revalidatePath('/', 'layout');
  redirect('/verify-email');
}

// LOGOUT ACTION
export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

// GOOGLE SIGN-IN ACTION 
export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google sign-in error:', error);
    return { error: error.message };
  }

  
  return { url: data.url };
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient();
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
  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) throw new Error(error.message);
  return { success: true };
}


export async function deleteAccount(formData: FormData) {
  const supabase = createClient(); // regular client for checking session
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


