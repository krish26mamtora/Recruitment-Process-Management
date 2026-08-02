import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import ApplyJob from "./ApplyJob";

beforeAll(() => {
  vi.mock("axios");
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ApplyJob Component", () => {
  test("renders apply job form", () => {
    render(<ApplyJob jobId={1} candidateId={1} />);

    expect(screen.getByText("Apply for Job")).toBeInTheDocument();
    expect(screen.getByText("Upload Resume & Apply")).toBeInTheDocument();
  });

  test("renders file input", () => {
    render(<ApplyJob jobId={1} candidateId={1} />);

    const fileInput = screen.getByType("file");
    expect(fileInput).toBeInTheDocument();
  });

  test("shows message when no file selected on submit", () => {
    render(<ApplyJob jobId={1} candidateId={1} />);

    const submitButton = screen.getByText("Upload Resume & Apply");
    fireEvent.click(submitButton);

    expect(screen.getByText("Please select a resume to upload.")).toBeInTheDocument();
  });

  test("handles file selection", () => {
    render(<ApplyJob jobId={1} candidateId={1} />);

    const fileInput = screen.getByType("file");
    const file = new File(["resume content"], "resume.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.queryByText("Please select a resume to upload.")).not.toBeInTheDocument();
  });

  test("submits form with file", async () => {
    const axios = require("axios");
    axios.post.mockResolvedValue({ data: "Application submitted successfully" });

    render(<ApplyJob jobId={1} candidateId={1} />);

    const fileInput = screen.getByType("file");
    const file = new File(["resume content"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByText("Upload Resume & Apply");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test("shows error message on upload failure", async () => {
    const axios = require("axios");
    axios.post.mockRejectedValue(new Error("Upload failed"));

    render(<ApplyJob jobId={1} candidateId={1} />);

    const fileInput = screen.getByType("file");
    const file = new File(["resume content"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByText("Upload Resume & Apply");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Error uploading resume.")).toBeInTheDocument();
    });
  });
});
