import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import CandidateApplications from "./CandidateApplications";

// Mock global window.alert using Vitest's utility
beforeAll(() => {
  global.alert = vi.fn();
});

// Clear mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe("CandidateApplications Component", () => {
  test("shows alert if no valid userId is found in localStorage", async () => {
    render(<CandidateApplications />);

    expect(global.alert).toHaveBeenCalledWith(
      "No valid user found. Please login again.",
    );
  });

  test("renders loading state and then lists applications on successful fetch", async () => {
    window.localStorage.setItem("userId", "42");

    const mockApplications = [
      {
        id: 101,
        jobId: 1,
        jobTitle: "Frontend Developer",
        status: "Interviewing",
        applicationDate: "2026-07-15T12:00:00.000Z",
        fileName: "resume.pdf",
      },
    ];

    // Use vi.fn instead of jest.fn
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      }),
    );

    render(<CandidateApplications />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText("Interviewing")).toBeInTheDocument();
      expect(screen.getByText("View Resume")).toBeInTheDocument();
    });
  });

  test("renders empty state message if backend returns zero applications", async () => {
    window.localStorage.setItem("userId", "42");

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    render(<CandidateApplications />);

    await waitFor(() => {
      expect(
        screen.getByText("You haven’t applied to any jobs yet"),
      ).toBeInTheDocument();
    });
  });
});
