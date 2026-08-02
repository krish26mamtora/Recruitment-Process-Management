import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import JobApplicationForm from "./JobApplicationForm";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("JobApplicationForm Component", () => {
  test("renders application form", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<JobApplicationForm />);

    expect(screen.getByText(/Apply for Job/)).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
  });

  test("prefills data from user profile", async () => {
    window.localStorage.setItem("userId", "1");
    const mockProfile = {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      city: "New York",
      educationJson: JSON.stringify([{ college: "MIT", degree: "B.Tech" }]),
      experiencesJson: JSON.stringify([{ jobTitle: "Developer", companyName: "Tech Corp" }]),
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })
    );

    renderWithRouter(<JobApplicationForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
  });

  test("shows alert when no valid userId", async () => {
    window.localStorage.setItem("userId", "invalid");
    renderWithRouter(<JobApplicationForm />);

    const submitButton = screen.getByText("Submit Application");
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith("No valid candidate found. Please login again.");
  });

  test("shows alert when no resume uploaded", async () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<JobApplicationForm />);

    const submitButton = screen.getByText("Submit Application");
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith("Please upload your resume.");
  });

  test("submits form successfully", async () => {
    window.localStorage.setItem("userId", "1");
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/apply") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    renderWithRouter(<JobApplicationForm />);

    await waitFor(() => {
      const fullNameInput = screen.getByLabelText("Full Name:");
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    });

    await waitFor(() => {
      const emailInput = screen.getByLabelText("Email:");
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    });

    await waitFor(() => {
      const fileInput = screen.getByType("file");
      const file = new File(["resume"], "resume.pdf", { type: "application/pdf" });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      const submitButton = screen.getByText("Submit Application");
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Application submitted successfully!");
    });
  });

  test("renders all required form fields", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<JobApplicationForm />);

    expect(screen.getByLabelText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByLabelText("Gender:")).toBeInTheDocument();
    expect(screen.getByLabelText("Age:")).toBeInTheDocument();
    expect(screen.getByLabelText("Address:")).toBeInTheDocument();
    expect(screen.getByLabelText("College Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Degree:")).toBeInTheDocument();
    expect(screen.getByLabelText("Branch / Major:")).toBeInTheDocument();
    expect(screen.getByLabelText("CPI / CGPA:")).toBeInTheDocument();
  });
});
