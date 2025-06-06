import { db } from './firebaseAdmin';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

const REGISTRATIONS_COLLECTION = 'summitRegistrations';

// Define a type for the registration data
interface RegistrationData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  comment?: string;
  summit: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  [key: string]: any; // Allow other fields
}

export async function getAllRegistrations(): Promise<RegistrationData[]> {
  const snapshot = await db.collection(REGISTRATIONS_COLLECTION).get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as RegistrationData);
}

export async function getRegistrationsForSummit(summit: string): Promise<RegistrationData[]> {
  const snapshot = await db
    .collection(REGISTRATIONS_COLLECTION)
    .where('summit', '==', summit)
    .get();

  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as RegistrationData);
}

export async function getRegistration(id: string): Promise<RegistrationData | null> {
  const docRef = db.collection(REGISTRATIONS_COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as RegistrationData;
}

export async function updateRegistration(id: string, data: Partial<RegistrationData>): Promise<RegistrationData | null | undefined> {
  const docRef = db.collection(REGISTRATIONS_COLLECTION).doc(id);
  // Check if the document exists before attempting to update
  const doc = await docRef.get();
  if (!doc.exists) {
    // Or throw an error, or handle as appropriate for your application
    console.warn(`Document with id ${id} not found. Cannot update.`);
    return null; 
  }
  await docRef.update(data);
  const updatedDoc = await docRef.get();
  return updatedDoc.data() as RegistrationData | undefined;
}

export async function deleteRegistration(id: string): Promise<void> {
  const docRef = db.collection(REGISTRATIONS_COLLECTION).doc(id);
  await docRef.delete();
}
