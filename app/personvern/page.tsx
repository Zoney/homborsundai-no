import type { Metadata } from 'next';
import Link from 'next/link';

// Personvernerklæringen (GDPR art. 13). Skal alltid stemme med koden og serveroppsettet:
// endrer du hva som lagres, hvor lenge eller hvem som hjelper oss, endre denne sida samtidig.
// Grunnlaget (avtalen med Hetzner, tiltakene på serveren) står i husken: workshop/apper/personvern/.

export const metadata: Metadata = {
  title: 'Personvern',
  description: 'Hvordan Homborsund AI behandler personopplysninger.',
  alternates: { canonical: '/personvern' },
};

const SIST_ENDRET = '5. november 2026';
const EPOST = 'mailto:oyvind@zoney.no?subject=Personvern%20hos%20Homborsund%20AI';

export default function Personvern() {
  return (
    <main className="bg-gradient-cool text-white min-h-screen px-4 py-10">
      <article className="mx-auto max-w-2xl space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:underline text-rosebud-100">
        <p className="text-sm text-rosebud-300">
          <Link href="/">Homborsund AI</Link> · Privacy policy (in Norwegian)
        </p>
        <h1 className="text-3xl font-bold text-white">Personvern</h1>
        <p>
          Når du melder deg på en samling, lagrer vi navnet ditt, e-postadressen og det du ellers skriver i skjemaet, så vi vet hvem som kommer og kan sende deg
          billetten. Alt ligger på vår egen server i Finland, uten reklame, sporing eller andre skytjenester. Du kan melde deg av og slette kontoen din selv.
        </p>

        <h2>Hvem som er ansvarlig</h2>
        <p>
          Homborsund AI (org.nr. 935616913) er behandlingsansvarlig for personopplysningene. Nettsida og serveren drives av Øyvind Sandåker. Spørsmål om personvern
          sender du til <a href={EPOST}>oyvind@zoney.no</a>.
        </p>

        <h2>Når du bare leser sida</h2>
        <ul>
          <li>Ingen informasjonskapsler før du logger inn, ingen analyseverktøy fra andre og ingen sporing.</li>
          <li>
            Serveren logger alt som kommer inn til sida (tidspunkt, IP-adressen din, hvilken side du ba om, nettleseren og hvilket nettsted du kom fra) for å beskytte
            tjenesten mot angrep og rette feil. Loggen ligger kryptert hos oss og slettes etter 30 dager. Informasjonskapsler og innloggingsdata kommer aldri i loggen. Det
            som blir igjen etterpå, er bare antall per dag (for eksempel hvor mange som så en side, eller brukte mobil), og det kan ikke knyttes til noen.
          </li>
          <li>
            Kartet over Vågsholt skole hentes fra OpenStreetMap først når du trykker «Show the map». Da får OpenStreetMap Foundation (Storbritannia) IP-adressen din, som ved
            alle besøk på et nettsted. Uten det trykket sender sida ingenting til andre.
          </li>
        </ul>

        <h2>Når du melder deg på</h2>
        <ul>
          <li>
            <strong>Påmeldingen:</strong> navn, e-postadresse, telefonnummer og kommentar hvis du skriver dem, hvilken samling, når du meldte deg på, om du har meldt deg av,
            og om og når du ble sjekket inn ved døra (og av hvem i arrangørgruppa).
          </li>
          <li>
            <strong>Billetten:</strong> vi sender deg en e-post fra <strong>summit@post.homborsundai.no</strong> med en lenke til billetten din. Lenka inneholder en lang,
            tilfeldig kode, og den samme koden står i QR-koden vi skanner ved døra. Alle som har lenka, kan se billetten og melde deg av, så ikke del den.
          </li>
          <li>
            <strong>Aktivitetsloggen:</strong> vi fører en logg over hva som skjer med påmeldingene: påmelding, avmelding, innsjekking, endringer, innlogginger og hvem som er
            arrangør. Hver linje har tidspunkt, hva som skjedde, e-postadressen det gjelder og hvem som gjorde det. Ingen IP-adresser. Bare arrangørene ser den.
          </li>
          <li>
            <strong>E-post fra oss:</strong> arrangørene kan sende e-post om samlinger til dem som har meldt seg på tidligere. Vil du ikke ha mer, skriver du til{' '}
            <a href={EPOST}>oyvind@zoney.no</a>, eller sletter påmeldingene dine (under).
          </li>
        </ul>
        <p>
          Formålet er å arrangere samlingene: vite hvem som kommer, sende billetten, sjekke inn ved døra og si fra om praktiske ting. Grunnlaget er avtalen du inngår når du
          melder deg på (GDPR artikkel 6 nr. 1 b). Aktivitetsloggen og serverloggen har grunnlag i vår berettigede interesse i å drive tjenesten trygt og rette feil
          (artikkel 6 nr. 1 f). Bare arrangørene i Homborsund AI ser påmeldingene. Vi selger dem ikke, og de brukes aldri til reklame for andre eller til å trene AI.
        </p>

        <h2>Når du lager en konto (valgfritt)</h2>
        <ul>
          <li>
            Du trenger ingen konto for å melde deg på eller vise billetten. Lager du en, kan du se alle påmeldingene og QR-kodene dine på ett sted under «My tickets».
          </li>
          <li>
            <strong>Kontoen:</strong> e-postadressen din, passkeyene dine (bare den offentlige delen, den hemmelige blir på enheten din) og innloggingene dine med
            IP-adresse og nettlesertype, så vi kan stoppe misbruk. Innloggingen bruker én informasjonskapsel, som bare finnes for å holde deg innlogget.
          </li>
          <li>Du logger inn med en kode vi sender på e-post, eller med en passkey. Vi lagrer ingen passord, og vi bruker ikke Google eller andre til innloggingen.</li>
        </ul>

        <h2>Hvor dataene ligger, og hvem som hjelper oss</h2>
        <p>
          Nettsida, databasen og e-posttjeneren kjører på én server vi leier av <strong>Hetzner Online GmbH</strong> (Tyskland), i datasenteret deres i Tuusula ved
          Helsingfors i Finland. Ingenting lagres eller behandles utenfor EU/EØS.
        </p>
        <ul>
          <li>Vi har en databehandleravtale med Hetzner etter GDPR artikkel 28, inngått 1. november 2026.</li>
          <li>
            Hetzner er sertifisert etter ISO/IEC 27001 og BSI C5 Type 2. TÜV Rheinland kontrollerte sikkerhetstiltakene i datasenteret i Finland 19. februar 2026 og fant ingen
            avvik.
          </li>
          <li>Hetzner leier ut maskinen, men har ikke tilgang til dataene: disken er kryptert, og nøkkelen lagres ikke hos dem.</li>
        </ul>
        <p>
          Vi bruker ingen andre tjenester som får personopplysninger: ingen e-posttjeneste (billetten og innloggingskoden sendes fra vår egen e-posttjener rett til
          e-postleverandøren din), ingen analyse, ingen innholdsnettverk, ingen eksterne skrifttyper og ingen robotsjekk fra andre. Let&apos;s Encrypt lager sertifikatet for
          den sikre forbindelsen og får bare vite domenenavnet.
        </p>
        <p>
          Fram til november 2026 lå nettsida hos Vercel (USA), med påmeldingene hos Convex og innloggingen for arrangørene hos Google. Påmeldingene derfra er flyttet hit.
          For påmeldinger fra før flyttingen ble også IP-adressen og nettlesertypen lagret; de følger med påmeldingen. Nye påmeldinger lagrer ikke IP-adressen.
        </p>

        <h2>Slik beskytter vi dataene</h2>
        <ul>
          <li>All trafikk går kryptert (HTTPS).</li>
          <li>Hele disken på serveren er kryptert.</li>
          <li>Databasen kan bare nås fra nettsida selv på samme maskin, ikke over nettet, og den har ingen passord som kan stjeles.</li>
          <li>Nettsida kjører avskjermet, uten tilgang til nettet og uten tilgang til andre apper.</li>
          <li>Bare de som har meldt seg på, og arrangørene, kan logge inn, med en kode på e-post som gjelder i ti minutter eller en passkey.</li>
          <li>Serveren får sikkerhetsoppdateringer automatisk hver natt.</li>
          <li>Sikkerhetskopiene tas hver natt, krypteres to ganger med to nøkler som oppbevares hver for seg, og slettes etter 30 dager.</li>
        </ul>

        <h2>Hvor lenge vi tar vare på det</h2>
        <ul>
          <li>
            <strong>Påmeldinger:</strong> til du sletter dem, eller ber oss om det. Vi tar vare på dem etter samlingen så vi kan si fra om neste.
          </li>
          <li>
            <strong>Aktivitetsloggen:</strong> 24 måneder.
          </li>
          <li>
            <strong>Konto:</strong> til du sletter den.
          </li>
          <li>
            <strong>Innlogginger:</strong> til du logger ut, og senest etter 60 dager uten bruk.
          </li>
          <li>
            <strong>Innloggingskoder:</strong> ti minutter.
          </li>
          <li>
            <strong>Logger på serveren</strong> (besøk, og hvilke adresser vi har sendt e-post til): 30 dager.
          </li>
          <li>
            <strong>Sikkerhetskopier:</strong> 30 dager. Sletter du noe, er det borte fra sikkerhetskopiene innen 30 dager.
          </li>
        </ul>

        <h2>Rettighetene dine</h2>
        <p>
          Du har rett til innsyn i det vi har lagret om deg, til å få rettet feil, til å få det slettet, til å få det utlevert og til å protestere mot behandlingen. Du
          melder deg av på billettsida. Har du en konto, sletter du den under <Link href="/my-tickets">My tickets</Link> → «Delete my account», og der kan du også slette
          alle påmeldingene dine. For alt annet skriver du til <a href={EPOST}>oyvind@zoney.no</a>, så svarer vi innen en måned.
        </p>
        <p>
          Mener du at vi behandler personopplysninger i strid med reglene, kan du klage til <a href="https://www.datatilsynet.no">Datatilsynet</a>.
        </p>

        <p className="text-sm text-rosebud-300 pt-6">Sist endret {SIST_ENDRET}.</p>
      </article>
    </main>
  );
}
