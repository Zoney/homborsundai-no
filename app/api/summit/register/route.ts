import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis with custom environment variables
const redis = new Redis({
  url: process.env.UPSTASH_HAI_KV_REST_API_URL!,
  token: process.env.UPSTASH_HAI_KV_REST_API_TOKEN!,
});

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
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate Turnstile token
    if (!body.turnstileToken) {
      return NextResponse.json(
        { error: 'Security verification is required' },
        { status: 400 }
      );
    }

    const clientIP = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const isValidToken = await validateTurnstileToken(body.turnstileToken, clientIP);
    
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }
    
    // Create a unique ID for this registration
    const registrationId = `registration:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare the registration data
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
    
    // Save to Redis
    await redis.set(registrationId, registrationData);
    
    // Also add to a list for easy retrieval
    await redis.lpush('summit:registrations', registrationId);
    
    // Optionally, keep a count
    await redis.incr('summit:registration_count');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        id: registrationId 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const count = await redis.get('summit:registration_count');
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