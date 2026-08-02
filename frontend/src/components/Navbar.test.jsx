import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

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

describe("Navbar Component", () => {
  test("renders home and login/register links when not logged in", () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test("renders admin navigation links when user has Admin role", () => {
    window.localStorage.setItem("userRoles", JSON.stringify(["Admin"]));

    renderWithRouter(<Navbar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByText("Manage Jobs")).toBeInTheDocument();
    expect(screen.getByText("Scheduled Interviews")).toBeInTheDocument();
    expect(screen.getByText("Candidates")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("renders candidate navigation links when user has Candidate role", () => {
    window.localStorage.setItem("userRoles", JSON.stringify(["Candidate"]));

    renderWithRouter(<Navbar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Jobs")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("renders brand link", () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText("Recruitment Portal")).toBeInTheDocument();
  });

  test("clears localStorage and cookies on logout", () => {
    window.localStorage.setItem("userRoles", JSON.stringify(["Admin"]));
    window.localStorage.setItem("userId", "123");
    document.cookie = "test=value";

    renderWithRouter(<Navbar />);

    const logoutButton = screen.getByText("Logout");
    logoutButton.click();

    expect(window.localStorage.getItem("userRoles")).toBeNull();
    expect(window.localStorage.getItem("userId")).toBeNull();
  });
});
