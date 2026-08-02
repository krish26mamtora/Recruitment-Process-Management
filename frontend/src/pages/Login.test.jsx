import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

beforeAll(() => {
  vi.mock("react-toastify", () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }));
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login Component", () => {
  test("renders login form", () => {
    renderWithRouter(<Login />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders register link", () => {
    renderWithRouter(<Login />);

    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("updates email input on change", () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput.value).toBe("test@example.com");
  });

  test("updates password input on change", () => {
    renderWithRouter(<Login />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  test("submits login form successfully", async () => {
    const toast = require("react-toastify").toast;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            fullName: "John Doe",
            email: "john@example.com",
            userId: "1",
            roles: ["Candidate"],
          }),
      })
    );

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome, John Doe");
    });
  });

  test("shows error on failed login", async () => {
    const toast = require("react-toastify").toast;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            message: "Invalid credentials",
          }),
      })
    );

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("handles server error", async () => {
    const toast = require("react-toastify").toast;
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    const submitButton = screen.getByText("Login");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error. Please try again.");
    });
  });
});
