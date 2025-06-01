import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache, revalidateTag } from 'next/cache';
import { db } from '@/lib/firebaseAdmin'; // Import Firestore instance
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const REGISTRATIONS_COLLECTION = 'summitRegistrations';

interface RegistrationDoc {
  summit: string;
  // Add other fields from your registration data if needed for this route
}

const getRegistrations = unstable_cache(
  async () => {
    const snapshot = await db.collection(REGISTRATIONS_COLLECTION).get();
    
    if (snapshot.empty) {
      return { summitCounts: {}, totalCount: 0 };
    }
    
    const validRegistrations = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as RegistrationDoc);
    
    const summitCounts = validRegistrations.reduce((acc: Record<string, number>, reg: RegistrationDoc) => {
      acc[reg.summit] = (acc[reg.summit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalCount = validRegistrations.length;
    
    return { summitCounts, totalCount };
  },
  ['summit-registrations'], // Cache key
  { tags: ['summit-registrations-tag'] } // Cache tag for revalidation
);

export async function GET(request: NextRequest) {
  try {
    const data = await getRegistrations();
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 