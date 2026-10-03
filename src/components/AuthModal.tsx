import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ActivePage } from '../types';
import { X, Mail, Lock, User as UserIcon, Phone, LogOut, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  setActivePage?: (page: ActivePage) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ setActivePage }) => {
  const {
    user,
    profile,
    isAdmin,
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    updateUserProfile,
    isAuthModalOpen,
    setIsAuthModalOpen
  } = useAuth();

  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editing profile state
  const [editPhone, setEditPhone] = useState('');
  const [editName, setEditName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      showToast('Signed in successfully with Google!', 'success');
      handleClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
        showToast('Welcome back to Musafir Cafe!', 'success');
        handleClose();
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setLoading(false);
          return;
        }
        await signupWithEmail(email.trim(), password, name.trim(), phone.trim());
        showToast('Account created successfully!', 'success');
        handleClose();
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication failed';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please verify and try again.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please log in.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        name: editName || profile?.name,
        phone: editPhone || profile?.phone
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E7DFD5] p-6 sm:p-8 animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-[#FAF7F2] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGGED IN VIEW: PROFILE & LOGOUT */}
        {user ? (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-16 h-16 rounded-full bg-[#3F2A1D] text-[#E08A3C] flex items-center justify-center mx-auto text-xl font-bold font-serif shadow-sm">
                {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'M'}
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
                {profile?.name || user.displayName || 'Customer'}
              </h3>
              <p className="text-xs text-[#8C7A6B]">{user.email}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[11px] font-semibold text-[#C26D2B] border border-[#E7DFD5]">
                Role: <span className="uppercase">{profile?.role || (isAdmin ? 'admin' : 'customer')}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#F0EAE1] text-xs">
              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue={profile?.name || user.displayName || ''}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={profile?.phone || ''}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="e.g., 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] text-[#3F2A1D] border border-[#D5C7B8] font-semibold text-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>

            {isAdmin && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (setActivePage) {
                      setActivePage('admin');
                    }
                    handleClose();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Access Admin Portal</span>
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-[#F0EAE1] flex gap-2">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-stone-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN: SIGN IN / SIGN UP */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
                {mode === 'login' ? 'Welcome Back' : 'Join Musafir Cafe'}
              </h3>
              <p className="text-xs text-[#6B5A4D]">
                {mode === 'login'
                  ? 'Sign in to access your order history and live updates.'
                  : 'Create an account to track deliveries, order faster, and save favorites.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Google Sign In */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl border border-[#D5C7B8] bg-white hover:bg-[#FAF7F2] text-[#2B1B14] font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-xs active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-[#E7DFD5]" />
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B]">or with email</span>
              <div className="h-[1px] flex-1 bg-[#E7DFD5]" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alok Sharma"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alok@example.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Customer Account'}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center text-xs text-[#6B5A4D]">
              {mode === 'login' ? (
                <p>
                  Don’t have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#C26D2B] hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#C26D2B] hover:underline"
                  >
                    Log in here
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
