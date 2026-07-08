import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressRing } from "@/components/ui/ProgressRing";

describe("ProgressRing", () => {
  it("exposes a progressbar role with the rounded value", () => {
    render(<ProgressRing value={42} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("always has an accessible name", () => {
    render(<ProgressRing value={10} />);
    expect(screen.getByRole("progressbar")).toHaveAccessibleName("Progress");
  });

  it("uses the sublabel as the accessible name when no ariaLabel is given", () => {
    render(<ProgressRing value={10} sublabel="of target" />);
    expect(screen.getByRole("progressbar")).toHaveAccessibleName("of target");
  });

  it("prefers an explicit ariaLabel", () => {
    render(
      <ProgressRing value={10} sublabel="of target" ariaLabel="Goal progress" />,
    );
    expect(screen.getByRole("progressbar")).toHaveAccessibleName(
      "Goal progress",
    );
  });

  it("rounds fractional values for the accessible label", () => {
    render(<ProgressRing value={42.7} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "43",
    );
  });

  it("reports the real value even when it exceeds 100", () => {
    render(<ProgressRing value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "150",
    );
  });

  it("renders a visible label and sublabel", () => {
    render(<ProgressRing value={50} label="50%" sublabel="of target" />);
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("of target")).toBeInTheDocument();
  });

  it("marks the SVG as decorative", () => {
    const { container } = render(<ProgressRing value={25} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
