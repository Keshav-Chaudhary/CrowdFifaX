import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders its text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies distinct classes per tone", () => {
    const { rerender, container } = render(<Badge tone="positive">P</Badge>);
    const positive = container.firstElementChild?.className;
    rerender(<Badge tone="critical">C</Badge>);
    const critical = container.firstElementChild?.className;
    expect(positive).not.toBe(critical);
  });

  it("merges a custom className", () => {
    const { container } = render(<Badge className="extra">X</Badge>);
    expect(container.firstElementChild).toHaveClass("extra");
  });

  it("defaults to the neutral tone", () => {
    const { container } = render(<Badge>N</Badge>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it("forwards arbitrary span attributes", () => {
    render(<Badge data-testid="badge-x">Y</Badge>);
    expect(screen.getByTestId("badge-x")).toBeInTheDocument();
  });
});
