import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Home Component", () => {
  test("renders home page title", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("Recruitment Portal")).toBeInTheDocument();
  });

  test("renders description", () => {
    renderWithRouter(<Home />);

    expect(
      screen.getByText("Streamlined hiring for admins, recruiters, and candidates.")
    ).toBeInTheDocument();
  });

  test("renders login button", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders register button", () => {
    renderWithRouter(<Home />);

    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("renders within home-page and card structure", () => {
    const { container } = renderWithRouter(<Home />);

    expect(container.querySelector(".home-page")).toBeInTheDocument();
    expect(container.querySelector(".card")).toBeInTheDocument();
  });
});
