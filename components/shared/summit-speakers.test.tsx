import { render, screen } from "@testing-library/react";
import { SummitSpeakers } from "./summit-speakers";

describe("SummitSpeakers", () => {
  it("shows the confirmed Summit 2026.2 lineup without community placeholders", () => {
    render(<SummitSpeakers activeYear="2026.2" includeCommunitySpeakers={false} />);

    for (const name of ["Lars", "Øyvind", "Erik", "Special guest 1", "Cathrine", "Special guest 2"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }

    expect(screen.getByText("Whose Memory Is It Anyway?")).toBeInTheDocument();
    expect(screen.getByText("Empower Yourself. Then Your Whole Company.")).toBeInTheDocument();
    for (const name of ["Michael", "Knut", "Eivind", "Arild", "Hanne", "Jan Ivar", "Karianne", "Knut & Øystein"]) {
      expect(screen.queryByRole("heading", { name })).not.toBeInTheDocument();
    }
  });
});
