import { render, screen } from "@testing-library/react";
import { SummitSpeakers } from "./summit-speakers";

describe("SummitSpeakers", () => {
  it("shows the confirmed Summit 2026.2 lineup without community placeholders", () => {
    render(<SummitSpeakers activeYear="2026.2" includeCommunitySpeakers={false} />);

    for (const name of ["Hanne", "Øyvind", "Knut & Øystein", "Cathrine", "Jan Ivar", "Karianne"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }

    expect(screen.getByText("Gamliser: The Original Intelligence")).toBeInTheDocument();
    expect(screen.getByText("It's Always Sunny in Space")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Kari-Anne" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lars" })).not.toBeInTheDocument();
  });
});
