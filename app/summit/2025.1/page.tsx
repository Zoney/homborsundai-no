"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle, Lightbulb, Users } from "lucide-react";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import { SUMMIT_METADATA } from "@/lib/summit-config";
import messages from "../../../messages/en.json";
import { useTranslations } from "next-intl";

const YEAR = "2025.1";

export default function Summit2025_1Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  
  const t = useTranslations('Summits.2025.1');

  const description = messages.Summits["2025.1"].description;

  const schedule = messages.Summits["2025.1"].schedule.map((item) => {
    const [time, event] = item.split('|');
    return { time, event };
  });

  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <SummitHeader 
        activeYear={YEAR} 
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={description}
      />
      
      {/* Navigation links for 2025.1 */}
      <section className="w-full py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center text-rosebud-200">{t('navHeading')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#schedule">{t('navLinks.schedule')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#topics">{t('navLinks.topics')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#norwegian">{t('navLinks.norwegian')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#attend">{t('navLinks.attend')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#speakers">{t('navLinks.speakers')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#venue">{t('navLinks.venue')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-copperrose text-copperrose hover:bg-copperrose hover:text-white flex items-center justify-center text-base py-3">
                <a href="#experience">{t('navLinks.experience')}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-rosebud text-rosebud hover:bg-rosebud hover:text-tarawera flex items-center justify-center text-base py-3 col-span-2 md:col-span-1 lg:col-span-1">
                <a href="#register">{t('navLinks.register')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SummitSchedule schedule={schedule} />
      
      {/* Hot Topics section */}
      <section id="topics" className="w-full py-12 md:py-16 scroll-mt-16 bg-tarawera bg-opacity-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm inline-block">Hot Topics</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose mb-3">2025&apos;s Cutting-Edge AI Trends</h2>
            <p className="max-w-[700px] text-rosebud-200 md:text-lg mx-auto">
              Our summit will explore the most revolutionary AI developments just emerging in 2025, including agentic models like OpenAI&apos;s o4-mini.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "o4-mini & o3: Next-Gen Reasoning & Multimodality", description: "Dive into OpenAI&apos;s newest models (o4-mini, o3) combining advanced reasoning with multimodal skills (image analysis, generation) and agentic tool use via interfaces like Codex CLI.", number: "01" },
              { title: "Agentic AI: Models That Act", description: "Explore how models like o4-mini are becoming agents, capable of using tools (Python, web search, image analysis) autonomously to solve complex, multi-step problems.", number: "02" },
              { title: "NVIDIA&apos;s H200 vs DeepSeek Revolution", description: "The great silicon showdown: NVIDIA&apos;s $40,000 H200 GPUs power most AI, but DeepSeek&apos;s R1 model challenges this dominance with a radically different approach that bypasses traditional APIs.", number: "03" },
              { title: "ML&apos;s Renaissance: XGBoost Strikes Back", description: "While GenAI hogs the spotlight, traditional machine learning frameworks have evolved—sometimes outperforming transformer models with 1/1000th the parameters. Come witness XGBoost&apos;s revenge tour.", number: "04" },
              { title: "MoE Architecture: When One Expert Isn&apos;t Enough", description: "DeepSeek&apos;s 671B parameter Mixture-of-Experts model demonstrates how specialized neural pathways—not just raw parameter count—drive breakthrough performance at a fraction of the training cost.", number: "05" },
              { title: "Benchmarking Agent Intelligence", description: "How do we measure the &apos;intelligence&apos; of models like o4-mini when they can use tools and interact multimodally? Explore the latest benchmarks and evaluation techniques.", number: "06" },
              { title: "General Purpose Agents & Robotics", description: "Beyond specialized tasks: discussing the roadmap towards general-purpose AI agents that can learn, adapt, and potentially operate in the physical world as robots.", number: "07" }
            ].map((topic, index) => (
              <Card key={index} className="bg-ferra border-ferra-600 shadow-xl rounded-xl overflow-hidden hover:shadow-rosebud/30 hover:border-rosebud/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-rosebud-100">{topic.title}</CardTitle>
                    <div className="border border-copperrose text-copperrose text-lg font-bold px-2 py-1 rounded">{topic.number}</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-rosebud-300 text-sm">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Norwegian ML Experience section */}
      <section id="norwegian" className="w-full py-12 md:py-16 scroll-mt-16 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm inline-block">Norwegian ML Experience</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose mb-3">Machine Learning, Norwegian Style</h2>
            <p className="max-w-[700px] text-rosebud-200 md:text-lg mx-auto">
              What Norway lacks in silicon, we make up for in scenic beauty and philosophical clarity.
            </p>
          </div>
          
          <div className="mx-auto max-w-3xl w-full">
            <Card className="bg-ferra border-ferra-600 shadow-xl rounded-xl overflow-hidden p-6 md:p-8">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-3xl font-semibold text-rosebud-100 text-center">The Norwegian ML Philosophy</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-rosebud-200 text-left space-y-4">
                <p>
                  While Silicon Valley argues about which $100 million model is best, Norwegians have been quietly applying ML in practical ways that actually help people. Learn how:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-copperrose">
                  <li><span className="font-semibold text-rosebud-100">Neural nets for fishing forecasts:</span> Local ML models predict optimal fishing conditions with 85% accuracy using 1000x less compute than a single ChatGPT query</li>
                  <li><span className="font-semibold text-rosebud-100">Random forests for actual forests:</span> Predicting bark beetle outbreaks using lightweight ML that runs on solar power</li>
                  <li><span className="font-semibold text-rosebud-100">Gradient boosting vs. avalanches:</span> How a 5MB model saves lives every winter</li>
                  <li><span className="font-semibold text-rosebud-100">When your utedo needs AI:</span> (Trick topic - utedos definitely don&apos;t need AI, and that&apos;s the point!)</li>
                </ul>
                <p className="italic text-copperrose pt-2">
                  &quot;Sometimes the most advanced technology is knowing when to use no technology at all.&quot; — Norwegian proverb we just made up but sounds legit
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Attend section */}
      <section id="attend" className="w-full py-12 md:py-16 scroll-mt-16 bg-ferra bg-opacity-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm inline-block">How to Attend</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose mb-3">Join the Conversation</h2>
            <p className="max-w-[700px] text-rosebud-200 md:text-lg mx-auto">
              The Homborsund AI Summit is an invitation... that you extend to yourself.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-ferra border-ferra-600 shadow-xl rounded-xl overflow-hidden hover:shadow-rosebud/30 hover:border-rosebud/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6">
              <HelpCircle className="w-16 h-16 text-copperrose mb-6" />
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-2xl font-semibold text-rosebud-100">Want to Attend?</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-rosebud-300">
                  That&apos;s the first and most important step. If you&apos;re reading this and thinking &quot;I&apos;d like to be there&quot; - congratulations, you&apos;ve completed the most crucial part of the registration process.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-ferra border-ferra-600 shadow-xl rounded-xl overflow-hidden hover:shadow-rosebud/30 hover:border-rosebud/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6">
              <Lightbulb className="w-16 h-16 text-copperrose mb-6" />
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-2xl font-semibold text-rosebud-100">Know Something</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-rosebud-300">
                  Bring your knowledge—whether it&apos;s vast expertise in transformer architectures or just a persistent curiosity about why ChatGPT hallucinates your birthday. What matters is what YOU know, and what YOU want to learn.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-ferra border-ferra-600 shadow-xl rounded-xl overflow-hidden hover:shadow-rosebud/30 hover:border-rosebud/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6">
              <Users className="w-16 h-16 text-copperrose mb-6" />
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-2xl font-semibold text-rosebud-100">Tell Someone</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-rosebud-300">
                  Invite yourself by clicking the registration link, then tell a fellow AI enthusiast about the summit. The best learning happens in small groups of passionate people—each person you invite enriches the experience for everyone.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-ferra border-ferra-600 shadow-xl rounded-xl overflow-hidden p-6 md:p-8 border-l-4 border-copperrose mb-12">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-2xl font-semibold text-rosebud-100">The Self-Invitation Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-rosebud-200 space-y-3">
              <p>
                Unlike mainstream conferences with prohibitive price tags and elaborate registration processes, we believe in simplicity. If you feel called to join our gathering of minds, we trust that you&apos;ll:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-copperrose">
                <li><strong>Bring the right spirit</strong> — A blend of curiosity, openness, and willingness to disconnect from technology to connect with ideas and people</li>
                <li><strong>Contribute to the potluck</strong> — Both literally (bring food/drinks) and figuratively (bring ideas, questions, and enthusiasm)</li>
                <li><strong>Extend the circle</strong> — Invite someone who would add value to our discussions (but remember space is limited)</li>
              </ul>
              <p className="italic text-copperrose pt-2">
                &quot;The best gatherings are those where each person feels personally responsible for its success.&quot;
              </p>
            </CardContent>
          </Card>
          
          <div className="flex flex-col items-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-rosebud/50 transition-all duration-300 transform hover:scale-105">
              <Link href="https://chat.whatsapp.com/FWv18Iz2r59CuQb98LBuUQ">
                I&apos;m Inviting Myself
              </Link>
            </Button>
            <p className="text-sm text-rosebud-300 mt-3">
              Join our WhatsApp community and introduce yourself
            </p>
          </div>
        </div>
      </section>

      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
      
      {/* Experience section */}
      <section id="experience" className="w-full py-12 md:py-24 lg:py-32 bg-ferra bg-opacity-30 scroll-mt-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-block rounded-lg bg-rosebud px-3 py-1 text-sm text-tarawera">The Experience</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Back to Our Roots</h2>
            <p className="max-w-[700px] text-rosebud-200 md:text-xl">
              Embracing the authentic Norwegian experience, our summit offers a refreshing departure from the usual tech-laden conferences.
            </p>
            
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-rosebud-100">Authentic Facilities</h3>
                <div className="space-y-2">
                  <p className="text-rosebud-300">
                    <span className="font-semibold text-rosebud-100">Traditional &quot;Utedo&quot;:</span> Experience our charming Norwegian outdoor toilet facility, a perfect opportunity to connect with nature while disconnecting from technology.
                  </p>
                  <p className="text-rosebud-300">
                    <span className="font-semibold text-rosebud-100">No Electricity or Running Water:</span> Detach completely from digital dependencies. We&apos;ll use candles, lanterns, and stars to light our discussions—just like the pioneers of science and philosophy did for centuries.
                  </p>
                  <p className="text-rosebud-300">
                    <span className="font-semibold text-rosebud-100">What to Bring:</span> A flashlight, comfortable warm clothes, your favorite drinks, and food to share. We&apos;ll provide basic necessities, warm fires, and plenty of inspiration.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-rosebud-100">Why Unplug?</h3>
                <div className="space-y-2">
                  <p className="text-rosebud-300">
                    As AI models like GPT-4.5 Orion and Claude 3.7 become increasingly natural in conversation and ever more capable, our summit offers a counterpoint: genuine human connection in its purest form.
                  </p>
                  <p className="text-rosebud-300">
                    In a world where AI can now generate working code, create interactive visualizations, and solve complex math problems with ease, we believe that human creativity still flourishes best in nature, away from screens.
                  </p>
                  <p className="text-rosebud-300">
                    <span className="italic text-copperrose">&quot;Some of my best ideas came when I was furthest from technology.&quot;</span> — Previous attendee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SummitRegistration activeYear={YEAR} status={summitInfo.status} />
    </main>
  );
} 