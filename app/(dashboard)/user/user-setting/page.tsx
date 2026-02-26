"use client";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../../components/Sidebar';
import { User, Mail, Lock, EyeOff, Save, ShieldCheck, Camera } from 'lucide-react';
import UserHeader from '@/app/components/UserHeader';
import { createClient } from '@/src/utils/supabase/client';
import { updateProfile } from '@/app/lib/profile-actions';
import { updatePassword, logout, deleteAccount } from '@/app/lib/auth-actions';

export default function Settings() {
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    role: string | null;
    avatar_url: string | null;
    position: string | null;
  }>({
    full_name: null,
    email: null,
    role: null,
    avatar_url: null,
    position: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, email, avatar_url, position')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile({
          full_name: data.full_name,
          email: user.email || null,
          role: data.role,
          avatar_url: data.avatar_url,
          position: data.position,
        });
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    const formData = new FormData();
    formData.append('new_password', newPassword);
    formData.append('confirm_password', confirmPassword);
    const result = await updatePassword(formData);
    if (result?.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleGlobalLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: 'global' });
    // Redirect to login after signing out
    window.location.href = '/login';
  };

  const getInitials = () => {
    if (profile.full_name) {
      const names = profile.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile.email) return profile.email[0].toUpperCase();
    return 'U';
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      setProfileSuccess('Profile picture updated');
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  function handleLogout(event: React.MouseEvent<HTMLButtonElement>): void {
    handleGlobalLogout();
  }

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />

      <main className="flex-1 p-8">
        <UserHeader title="Settings" />

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Column: Profile Summary */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center border border-white">
              <div className="relative mb-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-[#F3F4F9] object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-[#F3F4F9] flex items-center justify-center text-2xl font-bold text-gray-800">
                    {getInitials()}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera size={14} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <h2 className="font-bold text-lg text-gray-900">{profile.full_name || 'User'}</h2>

              {/* Display position if set, otherwise show a hint */}
              <p className="text-sm text-gray-600 mt-1">
                {profile.position || 'Add job title'}
              </p>

              {/* Optionally keep the system role small, or remove it */}
              {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
            </div>

            <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={20} />
                <span className="font-bold text-sm">Security Tip</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Keep your password strong by using a mix of letters, numbers, and symbols.
              </p>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
              <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Personal Information
              </h3>

              <form action={async (formData) => {
                setProfileError('');
                setProfileSuccess('');
                try {
                  await updateProfile(formData);
                  setProfileSuccess('Profile updated');
                  // Update local state with new values from the form
                  const fullName = formData.get('full_name') as string;
                  const email = formData.get('email') as string;
                  const position = formData.get('position') as string;
                  setProfile(prev => ({
                    ...prev,
                    full_name: fullName,
                    email: email || prev.email,
                    position: position || null,
                  }));
                } catch (err: any) {
                  setProfileError(err.message);
                }
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      name="full_name"
                      defaultValue={profile.full_name || ''}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Position / Job Title field */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Position / Job Title</label>
                  <div className="relative">
                    <input
                      name="position"
                      defaultValue={profile.position || ''}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-4 pr-4 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="e.g. Senior Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      defaultValue={profile.email || ''}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Changing email will send a confirmation to the new address.</p>
                </div>

                {profileError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm">{profileSuccess}</div>
                )}

                <div className="pt-4 flex items-center gap-4">
                  <button type="submit" className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button type="button" onClick={() => window.location.reload()} className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Password Change Section */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
              <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                Change Password
              </h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-12 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                    >
                      <EyeOff size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-12 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm">{passwordSuccess}</div>
                )}
                <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                  Update Password
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            {/* Danger Zone */}
            <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
              <h4 className="font-bold text-rose-600 text-sm mb-2">Delete account</h4>
              <p className="text-[11px] text-rose-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-white text-rose-600 px-6 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest"
                >
                  Delete my account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-rose-600 font-medium">
                    Please enter your password to confirm.
                  </p>
                  <input
                    type="password"
                    placeholder="Your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full p-2 border border-rose-200 rounded-xl text-sm"
                  />
                  {deleteError && (
                    <p className="text-xs text-red-600">{deleteError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        setDeleteLoading(true);
                        setDeleteError('');
                        const formData = new FormData();
                        formData.append('password', deletePassword);
                        const result = await deleteAccount(formData);
                        if (result?.error) {
                          setDeleteError(result.error);
                          setDeleteLoading(false);
                        }
                        // On success, redirect happens automatically
                      }}
                      disabled={deleteLoading}
                      className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-rose-700 transition disabled:opacity-50"
                    >
                      {deleteLoading ? 'Deleting...' : 'Confirm deletion'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                        setDeleteError('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}