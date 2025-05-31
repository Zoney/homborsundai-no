import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Initialize Redis with custom environment variables
const redis = new Redis({
  url: process.env.UPSTASH_HAI_KV_REST_API_URL!,
  token: process.env.UPSTASH_HAI_KV_REST_API_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    // Get all registration IDs
    const registrationIds = await redis.lrange('summit:registrations', 0, -1);
    
    if (!registrationIds || registrationIds.length === 0) {
      return NextResponse.json(
        { summitCounts: {}, totalCount: 0 },
        { status: 200 }
      );
    }
    
    // Get all registration data
    const registrations = await Promise.all(
      registrationIds.map(async (id) => {
        const data = await redis.get(id) as { summit: string } | null;
        return data;
      })
    );
    
    // Filter out any null results
    const validRegistrations = registrations.filter(reg => reg !== null) as { summit: string }[];
    
    // Group by summit and count
    const summitCounts = validRegistrations.reduce((acc, reg) => {
      acc[reg.summit] = (acc[reg.summit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get total count from the length of valid registrations, or from Redis if preferred
    const totalCount = validRegistrations.length;
    
    return NextResponse.json(
      {
        summitCounts: summitCounts,
        totalCount: totalCount
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 