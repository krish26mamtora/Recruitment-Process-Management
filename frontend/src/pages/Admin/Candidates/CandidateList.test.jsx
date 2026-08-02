import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CandidateList from "./CandidateList";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CandidateList Component", () => {
  const mockCandidates = [
    {
      userId: 1,
      fullName: "John Doe",
      email: "john@example.com",
      roles: [{ roleName: "Candidate" }],
      resumeFileName: "resume.pdf",
    },
    {
      userId: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      roles: [{ roleName: "Candidate" }],
      resumeFileName: null,
    },
  ];

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCandidates),
      })
    );

    renderWithRouter(<CandidateList />);

    expect(screen.getByText("Loading candidates...")).toBeInTheDocument();
  });

  test("renders candidate list after loading", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCandidates),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });
  });

  test("filters candidates with Candidate role", async () => {
    const allUsers = [
      {
        userId: 1,
        fullName: "John Doe",
        email: "john@example.com",
        roles: [{ roleName: "Candidate" }],
      },
      {
        userId: 2,
        fullName: "Admin User",
        email: "admin@example.com",
        roles: [{ roleName: "Admin" }],
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(allUsers),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Admin User")).not.toBeInTheDocument();
    });
  });

  test("renders empty state when no candidates found", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("No candidates found")).toBeInTheDocument();
    });
  });

  test("renders error state on fetch failure", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Error"),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load candidates")).toBeInTheDocument();
    });
  });

  test("renders view profile link", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCandidates),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("View Profile")).toBeInTheDocument();
    });
  });

  test("renders download resume link when resume exists", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCandidates),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("Download Resume")).toBeInTheDocument();
    });
  });

  test("renders no resume text when resume does not exist", async () => {
    const candidatesWithoutResume = [
      {
        userId: 2,
        fullName: "Jane Smith",
        email: "jane@example.com",
        roles: [{ roleName: "Candidate" }],
        resumeFileName: null,
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(candidatesWithoutResume),
      })
    );

    renderWithRouter(<CandidateList />);

    await waitFor(() => {
      expect(screen.getByText("No Resume")).toBeInTheDocument();
    });
  });
});
