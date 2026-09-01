import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const VALID_STATUSES = ['new', 'read', 'archived'];

/**
 * PATCH /api/admin/inquiries/[id]
 *
 * Update an inquiry's status. Protected by middleware.
 * Body: { status: 'new' | 'read' | 'archived' }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const status = body?.status;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceInquiry.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/inquiries/[id]
 *
 * Permanently delete an inquiry. Protected by middleware.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.serviceInquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
