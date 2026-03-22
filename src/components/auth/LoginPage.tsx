import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useAppStore((s) => s.navigate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;
    const result = await login(email.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  };

  // Already logged in — show profile info
  if (user && profile) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 px-6 py-5 border-b border-amber-200">
            <h2 className="text-lg font-bold text-amber-900">Your Account</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Display Name</label>
              <p className="text-base font-medium text-stone-800 mt-0.5">{profile.display_name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Email</label>
              <p className="text-base text-stone-600 mt-0.5">{profile.email}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate('home')}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors min-h-[44px]"
              >
                Back to App
              </button>
              <button
                onClick={logout}
                className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors min-h-[44px]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Magic link sent — confirmation
  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-50 px-6 py-5 border-b border-emerald-200">
            <h2 className="text-lg font-bold text-emerald-900">Check Your Email</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-stone-600">
              We sent a magic link to <span className="font-semibold text-stone-800">{email}</span>.
            </p>
            <p className="text-stone-500 text-sm">
              Click the link in the email to sign in. It may take a minute to arrive — check your spam folder if needed.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors min-h-[44px]"
            >
              Use a Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="bg-amber-50 px-6 py-5 border-b border-amber-200">
          <h2 className="text-lg font-bold text-amber-900">Sign In</h2>
          <p className="text-sm text-amber-700 mt-1">
            Sign in to share campaigns with your party. No password needed — we'll email you a magic link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-base min-h-[44px]"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors min-h-[44px]"
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
