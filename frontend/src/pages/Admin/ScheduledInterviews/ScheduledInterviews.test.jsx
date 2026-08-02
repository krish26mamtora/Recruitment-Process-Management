import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import ScheduledInterviews from "./ScheduledInterviews";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ScheduledInterviews Component", () => {
  const mockInterviews = [
    {
      applicationId: 1,
      jobTitle: "Software Engineer",
      candidateName: "John Doe",
      candidateEmail: "john@example.com",
      round: "Technical",
      scheduledAt: "2024-01-15T10:00:00",
      meetLink: "https://meet.google.com/abc-defg-hij",
      message: "Please join on time",
      interviewerEmails: ["interviewer1@example.com", "interviewer2@example.com"],
      status: "Interview - Technical scheduled",
    },
  ];

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    expect(screen.getByText("Loading interviews...")).toBeInTheDocument();
  });

  test("renders interviews list after loading", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("renders empty state when no interviews", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      expect(screen.getByText("No interviews scheduled yet")).toBeInTheDocument();
    });
  });

  test("renders interview details", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Technical")).toBeInTheDocument();
      expect(screen.getByText("Join Meeting")).toBeInTheDocument();
    });
  });

  test("renders interviewer emails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      expect(screen.getByText("interviewer1@example.com")).toBeInTheDocument();
      expect(screen.getByText("interviewer2@example.com")).toBeInTheDocument();
    });
  });

  test("opens feedback modal when add feedback clicked", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      const feedbackButton = screen.getByText("Add Feedback");
      feedbackButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Add Interview Feedback")).toBeInTheDocument();
    });
  });

  test("submits feedback successfully", async () => {
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/feedback") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      });
    });

    render(<ScheduledInterviews />);

    await waitFor(() => {
      const feedbackButton = screen.getByText("Add Feedback");
      feedbackButton.click();
    });

    await waitFor(() => {
      const interviewerInput = screen.getByPlaceholderText("Enter your name");
      fireEvent.change(interviewerInput, { target: { value: "John Smith" } });
    });

    await waitFor(() => {
      const submitButton = screen.getByText("Submit Feedback");
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Feedback submitted successfully");
    });
  });

  test("closes feedback modal on cancel", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      const feedbackButton = screen.getByText("Add Feedback");
      feedbackButton.click();
    });

    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel");
      cancelButton.click();
    });

    await waitFor(() => {
      expect(screen.queryByText("Add Interview Feedback")).not.toBeInTheDocument();
    });
  });

  test("handles rating change", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      const feedbackButton = screen.getByText("Add Feedback");
      feedbackButton.click();
    });

    await waitFor(() => {
      const ratingInput = screen.getByDisplayValue("3");
      fireEvent.change(ratingInput, { target: { value: "4" } });
    });

    await waitFor(() => {
      expect(screen.getByText("4/5")).toBeInTheDocument();
    });
  });

  test("adds new skill rating", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInterviews),
      })
    );

    render(<ScheduledInterviews />);

    await waitFor(() => {
      const feedbackButton = screen.getByText("Add Feedback");
      feedbackButton.click();
    });

    await waitFor(() => {
      const skillInput = screen.getByPlaceholderText("New Skill (e.g. Java)");
      fireEvent.change(skillInput, { target: { value: "Java" } });
    });

    await waitFor(() => {
      const ratingInput = screen.getByPlaceholderText("Rating");
      fireEvent.change(ratingInput, { target: { value: "5" } });
    });

    await waitFor(() => {
      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Java")).toBeInTheDocument();
    });
  });
});
