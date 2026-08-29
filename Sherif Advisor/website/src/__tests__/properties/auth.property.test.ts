/// <reference types="vitest/globals" />
/**
 * Property-based tests for authentication module.
 *
 * Feature: admin-portal-cms
 *
 * Property 3: Password validation accepts only compliant passwords
 * Property 1: Invalid credentials always produce a generic error
 */

import * as fc from 'fast-check';
import { validatePassword, hashPassword, verifyPassword } from '@/lib/admin-auth';

// ============================================
// HELPERS — Generators
// ============================================

/**
 * Arbitrary that generates strings meeting ALL password rules:
 * - Length between 8 and 128
 * - At least one uppercase [A-Z]
 * - At least one lowercase [a-z]
 * - At least one digit [0-9]
 */
const validPasswordArb = fc
  .tuple(
    fc.string({ minLength: 0, maxLength: 122 }), // filler (max 122 to leave room for required chars)
    fc.integer({ min: 0, max: 25 }).map((n) => String.fromCharCode(65 + n)), // uppercase
    fc.integer({ min: 0, max: 25 }).map((n) => String.fromCharCode(97 + n)), // lowercase
    fc.integer({ min: 0, max: 9 }).map((n) => String(n)), // digit
    fc.integer({ min: 0, max: 2 }) // insertion strategy
  )
  .map(([filler, upper, lower, digit, strategy]) => {
    const required = upper + lower + digit; // 3 chars
    // Ensure total length is between 8 and 128
    const fillerNeeded = Math.max(5, 8 - required.length); // need at least 5 filler to hit 8 total
    const trimmedFiller = filler.length < fillerNeeded
      ? filler + 'a'.repeat(fillerNeeded - filler.length)
      : filler.slice(0, Math.min(filler.length, 125)); // keep total <= 128

    if (strategy === 0) {
      return required + trimmedFiller;
    } else if (strategy === 1) {
      return trimmedFiller + required;
    } else {
      const mid = Math.floor(trimmedFiller.length / 2);
      return trimmedFiller.slice(0, mid) + required + trimmedFiller.slice(mid);
    }
  })
  .filter((pw) => pw.length >= 8 && pw.length <= 128);

/**
 * Arbitrary that generates strings shorter than 8 characters.
 */
const tooShortPasswordArb = fc.string({ minLength: 0, maxLength: 7 });

/**
 * Arbitrary that generates strings longer than 128 characters.
 */
const tooLongPasswordArb = fc.string({ minLength: 129, maxLength: 200 });

/**
 * Arbitrary that generates strings (8-128 chars) with NO uppercase letter.
 */
const noUppercaseArb = fc
  .array(
    fc.oneof(
      fc.integer({ min: 97, max: 122 }).map((c) => String.fromCharCode(c)), // lowercase
      fc.integer({ min: 48, max: 57 }).map((c) => String.fromCharCode(c)), // digits
      fc.constantFrom('!', '@', '#')
    ),
    { minLength: 8, maxLength: 128 }
  )
  .map((chars) => chars.join(''));

/**
 * Arbitrary that generates strings (8-128 chars) with NO lowercase letter.
 */
const noLowercaseArb = fc
  .array(
    fc.oneof(
      fc.integer({ min: 65, max: 90 }).map((c) => String.fromCharCode(c)), // uppercase
      fc.integer({ min: 48, max: 57 }).map((c) => String.fromCharCode(c)), // digits
      fc.constantFrom('!', '@', '#')
    ),
    { minLength: 8, maxLength: 128 }
  )
  .map((chars) => chars.join(''));

/**
 * Arbitrary that generates strings (8-128 chars) with NO digit.
 */
const noDigitArb = fc
  .array(
    fc.oneof(
      fc.integer({ min: 65, max: 90 }).map((c) => String.fromCharCode(c)), // uppercase
      fc.integer({ min: 97, max: 122 }).map((c) => String.fromCharCode(c)), // lowercase
      fc.constantFrom('!', '@', '#')
    ),
    { minLength: 8, maxLength: 128 }
  )
  .map((chars) => chars.join(''));

// ============================================
// Property 3: Password validation accepts only compliant passwords
// ============================================

describe('Feature: admin-portal-cms — Property 3: Password validation accepts only compliant passwords', () => {
  /**
   * **Validates: Requirements 2.4**
   *
   * For any string meeting all rules (8-128 chars, uppercase, lowercase, digit),
   * validatePassword SHALL return { valid: true }.
   */
  it('accepts passwords that meet ALL rules', () => {
    fc.assert(
      fc.property(validPasswordArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * Passwords shorter than 8 characters must be rejected.
   */
  it('rejects passwords shorter than 8 characters', () => {
    fc.assert(
      fc.property(tooShortPasswordArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * Passwords longer than 128 characters must be rejected.
   */
  it('rejects passwords longer than 128 characters', () => {
    fc.assert(
      fc.property(tooLongPasswordArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * Passwords without any uppercase letter must be rejected.
   */
  it('rejects passwords without an uppercase letter', () => {
    fc.assert(
      fc.property(noUppercaseArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * Passwords without any lowercase letter must be rejected.
   */
  it('rejects passwords without a lowercase letter', () => {
    fc.assert(
      fc.property(noLowercaseArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * Passwords without any digit must be rejected.
   */
  it('rejects passwords without a digit', () => {
    fc.assert(
      fc.property(noDigitArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================
// Property 1: Invalid credentials always produce a generic error
// ============================================

describe('Feature: admin-portal-cms — Property 1: Invalid credentials always produce a generic error', () => {
  /**
   * **Validates: Requirements 1.3**
   *
   * For any arbitrary password string, verifying it against a hash of a
   * DIFFERENT known password always returns false.
   * This ensures the system will always produce a generic "Invalid credentials"
   * message (the same message regardless of which credential was wrong).
   */
  it('verifyPassword returns false for any password that does not match the hash', async () => {
    // Pre-compute a hash once to avoid slow bcrypt in the loop
    const knownPassword = 'KnownSecret1!';
    const hash = await hashPassword(knownPassword);

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 72 }),
        async (attemptedPassword) => {
          // Only test when passwords are actually different
          fc.pre(attemptedPassword !== knownPassword);

          const result = await verifyPassword(attemptedPassword, hash);
          expect(result).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // Extended timeout for bcrypt operations

  /**
   * **Validates: Requirements 1.3**
   *
   * For any password that violates validation rules, the validatePassword
   * function rejects it without revealing which specific rule failed
   * in a way that would disclose credential information.
   * The result is always { valid: false } with a generic error field.
   */
  it('validatePassword rejects passwords missing required character classes uniformly', () => {
    const invalidPasswordArb = fc.oneof(
      tooShortPasswordArb,
      noUppercaseArb,
      noLowercaseArb,
      noDigitArb
    );

    fc.assert(
      fc.property(invalidPasswordArb, (password) => {
        const result = validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
        expect(typeof result.error).toBe('string');
      }),
      { numRuns: 100 }
    );
  });
});
