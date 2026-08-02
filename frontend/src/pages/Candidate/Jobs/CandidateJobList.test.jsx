import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import CandidateJobList from "./CandidateJobList";

beforeAll(() => {
  global.alert = vi.fn();
  global.confirm = vi.fn(() => true);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CandidateJobList Component", () => {
  const mockJobs = [
    {
      jobId: 1,
      title: "Software Engineer",
      status: "open",
      location: "Remote",
      experience: "2 years",
      skills: [{ skillName: "Java" }, { skillName: "React" }],
      description: "Java and React development role",
    },
    {
      jobId: 2,
      title: "Senior Developer",
      status: "closed",
      location: "On-site",
      experience: "5 years",
      skills: [{ skillName: "Python" }],
      description: "Senior Python role",
    },
  ];

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    expect(screen.getByText("Loading jobs...")).toBeInTheDocument();
  });

  test("renders job list after loading", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
    });
  });

  test("renders search input", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search by title or ID...");
      expect(searchInput).toBeInTheDocument();
    });
  });

  test("renders status filter dropdown", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      expect(screen.getByText("All statuses")).toBeInTheDocument();
    });
  });

  test("filters jobs by search query", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search by title or ID...");
      fireEvent.change(searchInput, { target: { value: "Software" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.queryByText("Senior Developer")).not.toBeInTheDocument();
    });
  });

  test("filters jobs by status", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      const statusSelect = screen.getByDisplayValue("All statuses");
      fireEvent.change(statusSelect, { target: { value: "open" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.queryByText("Senior Developer")).not.toBeInTheDocument();
    });
  });

  test("renders empty state when no jobs found", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      expect(screen.getByText("No jobs found")).toBeInTheDocument();
    });
  });

  test("renders apply button for open jobs", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      expect(screen.getByText("Apply Now")).toBeInTheDocument();
    });
  });

  test("renders closed button for closed jobs", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      const closedButton = screen.getByText("Closed");
      expect(closedButton).toBeDisabled();
    });
  });

  test("opens apply window on apply button click", async () => {
    global.confirm = vi.fn(() => true);
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<CandidateJobList />);

    await waitFor(() => {
      const applyButton = screen.getByText("Apply Now");
      applyButton.click();
    });

    expect(global.confirm).toHaveBeenCalledWith("Do you want to apply for this job?");
  });
});
