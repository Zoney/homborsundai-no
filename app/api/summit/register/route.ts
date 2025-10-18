import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createRegistration, getConvexClient } from '@/lib/registrations';
import { sendTicketEmail } from '@/lib/email';
import { notifySummitSignup } from '@/lib/slack';
import { normalizeSummitRegistrationKey } from '@/lib/summit-config';

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
    
    const summitKey = normalizeSummitRegistrationKey(typeof body.summit === 'string' ? body.summit : null);

    const registrationData = {
      id: registrationId,
      name: body.name.trim(),
      email: body.email?.trim() || '',
      phone: body.phone?.trim() || '',
      comment: body.comment?.trim() || '',
      // Use the normalized summit key so downstream views map correctly.
      summit: summitKey,
      timestamp: body.timestamp || new Date().toISOString(),
      ip: clientIP,
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    console.log('POST /api/summit/register: Registration data to save:', registrationData);
    
    // Save to Convex
    console.log(`POST /api/summit/register: Attempting to save to Convex collection '${REGISTRATIONS_COLLECTION}', document ID '${registrationId}'`);
    await createRegistration(registrationData);
    console.log('POST /api/summit/register: Successfully saved to Convex.');

    await notifySummitSignup(registrationData);

    revalidateTag('summit-registrations-tag');
    console.log('POST /api/summit/register: Revalidated tag summit-registrations-tag.');

    if (registrationData.email) {
      await sendTicketEmail(registrationData.email, registrationId);
    }
    
    const ticketUrl = `/ticket/${registrationId}`;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        id: registrationId,
        ticketUrl: ticketUrl
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
    // Optional: Implement a Convex count or compute on the fly
    // Keeping simple by querying all and counting may be heavy at scale; using Convex query 'count' instead.
    const { api } = await import('@/convex/_generated/api');
    const client = getConvexClient();
    const count = (await client.query(api.registrations.count, {})) as number;
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
