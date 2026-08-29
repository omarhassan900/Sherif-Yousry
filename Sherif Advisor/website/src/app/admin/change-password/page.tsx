'use client';

import { useState, FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Check, X, ShieldAlert } from 'lucide-react';

/**
 * Forced Password Change Page
 *
 * Shown when an admin user logs in with requiresPasswordChange set to true.
 * Displays password rules as a live checklist, validates the new password
 * client-side, and submits to the change-password API.
 */
export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password rule checks (update live as user types)
  const rules = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      maxLength: newPassword.length <= 128,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasDigit: /\d/.test(newPassword),
    };
  }, [newPassword]);

  const allRulesMet = rules.minLength && rules.maxLength && rules.hasUppercase && rules.hasLowercase && rules.hasDigit;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!allRulesMet) {
      setError('New password does not meet all requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Password change failed');
        setIsSubmitting(false);
        return;
      }

      // Success — redirect to admin dashboard
      router.push('/admin');
    } catch {
      setError('Unable to connect. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy-dark flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Change Password Card */}
        <div className="bg-brand-navy border border-white/10 rounded-lg p-10 flex flex-col items-center gap-6">
          {/* Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/60 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-brand-gold" />
            </div>
            <h1 className="font-cormorant text-2xl text-text-primary">
              Change Password
            </h1>
            <p className="text-sm text-text-secondary text-center">
              You must set a new password before continuing
            </p>
          </div>

          {/* Info banner */}
          <div className="w-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm px-4 py-3 rounded flex items-start gap-2">
            <Lock className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              This is a required first-time password change. Please choose a strong password that you haven&apos;t used before.
            </span>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Current password field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                maxLength={128}
                required
                autoComplete="current-password"
                aria-label="Current password"
                className="w-full bg-brand-navy-deep border border-white/10 pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* New password field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                maxLength={128}
                required
                autoComplete="new-password"
                aria-label="New password"
                className="w-full bg-brand-navy-deep border border-white/10 pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Password rules checklist */}
            {newPassword.length > 0 && (
              <div className="bg-brand-navy-deep border border-white/10 rounded p-3 flex flex-col gap-1.5">
                <p className="text-xs text-text-muted font-medium mb-1">Password requirements:</p>
                <PasswordRule met={rules.minLength} label="At least 8 characters" />
                <PasswordRule met={rules.maxLength} label="No more than 128 characters" />
                <PasswordRule met={rules.hasUppercase} label="At least one uppercase letter" />
                <PasswordRule met={rules.hasLowercase} label="At least one lowercase letter" />
                <PasswordRule met={rules.hasDigit} label="At least one digit" />
              </div>
            )}

            {/* Confirm password field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                maxLength={128}
                required
                autoComplete="new-password"
                aria-label="Confirm new password"
                className="w-full bg-brand-navy-deep border border-white/10 pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Match indicator */}
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400">Passwords do not match</span>
                  </>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !allRulesMet || !passwordsMatch}
              className="w-full bg-brand-gold text-brand-navy-dark font-medium py-3 rounded hover:bg-brand-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update Password'
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

/**
 * Password rule indicator component.
 * Shows a check or X icon with the rule description.
 */
function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-text-muted shrink-0" />
      )}
      <span className={met ? 'text-green-400' : 'text-text-muted'}>
        {label}
      </span>
    </div>
  );
}
