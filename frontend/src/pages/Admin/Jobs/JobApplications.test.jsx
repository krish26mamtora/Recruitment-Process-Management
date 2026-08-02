import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import JobApplications from "./JobApplications";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("JobApplications Component", () => {
  const mockApplications = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      jobTitle: "Software Engineer",
      status: "Pending",
      applicationDate: "2024-01-15T10:00:00",
      fileName: "resume.pdf",
      experience: "2",
    },
  ];

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })
    );

    render(<JobApplications />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders applications list after loading", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/job-applications")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApplications),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<JobApplications />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  test("renders empty state when no applications", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      expect(screen.getByText("No applications found")).toBeInTheDocument();
    });
  });

  test("renders experience filter dropdown", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      expect(screen.getByText("Filter by Experience")).toBeInTheDocument();
    });
  });

  test("renders sort dropdown", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      expect(screen.getByText("Sort")).toBeInTheDocument();
    });
  });

  test("filters applications by experience", async () => {
    const applicationsWithDifferentExp = [
      {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        jobTitle: "Software Engineer",
        status: "Pending",
        applicationDate: "2024-01-15T10:00:00",
        fileName: "resume.pdf",
        experience: "0",
      },
      {
        id: 2,
        fullName: "Jane Smith",
        email: "jane@example.com",
        jobTitle: "Senior Developer",
        status: "Pending",
        applicationDate: "2024-01-16T10:00:00",
        fileName: "resume2.pdf",
        experience: "3",
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(applicationsWithDifferentExp),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    const filterSelect = screen.getByLabelText("Filter by Experience");
    fireEvent.change(filterSelect, { target: { value: "FRESHER" } });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });

  test("opens schedule interview modal", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      const scheduleButton = screen.getByText("Arrange Interview");
      scheduleButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Schedule Interview")).toBeInTheDocument();
    });
  });

  test("opens status update modal", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      const statusButton = screen.getByText("Update Stage");
      statusButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Update Stage")).toBeInTheDocument();
    });
  });

  test("closes schedule modal on close button click", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })
    );

    render(<JobApplications />);

    await waitFor(() => {
      const scheduleButton = screen.getByText("Arrange Interview");
      scheduleButton.click();
    });

    await waitFor(() => {
      const closeButton = screen.getByText("Close");
      closeButton.click();
    });

    await waitFor(() => {
      expect(screen.queryByText("Schedule Interview")).not.toBeInTheDocument();
    });
  });
});
