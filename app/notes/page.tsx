import Link from "next/link";
import { NOTES } from "@/lib/notes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Community Notes | Homborsund AI",
  description: "Updates, ideas, and notes from the Homborsund AI community.",
  alternates: { canonical: "/notes" },
};

export const revalidate = 3600;

export default function NotesIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-cool text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Community Notes</h1>
        <p className="text-rosebud-200 mb-10 max-w-3xl">
          Informal notes and updates from our community. We’ll pick these topics up
          and go deeper together at the next summit.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {NOTES.map((note) => (
            <Card key={note.slug} className="bg-tarawera/70 border-ferra-600">
              <CardHeader>
                <CardTitle className="text-rosebud-50">{note.title}</CardTitle>
                <CardDescription className="text-rosebud-300">
                  {note.date} {note.author ? `• ${note.author}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-rosebud-200 mb-4">{note.summary}</p>
                <Link href={`/notes/${note.slug}`}>
                  <Button size="sm" className="bg-copperrose hover:bg-copperrose-600">Read</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
