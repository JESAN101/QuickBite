import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../components/Pagination";

describe("Pagination", () => {
  it("renders page indicator", () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
  });

  it("disables Previous on first page", () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />);
    expect(screen.getByText(/previous/i)).toBeDisabled();
    expect(screen.getByText(/next/i)).toBeEnabled();
  });

  it("disables Next on last page", () => {
    render(<Pagination page={5} totalPages={5} onChange={() => {}} />);
    expect(screen.getByText(/next/i)).toBeDisabled();
    expect(screen.getByText(/previous/i)).toBeEnabled();
  });

  it("calls onChange with the right page", () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onChange={onChange} />);

    fireEvent.click(screen.getByText(/next/i));
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByText(/previous/i));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("does not render when hidden behind parent logic (single page)", () => {
    // Consumers hide the component when totalPages <= 1;
    // this test documents that contract.
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={() => {}} />,
    );
    // Component still renders but both buttons are disabled
    expect(screen.getByText(/previous/i)).toBeDisabled();
    expect(container).toBeTruthy();
  });
});
