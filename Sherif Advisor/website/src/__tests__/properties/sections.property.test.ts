/// <reference types="vitest/globals" />
/**
 * Property-based tests for page section field validation.
 *
 * Feature: admin-portal-cms
 * - Property 12: Page section field validation
 *
 * For any page section save request, the validator SHALL accept text field values
 * if and only if they contain between 1 and 2000 characters.
 */

import * as fc from 'fast-check';

// ============================================
// TYPES (mirroring the content module)
// ============================================

interface PageSectionField {
  ar: string;
  en: string;
}

interface PageSectionSaveRequest {
  page: string;
  sectionKey: string;
  fields: Record<string, PageSectionField>;
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, { ar?: string; en?: string }>;
}

// ============================================
// PURE LOGIC FUNCTIONS (extracted for testing)
// ============================================

/**
 * Validate a single text field value for a page section.
 * Accepts values with between 1 and 2000 characters (inclusive).
 */
function validateSectionTextField(value: string): boolean {
  return value.length >= 1 && value.length <= 2000;
}

/**
 * Validate all fields in a page section save request.
 * Each field's Arabic and English values must be between 1 and 2000 characters.
 */
function validatePageSectionFields(request: PageSectionSaveRequest): ValidationResult {
  const errors: Record<string, { ar?: string; en?: string }> = {};

  for (const [fieldName, field] of Object.entries(request.fields)) {
    const fieldErrors: { ar?: string; en?: string } = {};

    if (!validateSectionTextField(field.ar)) {
      fieldErrors.ar = 'Text must be between 1 and 2000 characters';
    }
    if (!validateSectionTextField(field.en)) {
      fieldErrors.en = 'Text must be between 1 and 2000 characters';
    }

    if (fieldErrors.ar || fieldErrors.en) {
      errors[fieldName] = fieldErrors;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================
// GENERATORS
// ============================================

/** Generate a valid text field value (1-2000 characters) */
const validTextFieldArb: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 2000 });

/** Generate an empty string (0 characters — invalid) */
const emptyTextFieldArb: fc.Arbitrary<string> = fc.constant('');

/** Generate a text field value that exceeds 2000 characters */
const tooLongTextFieldArb: fc.Arbitrary<string> = fc.string({ minLength: 2001, maxLength: 2500 });

/** Generate a valid page section field (both ar and en valid) */
const validSectionFieldArb: fc.Arbitrary<PageSectionField> = fc
  .tuple(validTextFieldArb, validTextFieldArb)
  .map(([ar, en]) => ({ ar, en }));

/** Generate a valid page section save request with 1-5 fields */
const validSectionRequestArb: fc.Arbitrary<PageSectionSaveRequest> = fc
  .tuple(
    fc.constantFrom('homepage', 'about', 'contact'),
    fc.constantFrom('hero', 'stats', 'intro', 'cta', 'footer'),
    fc.array(
      fc.tuple(
        fc.constantFrom('title', 'subtitle', 'body', 'ctaLabel', 'ctaLink', 'stat1', 'stat2'),
        validSectionFieldArb
      ),
      { minLength: 1, maxLength: 5 }
    )
  )
  .map(([page, sectionKey, fieldEntries]) => ({
    page,
    sectionKey,
    fields: Object.fromEntries(fieldEntries),
  }));

// ============================================
// Property 12: Page section field validation
// ============================================

describe('Feature: admin-portal-cms, Property 12: Page section field validation', () => {
  /**
   * **Validates: Requirements 7.3**
   *
   * For any page section save request where all text field values contain
   * between 1 and 2000 characters, the validator SHALL accept the request.
   */
  it('accepts text field values with between 1 and 2000 characters', () => {
    fc.assert(
      fc.property(validSectionRequestArb, (request) => {
        const result = validatePageSectionFields(request);
        expect(result.valid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any single text field value with between 1 and 2000 characters,
   * the field validator SHALL return true (accepted).
   */
  it('validateSectionTextField accepts any string of length 1 to 2000', () => {
    fc.assert(
      fc.property(validTextFieldArb, (value) => {
        expect(validateSectionTextField(value)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any empty string (0 characters), the validator SHALL reject it.
   */
  it('rejects empty string text field values', () => {
    fc.assert(
      fc.property(emptyTextFieldArb, (value) => {
        expect(validateSectionTextField(value)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any text field value exceeding 2000 characters, the validator SHALL reject it.
   */
  it('rejects text field values exceeding 2000 characters', () => {
    fc.assert(
      fc.property(tooLongTextFieldArb, (value) => {
        expect(validateSectionTextField(value)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any page section save request containing at least one field with an
   * empty Arabic value, the validator SHALL reject the request and report
   * an error for that field.
   */
  it('rejects request when any field has an empty Arabic value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('homepage', 'about', 'contact'),
        fc.constantFrom('hero', 'stats', 'intro'),
        fc.constantFrom('title', 'subtitle', 'body'),
        validTextFieldArb,
        (page, sectionKey, fieldName, validEn) => {
          const request: PageSectionSaveRequest = {
            page,
            sectionKey,
            fields: {
              [fieldName]: { ar: '', en: validEn },
            },
          };

          const result = validatePageSectionFields(request);
          expect(result.valid).toBe(false);
          expect(result.errors[fieldName]?.ar).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any page section save request containing at least one field with an
   * empty English value, the validator SHALL reject the request and report
   * an error for that field.
   */
  it('rejects request when any field has an empty English value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('homepage', 'about', 'contact'),
        fc.constantFrom('hero', 'stats', 'intro'),
        fc.constantFrom('title', 'subtitle', 'body'),
        validTextFieldArb,
        (page, sectionKey, fieldName, validAr) => {
          const request: PageSectionSaveRequest = {
            page,
            sectionKey,
            fields: {
              [fieldName]: { ar: validAr, en: '' },
            },
          };

          const result = validatePageSectionFields(request);
          expect(result.valid).toBe(false);
          expect(result.errors[fieldName]?.en).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any page section save request containing a field with an Arabic value
   * exceeding 2000 characters, the validator SHALL reject the request.
   */
  it('rejects request when any field has Arabic value exceeding 2000 characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('homepage', 'about', 'contact'),
        fc.constantFrom('hero', 'stats', 'intro'),
        fc.constantFrom('title', 'subtitle', 'body'),
        tooLongTextFieldArb,
        validTextFieldArb,
        (page, sectionKey, fieldName, longAr, validEn) => {
          const request: PageSectionSaveRequest = {
            page,
            sectionKey,
            fields: {
              [fieldName]: { ar: longAr, en: validEn },
            },
          };

          const result = validatePageSectionFields(request);
          expect(result.valid).toBe(false);
          expect(result.errors[fieldName]?.ar).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * For any page section save request containing a field with an English value
   * exceeding 2000 characters, the validator SHALL reject the request.
   */
  it('rejects request when any field has English value exceeding 2000 characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('homepage', 'about', 'contact'),
        fc.constantFrom('hero', 'stats', 'intro'),
        fc.constantFrom('title', 'subtitle', 'body'),
        validTextFieldArb,
        tooLongTextFieldArb,
        (page, sectionKey, fieldName, validAr, longEn) => {
          const request: PageSectionSaveRequest = {
            page,
            sectionKey,
            fields: {
              [fieldName]: { ar: validAr, en: longEn },
            },
          };

          const result = validatePageSectionFields(request);
          expect(result.valid).toBe(false);
          expect(result.errors[fieldName]?.en).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.3**
   *
   * The boundary value of exactly 1 character SHALL be accepted,
   * and the boundary value of exactly 2000 characters SHALL be accepted.
   */
  it('accepts boundary values: exactly 1 character and exactly 2000 characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(1, 2000),
        fc.integer({ min: 0x0041, max: 0x005a }).map((c) => String.fromCharCode(c)),
        (targetLength, fillChar) => {
          const value = fillChar.repeat(targetLength);
          expect(validateSectionTextField(value)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
