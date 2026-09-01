import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  serviceInquirySchema,
  sanitizeInput,
  logAuditEvent,
} from '@/lib/security';

/**
 * POST /api/contact
 *
 * Handles contact form submissions. Persists them as ServiceInquiry records
 * with source="contact" so they appear alongside service inquiries in the
 * admin panel. The "helpWith" selection is used as the service name label.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = serviceInquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'بيانات غير صالحة', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;
    const serviceName = data.helpWith?.trim() || 'General Inquiry';

    const inquiry = await prisma.serviceInquiry.create({
      data: {
        serviceName,
        source: 'contact',
        name: sanitizeInput(data.name),
        email: data.email.toLowerCase().trim(),
        phone: data.phone ? sanitizeInput(data.phone) : null,
        countryCode: data.countryCode ? sanitizeInput(data.countryCode) : null,
        businessActivity: data.businessActivity
          ? sanitizeInput(data.businessActivity)
          : null,
        country: data.country ? sanitizeInput(data.country) : null,
        helpWith: data.helpWith ? sanitizeInput(data.helpWith) : null,
        consent: data.consent ?? false,
        message: data.message ? sanitizeInput(data.message) : null,
        ipAddress: request.headers.get('x-forwarded-for') || null,
      },
      select: { id: true },
    });

    logAuditEvent({
      timestamp: new Date().toISOString(),
      userId: 'anonymous',
      action: 'contact_form_submit',
      resource: '/api/contact',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { inquiryId: inquiry.id, helpWith: serviceName },
    });

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
