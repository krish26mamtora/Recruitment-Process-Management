import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

describe("App Component", () => {
  test("renders Navbar component", () => {
    render(<App />);

    expect(screen.getByText("Recruitment Portal")).toBeInTheDocument();
  });

  test("renders ToastContainer", () => {
    const { container } = render(<App />);

    expect(container.querySelector(".ToastContainer")).toBeInTheDocument();
  });

  test("renders home route by default", () => {
    render(<App />);

    expect(screen.getByText("Streamlined hiring for admins, recruiters, and candidates.")).toBeInTheDocument();
  });
});
