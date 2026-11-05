import AdminActivity from '@/components/admin-activity';

export const dynamic = 'force-dynamic';

export default function ActivityPage() {
  return (
    <main className="container mx-auto py-10 space-y-4">
      <h1 className="text-3xl font-bold">Activity log</h1>
      <p className="text-sm text-muted-foreground">
        Who signed up, cancelled, checked in, logged in, and got or lost admin. Kept for 24 months. No IP addresses.
      </p>
      <AdminActivity />
    </main>
  );
}
