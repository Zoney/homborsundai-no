import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex flex-col items-center p-8 space-y-12">
      <section className="text-center space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold">Welcome to Homborsund AI</h1>
        <p className="text-gray-600">
          Homborsund AI is a friendly community for anyone curious about the
          future of artificial intelligence. We meet to share ideas, learn from
          each other and occasionally host summits by the sea.
        </p>
        <p className="text-gray-600">
          Whether you&apos;re a seasoned researcher or just getting started, we
          invite you to join us. Explore our articles, take part in local meetups
          and connect with like-minded enthusiasts.
        </p>
      </section>

      <section className="w-full max-w-3xl space-y-4">
        <h2 className="text-3xl font-bold text-center">Get Involved</h2>
        <p className="text-center text-gray-600">
          Learn more about the community or check out our latest posts.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/community"
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            About the Community
          </Link>
          <Link
            href="/articles"
            className="bg-indigo-700 text-white px-6 py-3 rounded-md hover:bg-indigo-600"
          >
            Read Articles
          </Link>
        </div>
      </section>

      <section className="w-full max-w-3xl space-y-4 text-center">
        <h2 className="text-3xl font-bold">Next Summit</h2>
        <p className="text-gray-600">
          Our next gathering focuses on flashy agents and friendly robots. Join
          us by the coast for hands-on sessions and discussions.
        </p>
        <Link
          href="/summits"
          className="inline-block bg-rose-800 text-white px-8 py-3 rounded-md hover:bg-rose-700"
        >
          Explore Summits
        </Link>
      </section>
    </main>
  );
}
