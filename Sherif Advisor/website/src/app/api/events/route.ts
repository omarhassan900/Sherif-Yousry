import { NextRequest, NextResponse } from 'next/server';
// ⚠️ Adjust this import path to match where you saved the Public Content Delivery Module
import { getPublishedEvents } from '@/lib/public-content'; 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const lang = (searchParams.get('lang') as 'ar' | 'en') || 'en';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const category = searchParams.get('category') || undefined; // e.g., 'workshop', 'seminar'

    // Use the module function
    const result = await getPublishedEvents(lang, page, category);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' }, 
      { status: 500 }
    );
  }
}