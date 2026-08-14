import { render, screen } from "@testing-library/react";
import { SummitSpeakers } from "./summit-speakers";

describe("SummitSpeakers", () => {
  it("shows the confirmed Summit 2026.2 lineup without community placeholders", () => {
    render(<SummitSpeakers activeYear="2026.2" includeCommunitySpeakers={false} />);

    for (const name of ["Lars", "Michael", "Knut", "Cathrine", "Eivind", "Arild", "Hanne", "Øyvind"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }

    expect(screen.getByText("The State of AI in Agder")).toBeInTheDocument();
    expect(screen.getByText("One Analogy to Rule Them All")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Jan Ivar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Karianne" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Knut & Øystein" })).not.toBeInTheDocument();
  });
});
