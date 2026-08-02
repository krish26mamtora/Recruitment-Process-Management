import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import CandidateDashboard from "./CandidateDashboard";

describe("CandidateDashboard Component", () => {
  test("renders candidate dashboard title", () => {
    render(<CandidateDashboard />);

    expect(screen.getByText("Candidate Dashboard")).toBeInTheDocument();
  });

  test("renders description", () => {
    render(<CandidateDashboard />);

    expect(
      screen.getByText("Track applications and explore new opportunities.")
    ).toBeInTheDocument();
  });

  test("renders within container and card structure", () => {
    const { container } = render(<CandidateDashboard />);

    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".card")).toBeInTheDocument();
  });
});
