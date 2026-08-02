import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CandidateProfile from "./CandidateProfile";

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

describe("CandidateProfile Component", () => {
  test("renders profile page", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText(/Candidate Profile/)).toBeInTheDocument();
  });

  test("renders save button for own profile", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText("Save Profile")).toBeInTheDocument();
  });

  test("renders personal details section", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText("1. Basic Personal Details")).toBeInTheDocument();
  });

  test("renders professional summary section", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText("2. Professional Summary")).toBeInTheDocument();
  });

  test("renders technical skills section", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText("3. Technical Skills")).toBeInTheDocument();
  });

  test("renders work experience section", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText("4. Work Experience")).toBeInTheDocument();
  });

  test("renders education section", () => {
    window.localStorage.setItem("userId", "1");
    renderWithRouter(<CandidateProfile />);

    expect(screen.getByText("5. Education")).toBeInTheDocument();
  });

  test("loads profile data from API", async () => {
    window.localStorage.setItem("userId", "1");
    const mockProfile = {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      city: "New York",
      skills: "Java, React",
      experiencesJson: JSON.stringify([{ companyName: "Tech Corp", jobTitle: "Developer" }]),
      educationJson: JSON.stringify([{ college: "MIT", degree: "B.Tech" }]),
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })
    );

    renderWithRouter(<CandidateProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
  });

  test("saves profile data", async () => {
    window.localStorage.setItem("userId", "1");
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/user-profiles") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    renderWithRouter(<CandidateProfile />);

    await waitFor(() => {
      const saveButton = screen.getByText("Save Profile");
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Profile saved successfully");
    });
  });

  test("shows alert when no valid userId on save", async () => {
    window.localStorage.setItem("userId", "invalid");
    renderWithRouter(<CandidateProfile />);

    const saveButton = screen.getByText("Save Profile");
    fireEvent.click(saveButton);

    expect(global.alert).toHaveBeenCalledWith("No valid user ID found. Please login again.");
  });
});
