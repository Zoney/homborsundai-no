import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-4xl font-bold">Homborsund AI Community</h1>
      <p className="text-center text-gray-600 max-w-xl">
        We are a group of enthusiasts exploring artificial intelligence together.
        Join us for summits, community gatherings and articles written by our
        members.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/community" className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800">
          Learn about the Community
        </Link>
        <Link href="/summits" className="bg-rose-800 text-white px-6 py-3 rounded-md hover:bg-rose-700">
          Explore Summits
        </Link>
        <Link href="/articles" className="bg-indigo-700 text-white px-6 py-3 rounded-md hover:bg-indigo-600">
          Read Articles
        </Link>
      </div>
    </main>
  );
}
