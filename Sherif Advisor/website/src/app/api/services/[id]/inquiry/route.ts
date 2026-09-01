import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  serviceInquirySchema,
  sanitizeInput,
  logAuditEvent,
} from '@/lib/security';

/**
 * POST /api/services/[id]/inquiry
 *
 * Public endpoint. Accepts an inquiry submitted from a service detail page.
 * Stores it as a ServiceInquiry with a snapshot of the service name so the
 * admin can see which service the message came from, even if the service is
 * later renamed or deleted.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;

    // Look up the service to snapshot its name and confirm it exists.
    const service = await prisma.contentItem.findFirst({
      where: { id: serviceId, type: 'service' },
      select: { id: true, titleEn: true, titleAr: true, status: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = serviceInquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'بيانات غير صالحة', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const serviceName =
      service.titleEn?.trim() || service.titleAr?.trim() || 'Service';

    const inquiry = await prisma.serviceInquiry.create({
      data: {
        serviceId: service.id,
        serviceName,
        source: 'service',
        name: sanitizeInput(result.data.name),
        email: result.data.email.toLowerCase().trim(),
        phone: result.data.phone ? sanitizeInput(result.data.phone) : null,
        countryCode: result.data.countryCode
          ? sanitizeInput(result.data.countryCode)
          : null,
        businessActivity: result.data.businessActivity
          ? sanitizeInput(result.data.businessActivity)
          : null,
        country: result.data.country
          ? sanitizeInput(result.data.country)
          : null,
        helpWith: result.data.helpWith
          ? sanitizeInput(result.data.helpWith)
          : null,
        consent: result.data.consent ?? false,
        message: result.data.message
          ? sanitizeInput(result.data.message)
          : null,
        ipAddress: request.headers.get('x-forwarded-for') || null,
      },
      select: { id: true },
    });

    logAuditEvent({
      timestamp: new Date().toISOString(),
      userId: 'anonymous',
      action: 'service_inquiry_submit',
      resource: `/api/services/${serviceId}/inquiry`,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: { serviceId, serviceName, inquiryId: inquiry.id },
    });

    return NextResponse.json(
      { message: 'تم إرسال طلبك بنجاح. سنتواصل معك قريباً.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Service inquiry error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
