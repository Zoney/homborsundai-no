import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/firebaseAdmin'; // Import Firestore instance

const REGISTRATIONS_COLLECTION = 'summitRegistrations';

// Validate Turnstile token
async function validateTurnstileToken(token: string, ip: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
  formData.append('response', token);
  formData.append('remoteip', ip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/summit/register: Received request');
  try {
    const body = await request.json();
    console.log('POST /api/summit/register: Request body:', body);
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!body.turnstileToken) {
      return NextResponse.json(
        { error: 'Security verification is required' },
        { status: 400 }
      );
    }

    const clientIP = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.log('POST /api/summit/register: Client IP:', clientIP);
    const isValidToken = await validateTurnstileToken(body.turnstileToken, clientIP);
    console.log('POST /api/summit/register: Turnstile token validation result:', isValidToken);
    
    if (!isValidToken) {
      console.error('POST /api/summit/register: Turnstile validation failed.');
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }
    
    const registrationId = `registration:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    console.log('POST /api/summit/register: Generated Registration ID:', registrationId);
    
    const registrationData = {
      id: registrationId,
      name: body.name.trim(),
      email: body.email?.trim() || '',
      phone: body.phone?.trim() || '',
      comment: body.comment?.trim() || '',
      summit: body.summit || '2025.2',
      timestamp: body.timestamp || new Date().toISOString(),
      ip: clientIP,
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    console.log('POST /api/summit/register: Registration data to save:', registrationData);
    
    // Save to Firestore
    console.log(`POST /api/summit/register: Attempting to save to Firestore collection '${REGISTRATIONS_COLLECTION}', document ID '${registrationId}'`);
    await db.collection(REGISTRATIONS_COLLECTION).doc(registrationId).set(registrationData);
    console.log('POST /api/summit/register: Successfully saved to Firestore.');
        
    revalidateTag('summit-registrations-tag');
    console.log('POST /api/summit/register: Revalidated tag summit-registrations-tag.');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        id: registrationId 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('POST /api/summit/register: Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection(REGISTRATIONS_COLLECTION).count().get();
    const count = snapshot.data().count;
    return NextResponse.json(
      { count: count || 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching registration count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 