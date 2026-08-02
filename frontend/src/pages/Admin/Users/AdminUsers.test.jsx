import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AdminUsers from "./AdminUsers";

beforeAll(() => {
  global.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("AdminUsers Component", () => {
  const mockUsers = [
    {
      userId: 1,
      username: "testuser",
      fullName: "Test User",
      email: "test@example.com",
      roles: [{ roleName: "ROLE_USER" }],
    },
    {
      userId: 2,
      username: "admin",
      fullName: "Admin User",
      email: "admin@example.com",
      roles: [{ roleName: "ROLE_ADMIN" }],
    },
  ];

  test("renders loading state initially", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  test("renders users list after loading", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });
  });

  test("renders empty state when no users", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  test("renders create user form", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("Create New User")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    });
  });

  test("creates new user successfully", async () => {
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/users/create") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ userId: 3 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });
    });

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      const usernameInput = screen.getByPlaceholderText("Username");
      fireEvent.change(usernameInput, { target: { value: "newuser" } });
    });

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Full Name");
      fireEvent.change(nameInput, { target: { value: "New User" } });
    });

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText("Email");
      fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    });

    await waitFor(() => {
      const createButton = screen.getByText("Create User");
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/create"),
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });

  test("renders role checkboxes", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("ROLE_USER")).toBeInTheDocument();
      expect(screen.getByText("ROLE_ADMIN")).toBeInTheDocument();
      expect(screen.getByText("Candidate")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });

  test("toggles role selection", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      const roleCheckbox = screen.getByText("ROLE_USER");
      fireEvent.click(roleCheckbox);
    });

    await waitFor(() => {
      const roleCheckbox = screen.getByText("ROLE_USER");
      expect(roleCheckbox).toBeInTheDocument();
    });
  });

  test("saves user roles", async () => {
    global.fetch = vi.fn((url, options) => {
      if (url.includes("/users/1/roles") && options?.method === "PUT") {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });
    });

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      const saveButton = screen.getByText("Save Roles");
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1/roles"),
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });

  test("renders bulk upload section", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("Bulk Upload Candidates")).toBeInTheDocument();
    });
  });

  test("renders resume parse section", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("Parse Candidate Resume")).toBeInTheDocument();
    });
  });

  test("renders view profile link", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    renderWithRouter(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("View Profile")).toBeInTheDocument();
    });
  });
});
