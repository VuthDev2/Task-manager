"use client";
import React, { useState, useRef } from 'react';
import Sidebar from '../../../components/Sidebar';
import { User, Mail, Lock, EyeOff, Eye, Save, ShieldCheck, Camera, Globe, Bell, Palette, Link2, Download, Trash2 } from 'lucide-react';
import UserHeader from '@/app/components/UserHeader';
import { createClient } from '@/src/utils/supabase/client';
import { updateProfile } from '@/app/lib/profile-actions';
import { updatePassword, deleteAccount } from '@/app/lib/auth-actions';
import { updatePreferences } from '@/app/lib/preferences-actions';
import { exportUserData } from '@/app/lib/task-actions';

// ---------- Preferences Form Components ----------
function PreferencesForm({ preferences, onUpdate }: { preferences: any; onUpdate: (formData: FormData) => Promise<void> }) {
  const timezones = Intl.supportedValuesOf('timeZone');
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'km', name: 'Khmer' },
  ];

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
      <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Globe size={18} className="text-gray-400" />
        Account Preferences
      </h3>
      <form action={onUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Language</label>
            <select name="language" defaultValue={preferences.language ?? 'en'} className="w-full mt-1 p-3 bg-[#F3F4F9] border-none rounded-xl font-semibold">
              {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Timezone</label>
            <select name="timezone" defaultValue={preferences.timezone ?? 'UTC'} className="w-full mt-1 p-3 bg-[#F3F4F9] border-none rounded-xl font-semibold">
              {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date Format</label>
            <select name="date_format" defaultValue={preferences.date_format ?? 'MM/DD/YYYY'} className="w-full mt-1 p-3 bg-[#F3F4F9] border-none rounded-xl font-semibold">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Week starts on</label>
            <select name="first_day_of_week" defaultValue={preferences.first_day_of_week ?? 0} className="w-full mt-1 p-3 bg-[#F3F4F9] border-none rounded-xl font-semibold">
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
            </select>
          </div>
        </div>
        <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
          Save Preferences
        </button>
      </form>
    </div>
  );
}

function NotificationsForm({ preferences, onUpdate }: { preferences: any; onUpdate: (formData: FormData) => Promise<void> }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
      <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Bell size={18} className="text-gray-400" />
        Notification Settings
      </h3>
      <form action={onUpdate} className="space-y-4">
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" name="email_task_assigned" defaultChecked={preferences.email_task_assigned ?? true} />
          Email me when I'm assigned a task
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" name="email_task_due" defaultChecked={preferences.email_task_due ?? true} />
          Email me when a task is due
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" name="email_summary" defaultChecked={preferences.email_summary ?? false} />
          Send me a weekly summary
        </label>
        <button type="submit" className="mt-4 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
          Save Notification Preferences
        </button>
      </form>
    </div>
  );
}

function AppearanceForm({ preferences, onUpdate }: { preferences: any; onUpdate: (formData: FormData) => Promise<void> }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
      <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Palette size={18} className="text-gray-400" />
        Appearance
      </h3>
      <form action={onUpdate} className="space-y-4">
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Theme</label>
          <select name="theme" defaultValue={preferences.theme ?? 'light'} className="w-full mt-1 p-3 bg-[#F3F4F9] border-none rounded-xl font-semibold">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" name="compact_view" defaultChecked={preferences.compact_view ?? false} />
          Compact view (tighter spacing)
        </label>
        <button type="submit" className="mt-4 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
          Save Appearance
        </button>
      </form>
    </div>
  );
}

function SecurityForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const formData = new FormData();
    formData.append('new_password', newPassword);
    formData.append('confirm_password', confirmPassword);
    const result = await updatePassword(formData);
    if (result?.error) setError(result.error);
    else {
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
      <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Lock size={18} className="text-gray-400" />
        Security
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-12 font-semibold text-gray-700"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-12 font-semibold text-gray-700"
            />
          </div>
        </div>
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm">{success}</div>}
        <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition">
          Update Password
        </button>
      </form>
      <div className="mt-8 pt-8 border-t border-gray-50">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lock size={18} className="text-gray-400" />
          Active Sessions
        </h4>
        <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-bold text-sm">Current browser · MacOS</p>
            <p className="text-xs text-gray-400">Last active: just now</p>
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Current</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Sign out of other devices (coming soon)</p>
      </div>
    </div>
  );
}

function ConnectedAccountsForm() {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
      <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Link2 size={18} className="text-gray-400" />
        Connected Accounts
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-bold text-gray-900">Google</span>
          </div>
          <button className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1">
            <Link2 size={16} /> Disconnect
          </button>
        </div>
        <p className="text-xs text-gray-400">Connect your Google account for easier sign‑in.</p>
      </div>
    </div>
  );
}

// Server action for deleting all data (to be implemented)
async function deleteAllData() {
  alert('Delete all data – implement with a server action');
}

function DataManagementForm() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: 'tasks' | 'categories' | 'all') => {
    setExporting(true);
    try {
      const result = await exportUserData(type);
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infinite-export-${type}-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
      <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Download size={18} className="text-gray-400" />
        Data Management
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-sm text-gray-700 mb-3">Export your data</h4>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleExport('tasks')} disabled={exporting} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition disabled:opacity-50">
              Export Tasks
            </button>
            <button onClick={() => handleExport('categories')} disabled={exporting} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
              Export Categories
            </button>
            <button onClick={() => handleExport('all')} disabled={exporting} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
              Export All
            </button>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-50">
          <h4 className="font-bold text-sm text-rose-600 mb-2">Delete all data</h4>
          <p className="text-xs text-gray-400 mb-3">Permanently delete all your tasks and categories. This action cannot be undone.</p>
          <button onClick={deleteAllData} className="px-5 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition">
            Delete all data
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main SettingsClient ----------
export default function SettingsClient({
  initialProfile,
  initialPreferences,
}: {
  initialProfile: any;
  initialPreferences: any;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

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

      setProfile((prev: any) => ({ ...prev, avatar_url: avatarUrl }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleProfileUpdate = async (formData: FormData) => {
    try {
      await updateProfile(formData);
      const fullName = formData.get('full_name') as string;
      const email = formData.get('email') as string;
      const position = formData.get('position') as string;
      setProfile((prev: any) => ({
        ...prev,
        full_name: fullName,
        email: email || prev.email,
        position: position || null,
      }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePreferencesUpdate = async (formData: FormData) => {
    try {
      await updatePreferences(formData);
      // Update local state with new values
      const newPrefs = {
        language: formData.get('language'),
        timezone: formData.get('timezone'),
        date_format: formData.get('date_format'),
        first_day_of_week: parseInt(formData.get('first_day_of_week') as string) || 0,
        theme: formData.get('theme') as 'light' | 'dark' | 'system',
        compact_view: formData.get('compact_view') === 'on',
        email_task_assigned: formData.get('email_task_assigned') === 'on',
        email_task_due: formData.get('email_task_due') === 'on',
        email_summary: formData.get('email_summary') === 'on',
      };
      setPreferences((prev: any) => ({ ...prev, ...newPrefs }));
      // Theme application removed – it was causing errors
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getInitials = () => {
    if (profile.full_name) {
      const names = profile.full_name.split(' ');
      return names.map((n: any) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile.email) return profile.email[0].toUpperCase();
    return 'U';
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <UserHeader title="Settings" />

        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column – Profile Card */}
          <div className="lg:col-span-1 space-y-6">
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
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
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
              <p className="text-sm text-gray-600 mt-1">{profile.position || 'Add job title'}</p>
              {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
            </div>

            <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={20} />
                <span className="font-bold text-sm">Security Tip</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Keep your password strong and enable two‑factor authentication for extra security.
              </p>
            </div>
          </div>

          {/* Right Column – Settings Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
              <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Personal Information
              </h3>
              <form action={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      name="full_name"
                      defaultValue={profile.full_name || ''}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Position / Job Title</label>
                  <input
                    name="position"
                    defaultValue={profile.position || ''}
                    placeholder="e.g. Senior Developer"
                    className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-4 pr-4 font-semibold text-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      defaultValue={profile.email || ''}
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-700"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Changing email will send a confirmation to the new address.</p>
                </div>
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

            <PreferencesForm preferences={preferences} onUpdate={handlePreferencesUpdate} />
            <NotificationsForm preferences={preferences} onUpdate={handlePreferencesUpdate} />
            <AppearanceForm preferences={preferences} onUpdate={handlePreferencesUpdate} />
            <SecurityForm />
            <ConnectedAccountsForm />
            <DataManagementForm />

            {/* Danger Zone (Account Deletion) */}
            <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
              <h4 className="font-bold text-rose-600 text-sm mb-2">Delete account</h4>
              <p className="text-[11px] text-rose-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)} className="bg-white text-rose-600 px-6 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest">
                  Delete my account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-rose-600 font-medium">Please enter your password to confirm.</p>
                  <input
                    type="password"
                    placeholder="Your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full p-2 border border-rose-200 rounded-xl text-sm"
                  />
                  {deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
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