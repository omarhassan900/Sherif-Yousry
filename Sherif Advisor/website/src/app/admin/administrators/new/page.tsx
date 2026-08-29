'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import AdminShell from '../../components/AdminShell';

interface FormErrors {
  email?: string;
  displayName?: string;
  general?: string;
}

interface CreatedUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export default function NewAdministratorPage() {
  const [adminName] = useState('Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form fields
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Success state
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }

    if (!displayName.trim()) {
      errs.displayName = 'Display name is required';
    } else if (displayName.trim().length > 100) {
      errs.displayName = 'Display name must not exceed 100 characters';
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          displayName: displayName.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedUser(data.user);
        setTempPassword(data.tempPassword);
      } else {
        const data = await res.json().catch(() => null);
        setErrors({
          general: data?.error || 'Failed to create administrator. Please try again.',
        });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopyPassword() {
    if (!tempPassword) return;
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text in a temporary input
      const textArea = document.createElement('textarea');
      textArea.value = tempPassword;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Success view — shows temp password
  if (createdUser && tempPassword) {
    return (
      <AdminShell adminName={adminName}>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back link + heading */}
          <div className="space-y-4">
            <Link
              href="/admin/administrators"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Administrators
            </Link>

            <h1 className="text-2xl font-semibold text-text-primary">
              Administrator Created
            </h1>
          </div>

          {/* Success message */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-900/20 border border-green-500/30">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm text-green-300 font-medium">
                Account created successfully
              </p>
              <p className="text-sm text-text-secondary">
                <span className="text-text-primary font-medium">{createdUser.displayName}</span>
                {' '}({createdUser.email}) has been added as an administrator.
              </p>
            </div>
          </div>

          {/* Temporary password display */}
          <div className="p-5 rounded-lg bg-yellow-900/20 border border-yellow-500/30 space-y-3">
            <p className="text-sm font-medium text-yellow-300">
              Temporary Password
            </p>
            <p className="text-xs text-text-secondary">
              Share this password with the new administrator. They will be required to change it on first login.
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-3 rounded bg-brand-navy-dark border border-white/10 text-lg font-mono text-text-primary tracking-wider select-all">
                {tempPassword}
              </code>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Password
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-yellow-400/70">
              This password will not be shown again. Make sure to copy it now.
            </p>
          </div>

          {/* Navigation button */}
          <div className="pt-4 border-t border-white/10">
            <Link
              href="/admin/administrators"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              Go to Administrators
            </Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  // Form view
  return (
    <AdminShell adminName={adminName}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back link + heading */}
        <div className="space-y-4">
          <Link
            href="/admin/administrators"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Administrators
          </Link>

          <h1 className="text-2xl font-semibold text-text-primary">
            Create New Administrator
          </h1>
          <p className="text-sm text-text-secondary">
            A temporary password will be generated for the new admin. They will be required to change it on first login.
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-sm text-red-300" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              maxLength={254}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={isSubmitting}
              placeholder="admin@example.com"
              className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                errors.email ? 'border-red-500' : 'border-white/10'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-red-400" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Display Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="displayName" className="text-sm font-medium text-text-primary">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              maxLength={100}
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: undefined }));
              }}
              disabled={isSubmitting}
              placeholder="Enter display name..."
              className={`px-3 py-2 bg-brand-navy-dark border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40 transition-colors ${
                errors.displayName ? 'border-red-500' : 'border-white/10'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.displayName && (
              <p className="text-xs text-red-400" role="alert">{errors.displayName}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-medium rounded transition-colors ${
                isSubmitting
                  ? 'bg-brand-gold/50 text-brand-navy/70 cursor-not-allowed'
                  : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Administrator'}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
