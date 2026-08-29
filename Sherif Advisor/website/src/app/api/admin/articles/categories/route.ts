import { NextRequest, NextResponse } from 'next/server';

// Hardcoded categories — can be extended to DB-backed later
const DEFAULT_CATEGORIES = [
  'Advisory',
  'Market Updates',
  'Regulatory',
  'Industry Insights',
  'General',
];

// In-memory store for added categories (resets on server restart)
// This is a placeholder until a categories table is added to the schema
const additionalCategories: string[] = [];

function getAllCategories(): string[] {
  return [...DEFAULT_CATEGORIES, ...additionalCategories];
}

// ============================================
// GET /api/admin/articles/categories
// ============================================

/**
 * GET /api/admin/articles/categories
 *
 * Returns all available article categories.
 * Protected by middleware (admin session already validated).
 *
 * Response: { categories: string[] }
 */
export async function GET() {
  try {
    return NextResponse.json({ categories: getAllCategories() });
  } catch (error) {
    console.error('Failed to list categories:', error);
    return NextResponse.json(
      { error: 'Failed to list categories' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/articles/categories
// ============================================

/**
 * POST /api/admin/articles/categories
 *
 * Add a new article category.
 * Protected by middleware (admin session already validated).
 *
 * Request body: { name: string }
 * Validates: name is non-empty, max 50 chars, not a duplicate.
 * Returns 201 with { category: string } on success, 400 on validation failure.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name } = body;

    // Validate name is present and is a string
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Validate non-empty after trimming
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: 'Category name cannot be empty' },
        { status: 400 }
      );
    }

    // Validate max length
    if (trimmedName.length > 50) {
      return NextResponse.json(
        { error: 'Category name must be at most 50 characters' },
        { status: 400 }
      );
    }

    // Check for duplicates (case-insensitive)
    const allCategories = getAllCategories();
    const isDuplicate = allCategories.some(
      (cat) => cat.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Add category (in-memory for now)
    additionalCategories.push(trimmedName);

    return NextResponse.json({ category: trimmedName }, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
