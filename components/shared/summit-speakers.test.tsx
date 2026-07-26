import { render, screen } from "@testing-library/react";
import { SummitSpeakers } from "./summit-speakers";

describe("SummitSpeakers", () => {
  it("shows Hanne as the confirmed speaker for Summit 2026.2", () => {
    render(<SummitSpeakers activeYear="2026.2" includeCommunitySpeakers={false} />);

    expect(screen.getByRole("heading", { name: "Hanne" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Gamliser — how AI can help us learn from older people, understand ageing and illness, and bridge generations.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lars" })).not.toBeInTheDocument();
  });
});
