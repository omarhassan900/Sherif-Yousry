import { NextRequest, NextResponse } from 'next/server';
// ⚠️ Adjust this import path to match where you saved the Public Content Delivery Module
import { getPublishedEventById } from '@/lib/public-content'; 

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') as 'ar' | 'en') || 'en';
    const { id } = params;

    // Use the module function to get a single event with language fallback
    const event = await getPublishedEventById(id, lang);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or unpublished' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' }, 
      { status: 500 }
    );
  }
}