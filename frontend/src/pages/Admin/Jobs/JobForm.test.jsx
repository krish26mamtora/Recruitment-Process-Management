import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import JobForm from "./JobForm";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("JobForm Component", () => {
  const mockSkills = [
    { skill_id: 1, skill_name: "Java" },
    { skill_id: 2, skill_name: "React" },
    { skill_id: 3, skill_name: "Spring Boot" },
  ];

  test("renders create job form", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    expect(screen.getByText("Create Job")).toBeInTheDocument();
    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
  });

  test("renders edit job form when id is provided", async () => {
    const mockJob = {
      jobId: 1,
      title: "Software Engineer",
      description: "Java role",
      minExperienceYears: 2,
      status: "open",
      skills: mockSkills,
    };

    global.fetch = vi.fn((url) => {
      if (url.includes("/jobs/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJob),
        });
      }
      if (url.includes("/skills")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSkills),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobForm />);

    await waitFor(() => {
      expect(screen.getByText("Edit Job")).toBeInTheDocument();
    });
  });

  test("renders form fields", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Minimum Experience (years)")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  test("shows reason field when status is closed", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "closed" } });

    await waitFor(() => {
      expect(screen.getByLabelText("Reason for closing")).toBeInTheDocument();
    });
  });

  test("renders skills autocomplete", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    await waitFor(() => {
      const skillInput = screen.getByPlaceholderText("Search skills...");
      expect(skillInput).toBeInTheDocument();
    });
  });

  test("adds skill from suggestions", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    await waitFor(() => {
      const skillInput = screen.getByPlaceholderText("Search skills...");
      fireEvent.change(skillInput, { target: { value: "Java" } });
    });

    await waitFor(() => {
      const suggestion = screen.getByText("Java");
      fireEvent.click(suggestion);
    });

    await waitFor(() => {
      expect(screen.getByText("Java")).toBeInTheDocument();
    });
  });

  test("removes skill when remove button clicked", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    await waitFor(() => {
      const skillInput = screen.getByPlaceholderText("Search skills...");
      fireEvent.change(skillInput, { target: { value: "Java" } });
    });

    await waitFor(() => {
      const suggestion = screen.getByText("Java");
      fireEvent.click(suggestion);
    });

    await waitFor(() => {
      const removeButton = screen.getByText("×");
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText("Java")).not.toBeInTheDocument();
    });
  });

  test("submits form on create", async () => {
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/skills")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSkills),
        });
      }
      if (url.includes("/jobs") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ jobId: 1 }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter(<JobForm />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText("Title *");
      fireEvent.change(titleInput, { target: { value: "Software Engineer" } });
    });

    await waitFor(() => {
      const submitButton = screen.getByText("Create Job");
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Job created successfully");
    });
  });

  test("navigates back on cancel", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSkills),
      })
    );

    renderWithRouter(<JobForm />);

    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel");
      cancelButton.click();
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/jobs");
    });
  });
});
