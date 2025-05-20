import { Conferance } from "@/components/conferance";

export default function YearPage({ params }: { params: { year: string } }) {
  return <Conferance year={params.year} />;
}
