import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";

beforeAll(() => {
  vi.mock("axios");
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Register Component", () => {
  test("renders register form", () => {
    renderWithRouter(<Register />);

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  test("renders login link", () => {
    renderWithRouter(<Register />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows error when passwords do not match", () => {
    renderWithRouter(<Register />);

    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });

    const submitButton = screen.getByText("Register");
    fireEvent.click(submitButton);

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  test("shows error when password is too short", () => {
    renderWithRouter(<Register />);

    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "12345" } });

    const submitButton = screen.getByText("Register");
    fireEvent.click(submitButton);

    expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
  });

  test("submits registration successfully", async () => {
    const axios = require("axios");
    axios.post.mockResolvedValue({ data: { success: true } });

    renderWithRouter(<Register />);

    const usernameInput = screen.getByLabelText("Username");
    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(fullNameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    const submitButton = screen.getByText("Register");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/users/register"),
        expect.objectContaining({
          username: "testuser",
          fullName: "Test User",
          email: "test@example.com",
          password: "password123",
        })
      );
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Registration successful!");
    });
  });

  test("shows error on registration failure", async () => {
    const axios = require("axios");
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    renderWithRouter(<Register />);

    const usernameInput = screen.getByLabelText("Username");
    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(fullNameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    const submitButton = screen.getByText("Register");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  test("disables button while loading", async () => {
    const axios = require("axios");
    let resolvePromise;
    axios.post.mockImplementation(() => new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    renderWithRouter(<Register />);

    const usernameInput = screen.getByLabelText("Username");
    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(fullNameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    const submitButton = screen.getByText("Register");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText("Registering...")).toBeInTheDocument();
    });

    resolvePromise({ data: { success: true } });
  });
});
