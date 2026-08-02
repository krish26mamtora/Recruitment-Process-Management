import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import JobList from "./JobList";

beforeAll(() => {
  global.alert = vi.fn();
  global.confirm = vi.fn(() => true);
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("JobList Component", () => {
  const mockJobs = [
    {
      jobId: 1,
      title: "Software Engineer",
      description: "Java role",
      status: "open",
      minExperienceYears: 2,
      assignedRecruiterName: "John Recruiter",
      skills: [{ skillId: 1, skillName: "Java" }],
    },
    {
      jobId: 2,
      title: "Senior Developer",
      description: "Senior role",
      status: "closed",
      minExperienceYears: 5,
      assignedRecruiterName: "Jane Recruiter",
      skills: [{ skillId: 2, skillName: "React" }],
    },
  ];

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    renderWithRouter(<JobList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders job list after loading", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      if (url.includes("/job-applications")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
    });
  });

  test("renders search input", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search by title or id...");
      expect(searchInput).toBeInTheDocument();
    });
  });

  test("renders status filter dropdown", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

    await waitFor(() => {
      expect(screen.getByText("All statuses")).toBeInTheDocument();
    });
  });

  test("renders create job button", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

    await waitFor(() => {
      expect(screen.getByText("+ Create Job")).toBeInTheDocument();
    });
  });

  test("filters jobs by search query", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search by title or id...");
      fireEvent.change(searchInput, { target: { value: "Software" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.queryByText("Senior Developer")).not.toBeInTheDocument();
    });
  });

  test("filters jobs by status", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

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

    renderWithRouter(<JobList />);

    await waitFor(() => {
      expect(screen.getByText("No jobs found")).toBeInTheDocument();
    });
  });

  test("renders job action buttons", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobList />);

    await waitFor(() => {
      expect(screen.getByText("View")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("Applications")).toBeInTheDocument();
    });
  });
});
