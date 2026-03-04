import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRegistration, updateRegistration, deleteRegistration } from '@/lib/registrations';

export async function GET(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const reg = await getRegistration(params.id);
  if (!reg) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(reg);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const updated = await updateRegistration(params.id, data);
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteRegistration(params.id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete registration:", error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
