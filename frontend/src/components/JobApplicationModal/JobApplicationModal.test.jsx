import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import JobApplicationModal from "./JobApplicationModal";

beforeAll(() => {
  global.alert = vi.fn();
  global.confirm = vi.fn(() => true);
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe("JobApplicationModal Component", () => {
  const mockJobs = [
    {
      jobId: 1,
      title: "Software Engineer",
      minExperienceYears: 2,
      skills: [
        { skillName: "Java", required: true },
        { skillName: "React", required: false },
      ],
    },
  ];

  const mockProfile = {
    skills: "Java, React, Python",
    experiencesJson: JSON.stringify([
      { startDate: "2020-01-01", endDate: "2022-01-01" },
    ]),
  };

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJobs),
      })
    );

    render(<JobApplicationModal candidateId={1} onClose={() => {}} />);

    expect(screen.getByText("Loading jobs...")).toBeInTheDocument();
  });

  test("renders job list after loading", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      if (url.includes("/user-profiles")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<JobApplicationModal candidateId={1} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  test("calculates and displays match score", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      if (url.includes("/user-profiles")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<JobApplicationModal candidateId={1} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Match Score:/)).toBeInTheDocument();
    });
  });

  test("displays skill match details", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      if (url.includes("/user-profiles")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<JobApplicationModal candidateId={1} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Required Skills/)).toBeInTheDocument();
      expect(screen.getByText("Java")).toBeInTheDocument();
    });
  });

  test("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      if (url.includes("/user-profiles")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<JobApplicationModal candidateId={1} onClose={onClose} />);

    await waitFor(() => {
      const closeButton = screen.getByText("Close");
      closeButton.click();
    });

    expect(onClose).toHaveBeenCalled();
  });

  test("handles apply button click", async () => {
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/jobs")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      if (url.includes("/user-profiles")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      if (url.includes("/map") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("Mapped"),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<JobApplicationModal candidateId={1} onClose={() => {}} />);

    await waitFor(() => {
      const applyButton = screen.getByText("Apply / Map Candidate");
      applyButton.click();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/job-applications/map"),
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });
});
