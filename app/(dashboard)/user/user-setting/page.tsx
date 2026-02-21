"use client";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../../components/Sidebar';
import { User, Mail, Lock, EyeOff, Save, ShieldCheck, Camera } from 'lucide-react';
import UserHeader from '@/app/components/UserHeader';
import { createClient } from '@/src/utils/supabase/client';
import { updateProfile } from '@/app/lib/profile-actions';
import { updatePassword, logout } from '@/app/lib/auth-actions';

export default function Settings() {
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    role: string | null;
    avatar_url: string | null;
  }>({
    full_name: null,
    email: null,
    role: null,
    avatar_url: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile({
          full_name: data.full_name,
          email: user.email || null,
          role: data.role,
          avatar_url: data.avatar_url,
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

  const handleLogout = async () => {
    await logout();
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

      // Create a unique file path: avatars/user-id/timestamp-filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      setProfileSuccess('Profile picture updated');
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
                {/* Avatar display */}
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
                {/* Camera button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera size={14} />
                </button>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <h2 className="font-bold text-lg text-gray-900">{profile.full_name || 'User'}</h2>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                {profile.role === 'admin' ? 'Administrator' : 'Project Manager'}
              </p>
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
                  // Refresh local state
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    const fullName = formData.get('full_name') as string;
                    setProfile(prev => ({ ...prev, full_name: fullName }));
                  }
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
            <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-rose-600 text-sm">Sign out of all devices</h4>
                <p className="text-[11px] text-rose-400">Secure your account by ending all active sessions.</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-rose-600 px-6 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}