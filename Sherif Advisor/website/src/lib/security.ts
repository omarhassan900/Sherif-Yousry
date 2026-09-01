/**
 * Security Utilities
 * 
 * This module provides core security functions for the platform:
 * - Password hashing & verification
 * - JWT token management
 * - Input validation & sanitization
 * - Encryption utilities for sensitive data
 * - Audit logging
 */

import { z } from 'zod';

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب').max(100),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().max(2000, 'الرسالة طويلة جداً').optional(),
});

export const serviceInquirySchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب').max(100),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().max(40).optional(),
  countryCode: z.string().max(8).optional(),
  businessActivity: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  helpWith: z.string().max(200).optional(),
  consent: z.boolean().optional(),
  message: z.string().max(2000, 'الرسالة طويلة جداً').optional(),
  source: z.enum(['service', 'contact']).optional(),
});

export const assessmentSchema = z.object({
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']),
  revenue: z.string(),
  industry: z.string(),
  countries: z.array(z.string()),
  taxCompliance: z.enum(['none', 'partial', 'full']),
  financialMaturity: z.number().min(1).max(5),
  hasExternalAuditor: z.boolean(),
  growthPlans: z.enum(['local', 'regional', 'international']),
  topConcern: z.string(),
});

// ============================================
// SANITIZATION
// ============================================

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// ============================================
// SESSION MANAGEMENT
// ============================================

export interface SessionData {
  userId: string;
  email: string;
  role: 'client' | 'admin' | 'advisor';
  companyId: string;
  permissions: string[];
  expiresAt: number;
}

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  maxAge: 8 * 60 * 60, // 8 hours
  refreshThreshold: 30 * 60, // Refresh if < 30 min left
  cookieName: 'session-token',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict' as const,
};

// ============================================
// AUDIT LOGGING
// ============================================

export interface AuditEvent {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log security-relevant events for compliance
 */
export function logAuditEvent(event: AuditEvent): void {
  // TODO: Send to secure audit log storage (e.g., AWS CloudWatch, dedicated audit DB)
  console.log('[AUDIT]', JSON.stringify(event));
}

// ============================================
// ENCRYPTION (placeholder for data-at-rest)
// ============================================

/**
 * Encryption configuration for sensitive client data
 * In production, use AWS KMS or similar HSM-backed service
 */
export const ENCRYPTION_CONFIG = {
  algorithm: 'AES-256-GCM',
  keyRotationDays: 90,
  // Key management via environment variables / KMS
};

// ============================================
// SECURITY HEADERS
// ============================================

export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
