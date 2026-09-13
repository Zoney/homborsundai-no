"use client";

import { SummitHeader, SummitRegistration, SummitSchedule, SummitSpeakers, SummitVenue } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.2";

const SCHEDULE = [
  { time: "15-ish", event: "Doors open. The grill is already lit — we bring it, you bring whatever deserves to meet it, plus a drink that flatters AI (beer and wine have an enviable track record). Leave the laptop at home; the schoolhouse runs on candles and chalk, not sockets and screens." },
  { time: "17-ish", event: "Lars — Whose Memory Is It Anyway?" },
  { time: "17:30-ish", event: "Øyvind — No Slides. A Second Brain, Live." },
  { time: "18-ish", event: "Grill, round two — and the blackboard wiki. The whole room builds one together, in chalk, on the schoolhouse's old blackboard: you shout out what you know, the speakers draw the pages and the links. Not a laptop in sight." },
  { time: "18:45-ish", event: "Erik — Start Tonight: A Second Brain for the Price of a Pizza" },
  { time: "19:15-ish", event: "Special guest 1 — deliberately unannounced. Tradition says it is the one you end up quoting." },
  { time: "19:45-ish", event: "Cathrine — Empower Yourself. Then Your Whole Company." },
  { time: "20:15-ish", event: "Special guest 2 — also unannounced. A short talk, a strong opinion, or a demo that would not survive being described in advance." },
  { time: "20:45-ish", event: "Open floor: Ask the Wiki. Bring a question, we put it to a real wiki live, then argue about the answer." },
  { time: "Late-ish", event: "Bonfire. It ends when it ends." },
];

const TALKS = [
  {
    title: "Whose Memory Is It Anyway?",
    speaker: "Lars",
    body: "Lars opens with the uncomfortable inventory: the ideas you typed into a chat window last spring, the meeting notes spread across three apps, the voice memo you never replayed. None of it talks to each other, and none of it is really yours. Then the flip: what if all of it lived in one plain folder, and an AI did the filing, the linking and the remembering? No jargon survives this talk. If you have never opened an AI tool in your life, start here.",
  },
  {
    title: "No Slides. A Second Brain, Live.",
    speaker: "Øyvind",
    body: "Your host runs his life on one of these: hundreds of voice memos, emails, calendars and half-thoughts since spring, filed by an AI into more than a thousand cross-linked pages. No projector in the schoolhouse, so the demo goes analog: he records a memo on stage, lets the laptop transcribe and file it while you finish your sausage, then reads aloud what the wiki wrote and chalks up on the blackboard where it all went. Then he asks it a question no single note contains. Bring the awkward question.",
  },
  {
    title: "Start Tonight: A Second Brain for the Price of a Pizza",
    speaker: "Erik",
    body: "Erik is an enterprise architect who trusts nothing by default, so he built his wiki on a machine that does nothing else. He walks through the honest version of getting started: one folder, one text editor, one AI subscription that costs about as much as a pizza a month, and three rules that keep your private notes private. What goes in, what stays out, and why it lives on your machine rather than on someone else's. You will leave with a recipe, not a strategy.",
  },
  {
    title: "Special Guest 1",
    speaker: "Deliberately unannounced",
    body: "Every Homborsund summit keeps one slot off the website. Sometimes the speaker asked, sometimes the talk is not finished yet, and once we simply had not met them. It is a proud tradition, and it is usually the talk you quote on the way home. Loosely about the wiki. Everything is, if you squint.",
  },
  {
    title: "Empower Yourself. Then Your Whole Company.",
    speaker: "Cathrine",
    body: "Cathrine took a leadership group from AI-curious to AI-competent by going straight to the top: the CEO was dispatched to prompt school. Now the same idea at scale. What happens when the memory is not yours alone but the organisation's? Who owns it, who writes it, what leaves when people leave — and what a leader actually has to do before the strategy document exists. Bring the colleague who owns one.",
  },
  {
    title: "Special Guest 2",
    speaker: "Also unannounced",
    body: "The second wild card. A short talk, a strong opinion, or a demo that would not survive being described in advance. We are not saying who — partly for effect, partly because this schoolhouse has changed its own lineup before. Bring a follow-up question; this slot usually needs one.",
  },
];

const AUDIENCE = [
  {
    title: "You have never opened ChatGPT",
    body: "Then this is the summit to start at. Lars explains the whole idea without a single acronym, and by the second grill round the whole room has built a wiki together, in chalk, on the old blackboard. Nothing to install. Nothing to log in to.",
  },
  {
    title: "You use AI every day and lose it every Monday",
    body: "Everything you told a chat window last spring is gone. The wiki flips it: the AI keeps your notes, in files you own, and gets smarter about you every week instead of forgetting you every session.",
  },
  {
    title: "You run a team, and knowledge keeps walking out the door",
    body: "Handovers, onboarding, the customer only one person really knew. Cathrine shows what it takes for a whole company to remember — and what the leader has to do first.",
  },
  {
    title: "You have a project that outgrew your head",
    body: "The boat, the cabin, the renovation, the club you volunteer for. Every one of them now lives in receipts, a group chat and three notebooks. A wiki is where they finally meet.",
  },
];

const PROMPTS = [
  {
    label: "The Sunday reset",
    prompt: "Read my notes from the last seven days. What have I forgotten, what did I promise someone, and what should I do first tomorrow?",
    why: "The morning brief you never had time to write yourself.",
  },
  {
    label: "The brain dump",
    prompt: "Here is everything I know about my customers, straight from my head. Make one page per person and company, link them together, and ask me what is missing.",
    why: "Works just as well for recipes, a boat, or the club you volunteer for.",
  },
  {
    label: "The cabin renovation",
    prompt: "Here are all my notes, receipts and messages about the cabin renovation. What did the carpenter promise, what is still unpaid, and what did I decide about the kitchen?",
    why: "Nothing to do with work. That is rather the point.",
  },
  {
    label: "The contradiction hunt",
    prompt: "Find every place my notes contradict each other and ask me which version is true.",
    why: "An assistant that argues with you, with receipts.",
  },
  {
    label: "The handover",
    prompt: "My colleague is taking over this customer. Write the page she needs from everything I have noted, and mark what I am unsure about.",
    why: "Two years of context on one page — and it leaves with the page, not with the person.",
  },
  {
    label: "The question no note can answer",
    prompt: "What do I actually think about this? Go through everything I have written about it and show me where I changed my mind.",
    why: "This one only works once you have a wiki. That is the whole point of the evening.",
  },
];

export default function Summit2026_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];

  const description = [
    "Saturday 3 October 2026. Doors at 15:00 with the grill already lit, first talk at 17:00. Same schoolhouse without running water, same bonfire, still real. We checked twice.",
    "One theme this time, told four ways: the LLM wiki. A folder of plain-text notes that an AI reads, organises, cross-links and answers from. Yours. On your machine. Readable by any tool you will use, today and in ten years.",
    "Four talks, two special guests, one old blackboard, one bonfire. No laptops, no logins, nothing to install — the schoolhouse has chalk and candles, and that turns out to be plenty. Built for the AI-curious as much as the AI-fluent: if you can write a note, you can do this.",
  ];

  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <SummitHeader
        activeYear={YEAR}
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={description}
      />
      <SummitRegistration activeYear={YEAR} summit={summitInfo} />

      <section className="w-full py-12 md:py-16 bg-ferra/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">The Talks</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-rosebud to-copperrose">
              One idea, four ways in, two wild cards
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              Why it matters, what it looks like, how you start, and what happens when a whole company does it. Plus two guests we are not announcing. Then a bonfire.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {TALKS.map((item) => (
              <Card key={item.title} className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-rosebud-50 text-xl">{item.title}</CardTitle>
                  <p className="text-copperrose text-sm font-medium">{item.speaker}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-rosebud-200 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-tarawera/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">Who this is for</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-rosebud to-copperrose">
              Not just for the AI nerds. Especially not.
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              The people who get the most out of a second brain are the ones with the most going on and the least time to organise it.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {AUDIENCE.map((item) => (
              <Card key={item.title} className="bg-ferra/80 border-ferra-600 shadow-lg hover:border-copperrose transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-rosebud-50 text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rosebud-200 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="prompts" className="w-full py-12 md:py-16 bg-ferra/40 scroll-mt-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">Starter kit</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-rosebud to-copperrose">
              Prompts you can steal tonight
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              Nothing to type at the summit — these are for the drive home. None of them need a line of code, only a folder of notes and an AI that is allowed to read it. Copy them into a note now; by Sunday you will know why the room was so excited.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROMPTS.map((item) => (
              <Card key={item.label} className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-copperrose text-sm font-semibold uppercase tracking-[0.15em]">{item.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 grow">
                  <blockquote className="border-l-4 border-copperrose/70 pl-4 py-2 bg-tarawera/40 rounded-r text-rosebud-50 text-base leading-relaxed grow">
                    {item.prompt}
                  </blockquote>
                  <p className="text-rosebud-300 text-sm">{item.why}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-rosebud-200 md:text-lg">
            Everyone who runs one of these stops asking where they put things and starts asking better questions. The gap widens a little every week. Come close it.
          </p>
        </div>
      </section>

      <SummitSchedule
        schedule={SCHEDULE}
        note="Every time on this page ends in -ish. The doors and the first talk are the only anchors; the grill sets the pace after that, and the bonfire has the final word."
      />
      <SummitSpeakers activeYear={YEAR} includeCommunitySpeakers={false} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
}
