/// <reference types="vitest/globals" />
/**
 * Property-based tests for content field validation.
 *
 * Feature: admin-portal-cms, Property 5: Content field validation enforces bilingual requirements
 *
 * For any content item submission, the validator SHALL accept it if and only if
 * both Arabic and English titles contain between 2 and 200 non-whitespace characters,
 * and both Arabic and English body fields contain at least 1 non-whitespace character.
 */

import * as fc from 'fast-check';
import {
  validateContentForm,
  stripHtml,
  countNonWhitespace,
  type ContentFormData,
} from '@/app/admin/components/ContentForm';

// ============================================
// HELPERS — Generators
// ============================================

/** Base content form data template with valid defaults */
function makeFormData(overrides: Partial<ContentFormData> = {}): ContentFormData {
  return {
    titleAr: 'عنوان',
    titleEn: 'Title',
    bodyAr: '<p>محتوى</p>',
    bodyEn: '<p>Content</p>',
    status: 'unpublished',
    type: 'article',
    metadata: {},
    ...overrides,
  };
}

/**
 * Arbitrary that generates a string with exactly `n` non-whitespace characters,
 * optionally interspersed with whitespace.
 */
function stringWithNonWhitespaceCount(min: number, max: number): fc.Arbitrary<string> {
  return fc
    .tuple(
      fc.array(
        fc.oneof(
          // Non-whitespace characters (letters, digits, Arabic chars, punctuation)
          fc.integer({ min: 0x0041, max: 0x005a }).map((c) => String.fromCharCode(c)),
          fc.integer({ min: 0x0061, max: 0x007a }).map((c) => String.fromCharCode(c)),
          fc.integer({ min: 0x0621, max: 0x064a }).map((c) => String.fromCharCode(c)), // Arabic
          fc.integer({ min: 0x30, max: 0x39 }).map((c) => String.fromCharCode(c)) // Digits
        ),
        { minLength: min, maxLength: max }
      ),
      fc.array(fc.constantFrom(' ', '\t'), { minLength: 0, maxLength: 5 })
    )
    .map(([chars, spaces]) => {
      // Intersperse some whitespace at random positions
      const result = [...chars];
      for (const sp of spaces) {
        const pos = Math.floor(Math.random() * (result.length + 1));
        result.splice(pos, 0, sp);
      }
      return result.join('');
    });
}

/**
 * Arbitrary that generates a valid title (2-200 non-whitespace characters).
 */
const validTitleArb = stringWithNonWhitespaceCount(2, 200);

/**
 * Arbitrary that generates a title that is too short (0 or 1 non-whitespace characters).
 */
const tooShortTitleArb = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('\t \t'),
  stringWithNonWhitespaceCount(1, 1)
);

/**
 * Arbitrary that generates a title that is too long (>200 non-whitespace characters).
 */
const tooLongTitleArb = stringWithNonWhitespaceCount(201, 250);

/**
 * Arbitrary that generates a valid body (at least 1 non-whitespace character,
 * possibly wrapped in HTML tags).
 */
const validBodyArb = fc
  .tuple(
    stringWithNonWhitespaceCount(1, 50),
    fc.boolean()
  )
  .map(([text, wrapHtml]) => (wrapHtml ? `<p>${text}</p>` : text));

/**
 * Arbitrary that generates an invalid body (no non-whitespace characters after stripping HTML).
 */
const invalidBodyArb = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('<p></p>'),
  fc.constant('<p>   </p>'),
  fc.constant('<div> \t \n </div>'),
  fc.constant('<p><span>  </span></p>')
);

/**
 * Arbitrary that generates a complete valid ContentFormData.
 */
const validContentFormArb = fc
  .tuple(validTitleArb, validTitleArb, validBodyArb, validBodyArb)
  .map(([titleAr, titleEn, bodyAr, bodyEn]) =>
    makeFormData({ titleAr, titleEn, bodyAr, bodyEn })
  );

// ============================================
// Property 5: Content field validation enforces bilingual requirements
// ============================================

describe('Feature: admin-portal-cms, Property 5: Content field validation enforces bilingual requirements', () => {
  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form data where all fields meet the bilingual requirements
   * (titles: 2-200 non-whitespace chars, bodies: ≥1 non-whitespace char),
   * validateContentForm SHALL return an empty errors object (acceptance).
   */
  it('accepts content when both titles have 2-200 non-whitespace chars and both bodies have ≥1 non-whitespace char', () => {
    fc.assert(
      fc.property(validContentFormArb, (formData) => {
        const errors = validateContentForm(formData);
        expect(Object.keys(errors)).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form with an Arabic title that is too short (<2 non-whitespace chars),
   * the validator SHALL reject it with an error on titleAr.
   */
  it('rejects content when Arabic title has fewer than 2 non-whitespace characters', () => {
    fc.assert(
      fc.property(
        tooShortTitleArb,
        validTitleArb,
        validBodyArb,
        validBodyArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const formData = makeFormData({ titleAr, titleEn, bodyAr, bodyEn });
          const errors = validateContentForm(formData);
          expect(errors.titleAr).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form with an English title that is too short (<2 non-whitespace chars),
   * the validator SHALL reject it with an error on titleEn.
   */
  it('rejects content when English title has fewer than 2 non-whitespace characters', () => {
    fc.assert(
      fc.property(
        validTitleArb,
        tooShortTitleArb,
        validBodyArb,
        validBodyArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const formData = makeFormData({ titleAr, titleEn, bodyAr, bodyEn });
          const errors = validateContentForm(formData);
          expect(errors.titleEn).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form with an Arabic title exceeding 200 non-whitespace characters,
   * the validator SHALL reject it with an error on titleAr.
   */
  it('rejects content when Arabic title exceeds 200 non-whitespace characters', () => {
    fc.assert(
      fc.property(
        tooLongTitleArb,
        validTitleArb,
        validBodyArb,
        validBodyArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const formData = makeFormData({ titleAr, titleEn, bodyAr, bodyEn });
          const errors = validateContentForm(formData);
          expect(errors.titleAr).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form with an English title exceeding 200 non-whitespace characters,
   * the validator SHALL reject it with an error on titleEn.
   */
  it('rejects content when English title exceeds 200 non-whitespace characters', () => {
    fc.assert(
      fc.property(
        validTitleArb,
        tooLongTitleArb,
        validBodyArb,
        validBodyArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const formData = makeFormData({ titleAr, titleEn, bodyAr, bodyEn });
          const errors = validateContentForm(formData);
          expect(errors.titleEn).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form with an Arabic body that has no non-whitespace characters
   * (after stripping HTML), the validator SHALL reject it with an error on bodyAr.
   */
  it('rejects content when Arabic body has no non-whitespace characters after HTML stripping', () => {
    fc.assert(
      fc.property(
        validTitleArb,
        validTitleArb,
        invalidBodyArb,
        validBodyArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const formData = makeFormData({ titleAr, titleEn, bodyAr, bodyEn });
          const errors = validateContentForm(formData);
          expect(errors.bodyAr).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * For any content form with an English body that has no non-whitespace characters
   * (after stripping HTML), the validator SHALL reject it with an error on bodyEn.
   */
  it('rejects content when English body has no non-whitespace characters after HTML stripping', () => {
    fc.assert(
      fc.property(
        validTitleArb,
        validTitleArb,
        validBodyArb,
        invalidBodyArb,
        (titleAr, titleEn, bodyAr, bodyEn) => {
          const formData = makeFormData({ titleAr, titleEn, bodyAr, bodyEn });
          const errors = validateContentForm(formData);
          expect(errors.bodyEn).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * The countNonWhitespace helper correctly counts only non-whitespace characters
   * for any arbitrary string.
   */
  it('countNonWhitespace matches manual count for any string', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 300 }), (str) => {
        const expected = str.split('').filter((ch) => !/\s/.test(ch)).length;
        expect(countNonWhitespace(str)).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.2, 4.7**
   *
   * The stripHtml helper removes all HTML tags, leaving only text content,
   * for any string wrapped in HTML-like tags.
   */
  it('stripHtml removes all HTML tags for any content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 100 }).filter((s) => !s.includes('<') && !s.includes('>')),
        fc.constantFrom('p', 'div', 'span', 'h1', 'strong', 'em'),
        (text, tag) => {
          const html = `<${tag}>${text}</${tag}>`;
          const stripped = stripHtml(html);
          expect(stripped).toBe(text);
        }
      ),
      { numRuns: 100 }
    );
  });
});
