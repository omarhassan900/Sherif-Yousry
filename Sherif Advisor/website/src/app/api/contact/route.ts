import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, sanitizeInput, logAuditEvent } from '@/lib/security';

/**
 * POST /api/contact
 * Handles contact form submissions with validation and rate limiting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'بيانات غير صالحة', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Sanitize all string fields
    const sanitizedData = {
      name: sanitizeInput(result.data.name),
      email: result.data.email.toLowerCase().trim(),
      phone: result.data.phone ? sanitizeInput(result.data.phone) : undefined,
      company: result.data.company
        ? sanitizeInput(result.data.company)
        : undefined,
      service: result.data.service,
      message: result.data.message
        ? sanitizeInput(result.data.message)
        : undefined,
    };

    // Log audit event
    logAuditEvent({
      timestamp: new Date().toISOString(),
      userId: 'anonymous',
      action: 'contact_form_submit',
      resource: '/api/contact',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { service: sanitizedData.service },
    });

    // TODO: Save to database
    // TODO: Send notification email to team
    // TODO: Send confirmation email to user

    return NextResponse.json(
      { message: 'تم إرسال طلبك بنجاح. سنتواصل معك خلال ٢٤ ساعة.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
