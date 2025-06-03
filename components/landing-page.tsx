/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Assuming these are now available
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Assuming these are now available
import { Button } from "@/components/ui/button"; // Assuming this is now available
import { ArrowRight } from "lucide-react"; // Assuming lucide-react is available

// Placeholder icons (actual icons would be imported from lucide-react or similar)
// import { Users, Zap, Lightbulb, Eye, Brain, UsersRound, MessageSquare } from "lucide-react";
// const UsersIcon = Users;
// const ZapIcon = Zap;
// const LightbulbIcon = Lightbulb;
// const EyeIcon = Eye;
// const BrainIcon = Brain;
// const UsersRoundIcon = UsersRound;
// const MessageSquareIcon = MessageSquare;


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-cool text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 lg:py-40 px-4 md:px-6 bg-opacity-50">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-down">
          Homborsund AI: <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Ignite Your AI Journey</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-rosebud-200 max-w-3xl mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Step into the epicenter of AI innovation. Connect with brilliant minds, explore groundbreaking ideas, and collaboratively shape the future. This is where AI&apos;s brightest sparks converge. Don&apos;t just witness the future – create it with us.
        </p>
        <Link href="/summit">
          <Button size="lg" className="bg-copperrose hover:bg-copperrose-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
            Explore the Summit <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Carousel Section: "Why Homborsund AI?" */}
      <section className="py-16 md:py-24 bg-tarawera bg-opacity-70">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Homborsund AI</span>?
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {[
                { title: "Unlock Collective Genius", description: "Connect with a vibrant community of AI pioneers, researchers, and practitioners. Forge collaborations that redefine what's possible.", IconName: "UsersIcon" },
                { title: "Ride the Wave of Innovation", description: "Immerse yourself in cutting-edge discussions, workshops, and presentations. Stay ahead of the curve in the ever-evolving AI landscape.", IconName: "ZapIcon" },
                { title: "Be the Architect of Tomorrow", description: "Contribute to impactful projects and initiatives. Homborsund AI is your platform to influence the trajectory of artificial intelligence.", IconName: "LightbulbIcon" },
                { title: "Experience Exclusive Insights", description: "Gain access to unique perspectives and deep dives not found anywhere else. This is the forefront of AI thought leadership.", IconName: "EyeIcon" }
              ].map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full"> {/* Added h-full for consistent card height */}
                    <Card className="bg-ferra border-ferra-600 hover:shadow-rosebud/30 shadow-lg transition-shadow duration-300 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        {/* Icon placeholder: e.g. <item.Icon className="w-8 h-8 text-rosebud" /> */}
                        <div className="w-8 h-8 bg-rosebud rounded-full animate-pulse" /> {/* Simple animated placeholder for icon */}
                        <CardTitle className="text-2xl font-semibold text-rosebud-100">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow"> {/* Added flex-grow to allow content to expand */}
                        <p className="text-rosebud-300">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white bg-ferra-700 hover:bg-ferra-600 disabled:opacity-50" /> {/* Added disabled state style */}
            <CarouselNext className="text-white bg-ferra-700 hover:bg-ferra-600 disabled:opacity-50" /> {/* Added disabled state style */}
          </Carousel>
        </div>
      </section>

      {/* Features/Highlights Section using Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Homborsund AI</span> Advantage
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Deep Dives, Not Shallow Skims", description: "Engage in profound discussions and hands-on sessions that go beyond surface-level understanding. Truly grasp the nuances of emerging AI.", IconName: "BrainIcon" },
              { title: "Community-Driven Collaboration", description: "More than just an event, we are a year-round ecosystem for shared growth, open-source projects, and mutual support.", IconName: "UsersRoundIcon" },
              { title: "Unfiltered, Authentic Exchange", description: "Experience raw, honest dialogue in an intimate setting. No corporate fluff, just genuine passion for AI's potential.", IconName: "MessageSquareIcon" }
            ].map((feature) => (
              <Card key={feature.title} className="bg-ferra bg-opacity-60 border-ferra-600 hover:border-copperrose transition-all duration-300 transform hover:-translate-y-2 shadow-xl hover:shadow-copperrose/40 flex flex-col"> {/* Intensified hover:translate-y-2 */}
                <CardHeader>
                  {/* Icon placeholder: e.g. <BrainIcon className="w-10 h-10 text-copperrose mb-4" /> */}
                  <div className="w-10 h-10 bg-copperrose rounded-lg mb-4 animate-pulse" /> {/* Simple animated placeholder */}
                  <CardTitle className="text-3xl font-bold text-rosebud-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow"> {/* Added flex-grow */}
                  <p className="text-rosebud-200 text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Section: Glimpse into 2025: The AI Horizon */}
      <section className="py-16 md:py-24 bg-ferra bg-opacity-40">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            Glimpse into 2025: <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">The AI Horizon</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Embodied AI: Intelligence in Motion",
                description: "Beyond screens and servers. Explore how AI is stepping into the physical world through robotics and interactive agents. Homborsund AI will be at the forefront, discussing the interfaces and ethics of embodied intelligence.",
                IconName: "BotIconPlaceholder" // Placeholder for BotIcon or similar
              },
              {
                title: "AI as a Catalyst for Discovery",
                description: "Witness AI accelerating scientific breakthroughs, from material science to drug discovery. We&apos;ll delve into how AI models are becoming indispensable partners in research.",
                IconName: "FlaskConicalIconPlaceholder" // Placeholder for FlaskConicalIcon or similar
              },
              {
                title: "The Evolving Human-AI Partnership",
                description: "The future isn&apos;t AI versus human, but AI with human. Discuss the future of work, creativity, and problem-solving as we build more intuitive and collaborative AI systems.",
                IconName: "UsersIconPlaceholder" // Placeholder for UsersIcon or similar
              }
            ].map((trend) => (
              <Card 
                key={trend.title} 
                className="bg-ferra bg-opacity-70 border-ferra-600 hover:border-rosebud transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-rosebud/50 flex flex-col"
              >
                <CardHeader>
                  {/* Icon placeholder: e.g. <TrendingUpIcon className="w-10 h-10 text-rosebud mb-4" /> */}
                  <div className="w-10 h-10 bg-rosebud rounded-lg mb-4 animate-pulse" /> {/* Simple animated placeholder for icon */}
                  <CardTitle className="text-2xl font-bold text-rosebud-100">{trend.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-rosebud-200 text-lg">{trend.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-32 text-center bg-tarawera bg-opacity-80">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Be Part of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Next Wave</span>?
          </h2>
          <p className="text-lg md:text-xl text-rosebud-200 max-w-2xl mx-auto mb-10">
            The future of AI is not just coming; it's being built right here, right now. Join Homborsund AI and leave your mark.
          </p>
          <Link href="/summit">
            <Button size="lg" className="bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white font-bold py-4 px-10 rounded-xl text-xl shadow-2xl hover:shadow-rosebud/50 transition-all duration-300 transform hover:scale-105">
              Dive Into the Summit Details
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-rosebud-300 border-t border-ferra-600">
        <p>&copy; {new Date().getFullYear()} Homborsund AI. Org. nr: 935616913. The Future is Collaborative.</p>
      </footer>
    </div>
  );
}
/* eslint-enable react/no-unescaped-entities */
