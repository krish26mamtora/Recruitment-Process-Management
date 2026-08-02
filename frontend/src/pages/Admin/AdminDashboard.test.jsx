import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import AdminDashboard from "./AdminDashboard";

describe("AdminDashboard Component", () => {
  test("renders admin dashboard title", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("renders overview description", () => {
    render(<AdminDashboard />);

    expect(
      screen.getByText("Overview of jobs, users, and applications.")
    ).toBeInTheDocument();
  });

  test("renders within container and card structure", () => {
    const { container } = render(<AdminDashboard />);

    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".card")).toBeInTheDocument();
  });
});
