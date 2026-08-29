'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';

/**
 * Admin Login Page
 *
 * Handles admin authentication with client-side validation,
 * API submission, error display, and conditional redirect
 * (dashboard or change-password based on API response).
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Basic email format validation.
   * Checks for a non-empty local part, @, and a domain with at least one dot.
   */
  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setIsSubmitting(false);
        return;
      }

      // Successful login — redirect based on response
      if (data.requiresPasswordChange) {
        router.push('/admin/change-password');
      } else {
        const redirect = searchParams.get('redirect');
        router.push(redirect || '/admin');
      }
    } catch {
      setError('Unable to connect. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy-dark flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-brand-navy border border-white/10 rounded-lg p-10 flex flex-col items-center gap-8">
          {/* Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/60 flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-gold" />
            </div>
            <h1 className="font-cormorant text-2xl text-text-primary">
              Admin Portal
            </h1>
            <p className="text-sm text-text-secondary text-center">
              Sign in to manage website content
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div
              role="alert"
              className="w-full bg-red-900/30 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded"
            >
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                maxLength={254}
                required
                autoComplete="email"
                aria-label="Email address"
                className="w-full bg-brand-navy-deep border border-white/10 pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                maxLength={128}
                required
                autoComplete="current-password"
                aria-label="Password"
                className="w-full bg-brand-navy-deep border border-white/10 pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-gold text-brand-navy-dark font-medium py-3 rounded hover:bg-brand-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Lock className="w-3 h-3" />
            <span>Secure encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
