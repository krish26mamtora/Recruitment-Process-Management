import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import JobDetails from "./JobDetails";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("JobDetails Component", () => {
  const mockJob = {
    jobId: 1,
    title: "Software Engineer",
    description: "Java and Spring Boot role",
    status: "open",
    minExperienceYears: 2,
    assignedRecruiterName: "John Recruiter",
    createdAt: "2024-01-01T00:00:00",
    skills: [
      { skillId: 1, skillName: "Java", required: true },
      { skillId: 2, skillName: "Spring Boot", required: false },
    ],
    pipelineCounts: {
      applied: 10,
      shortlisted: 5,
    },
  };

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders job details after loading", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Java and Spring Boot role")).toBeInTheDocument();
    });
  });

  test("renders job metadata", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("open")).toBeInTheDocument();
      expect(screen.getByText("ID: 1")).toBeInTheDocument();
    });
  });

  test("renders job description section", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Description")).toBeInTheDocument();
    });
  });

  test("renders job details section", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Details")).toBeInTheDocument();
      expect(screen.getByText("2 years")).toBeInTheDocument();
      expect(screen.getByText("John Recruiter")).toBeInTheDocument();
    });
  });

  test("renders pipeline counts", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Applied: 10")).toBeInTheDocument();
      expect(screen.getByText("Shortlisted: 5")).toBeInTheDocument();
    });
  });

  test("renders skills list", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Java")).toBeInTheDocument();
      expect(screen.getByText("Spring Boot")).toBeInTheDocument();
    });
  });

  test("renders close job section when status is not closed", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Close Job")).toBeInTheDocument();
    });
  });

  test("closes job successfully", async () => {
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/jobs/1") && options?.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...mockJob, status: "closed" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      });
    });

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText("Reason for closing");
      fireEvent.change(textarea, { target: { value: "Position filled" } });
    });

    await waitFor(() => {
      const closeButton = screen.getByText("Close Job");
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Job closed successfully");
    });
  });

  test("shows alert when closing without reason", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      const closeButton = screen.getByText("Close Job");
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Please provide reason to close the job");
    });
  });

  test("renders closed info when status is closed", async () => {
    const closedJob = { ...mockJob, status: "closed", reasonClosed: "Filled", closedAt: "2024-01-15T00:00:00" };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(closedJob),
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(screen.getByText("Closed Info")).toBeInTheDocument();
      expect(screen.getByText("Filled")).toBeInTheDocument();
    });
  });

  test("navigates back on job not found", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    renderWithRouter(<JobDetails />);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Job not found");
    });
  });
});
