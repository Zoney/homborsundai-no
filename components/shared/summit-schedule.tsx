import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ScheduleItem = {
  time: string;
  event: string;
}

type SummitScheduleProps = {
  schedule: ScheduleItem[];
}

export function SummitSchedule({ schedule }: SummitScheduleProps) {
  return (
    <section id="schedule" className="w-full scroll-mt-16 bg-ferra bg-opacity-50">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
          <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">Schedule</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose mb-3">Summit Schedule</h2>
          <p className="max-w-[700px] text-rosebud-200 md:text-lg">
            Explore the lineup of thought-provoking talks and interactive sessions.
          </p>
        </div>
        <div className="mx-auto max-w-3xl w-full">
          <Card className="bg-ferra border-ferra-600 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-center text-rosebud-100">
                Day 1
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 py-8">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-ferra-700 bg-opacity-50 hover:bg-ferra-600/70 transition-colors duration-200">
                  <Badge variant="outline" className="border-copperrose text-copperrose text-sm font-semibold px-3 py-1 whitespace-nowrap">
                    {item.time}
                  </Badge>
                  <p className="text-rosebud-200 text-base leading-relaxed">{item.event}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 