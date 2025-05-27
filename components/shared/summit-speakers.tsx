import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type SummitSpeakersProps = {
  activeYear: string;
}

export function SummitSpeakers({ activeYear }: SummitSpeakersProps) {
  return (
    <section id="speakers" className="w-full py-12 md:py-16 scroll-mt-16 bg-tarawera bg-opacity-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
          <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">Speakers</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose mb-3">Meet the Speakers</h2>
          <p className="max-w-[700px] text-rosebud-200 md:text-lg">
            Learn from industry experts and thought leaders in the field of AI.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          {/* Eivind */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Eivind" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">EI</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Eivind</h3>
            <p className="text-copperrose text-sm">Random TOGAF nerd</p>
          </Card>

          {/* Øyvind */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Øyvind" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">ØY</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Øyvind</h3>
            <p className="text-copperrose text-sm">Random dev nerd</p>
          </Card>

          {/* Rebekka */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Rebekka (please come!)" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">RE</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Rebekka (please come!)</h3>
            <p className="text-copperrose text-sm">Random AI nerd</p>
          </Card>

          {/* Lars */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Lars" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">LA</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Lars</h3>
            <p className="text-copperrose text-sm">Random ERP nerd</p>
          </Card>

          {/* Andreas */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Andreas" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">AN</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Andreas</h3>
            <p className="text-copperrose text-sm">Random robotics nerd</p>
          </Card>

          {/* Michael */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Michael" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">MI</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Michael</h3>
            <p className="text-copperrose text-sm">Ex-Game Dev, AI/GIS wizard, public sector value creator & year-round swimmer.</p>
          </Card>

          {/* Christoffer */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Christoffer" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">CH</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Christoffer</h3>
            <p className="text-copperrose text-sm">Random puzzle-solving business nerd</p>
          </Card>

          {/* Kjetil */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Kjetil" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">KJ</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Kjetil</h3>
            <p className="text-copperrose text-sm">Random bicycle-powered system dev nerd</p>
          </Card>
          
          {/* And you! */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="And you!" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">AY</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">And you!</h3>
            <p className="text-copperrose text-sm">...</p>
          </Card>

          {/* Ofc, you! */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Ofc, you!" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">OY</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Ofc, you!</h3>
            <p className="text-copperrose text-sm">....</p>
          </Card>

          {/* Erik */}
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Erik" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">ER</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Erik</h3>
            <p className="text-copperrose text-sm">Enterprise Architecture & economic wiz</p>
          </Card>

          {/* Knut - conditional */}
          {parseFloat(activeYear) >= 2025.2 && (
          <Card className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center p-6 rounded-xl">
            <Avatar className="w-32 h-32 mb-6 border-4 border-ferra-700 shadow-md">
              <AvatarImage src="/placeholder.svg" alt="Knut" />
              <AvatarFallback className="text-2xl bg-ferra-600 text-rosebud-200">KN</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-rosebud-100 mb-1">Knut</h3>
            <p className="text-copperrose text-sm">Random chatty boat maker</p>
          </Card>
          )}
        </div>
      </div>
    </section>
  );
} 