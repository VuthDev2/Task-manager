'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// LOGIN ACTION
export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

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
    return { error: error.message };
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
  redirect('/forgot-password');
}

// LOGOUT ACTION
export async function logout() {
  const supabase = createClient();
  
  try {
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    return { error: 'Failed to logout' };
  }
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