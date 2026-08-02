import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Dashboard from "./Dashboard";

describe("Recruiter Dashboard Component", () => {
  test("renders recruiter dashboard title", () => {
    render(<Dashboard />);

    expect(screen.getByText("Recruiter Dashboard")).toBeInTheDocument();
  });

  test("renders description", () => {
    render(<Dashboard />);

    expect(
      screen.getByText("Manage job postings and candidate pipelines.")
    ).toBeInTheDocument();
  });

  test("renders within container and card structure", () => {
    const { container } = render(<Dashboard />);

    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".card")).toBeInTheDocument();
  });
});
