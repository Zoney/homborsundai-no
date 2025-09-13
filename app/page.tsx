import LandingPage from "@/components/landing-page";

export const revalidate = 3600; // cache homepage for 1 hour

export default function Home() {
  return <LandingPage />;
}
