import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import JobCard from "./JobCard";

describe("Candidate JobCard Component", () => {
  const mockJob = {
    jobId: 1,
    title: "Software Engineer",
    description: "Java and Spring Boot development role with 2+ years experience required.",
    status: "open",
    minExperienceYears: 2,
    assignedRecruiterName: "John Recruiter",
    skills: [
      { skillId: 1, skillName: "Java" },
      { skillId: 2, skillName: "Spring Boot" },
      { skillId: 3, skillName: "React" },
      { skillId: 4, skillName: "SQL" },
      { skillId: 5, skillName: "Docker" },
    ],
  };

  test("renders job title", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  test("renders job status badge", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("open")).toBeInTheDocument();
  });

  test("renders truncated description", () => {
    render(<JobCard job={mockJob} />);

    const description = screen.getByText(/Java and Spring Boot/);
    expect(description).toBeInTheDocument();
  });

  test("renders minimum experience", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("2 yrs")).toBeInTheDocument();
  });

  test("renders recruiter name", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("John Recruiter")).toBeInTheDocument();
  });

  test("renders skills (max 4)", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("Java")).toBeInTheDocument();
    expect(screen.getByText("Spring Boot")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("SQL")).toBeInTheDocument();
    expect(screen.queryByText("Docker")).not.toBeInTheDocument();
  });

  test("renders default recruiter when none assigned", () => {
    const jobWithoutRecruiter = { ...mockJob, assignedRecruiterName: null };
    render(<JobCard job={jobWithoutRecruiter} />);

    expect(screen.getByText("No recruiter")).toBeInTheDocument();
  });

  test("renders default experience when null", () => {
    const jobWithoutExperience = { ...mockJob, minExperienceYears: null };
    render(<JobCard job={jobWithoutExperience} />);

    expect(screen.getByText("- yrs")).toBeInTheDocument();
  });

  test("renders empty description when null", () => {
    const jobWithoutDescription = { ...mockJob, description: null };
    render(<JobCard job={jobWithoutDescription} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders no skills when skills array is empty", () => {
    const jobWithoutSkills = { ...mockJob, skills: [] };
    render(<JobCard job={jobWithoutSkills} />);

    expect(screen.queryByText("Java")).not.toBeInTheDocument();
  });
});
