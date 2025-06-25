import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  const mockOnFileUpload = jest.fn();
  const mockOnDarkModeChange = jest.fn();
  const mockOnUploadError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("renders correctly", () => {
    render(
      <Header
        onFileUpload={mockOnFileUpload}
        onDarkModeChange={mockOnDarkModeChange}
        isDarkMode={false}
      />
    );

    expect(screen.getByText(/3D Model Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Switch to dark mode/i)).toBeInTheDocument();
  });

  describe("File Upload", () => {
    it("calls onFileUpload when a valid file is selected", async () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      const file = new File(["dummy content"], "test.glb", {
        type: "model/gltf-binary",
      });
      const fileInput = screen.getByTestId("upload-file-input");

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
        expect(mockOnFileUpload.mock.calls[0][0][0]).toBe(file);
      });
    });

    it("handles empty file selection", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      const fileInput = screen.getByTestId("upload-file-input");
      fireEvent.change(fileInput);

      expect(mockOnFileUpload).not.toHaveBeenCalled();
    });

    it("rejects invalid file types", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
          onUploadError={mockOnUploadError}
        />
      );

      const file = new File(["dummy content"], "test.txt", {
        type: "text/plain",
      });
      const fileInput = screen.getByTestId("upload-file-input");

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: true,
      });

      fireEvent.change(fileInput);

      expect(mockOnUploadError).toHaveBeenCalled();
      expect(mockOnFileUpload).not.toHaveBeenCalled();
    });

    it("rejects files exceeding size limit", () => {
      const maxFileSize = 1024; // 1KB
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
          onUploadError={mockOnUploadError}
          maxFileSize={maxFileSize}
        />
      );

      const file = new File(["x".repeat(2048)], "test.glb", {
        type: "model/gltf-binary",
      });
      const fileInput = screen.getByTestId("upload-file-input");

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: true,
      });

      fireEvent.change(fileInput);

      expect(mockOnUploadError).toHaveBeenCalled();
      expect(mockOnFileUpload).not.toHaveBeenCalled();
    });

    it("shows loading state during upload", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
          isUploading={true}
        />
      );

      expect(screen.getByText(/Uploading.../i)).toBeInTheDocument();
      expect(screen.getByTestId("upload-file-input")).toBeDisabled();
    });
  });

  describe("Dark Mode", () => {
    it("persists theme preference to localStorage", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={true}
        />
      );

      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("handles system theme preference changes", () => {
      const mockMatchMedia = window.matchMedia as jest.Mock;
      const mockAddEventListener = jest.fn();
      mockMatchMedia.mockImplementation(() => ({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
      }));

      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      expect(mockAddEventListener).toHaveBeenCalled();
    });

    it("toggles theme on keyboard interaction", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      const themeButton = screen.getByRole("switch");
      fireEvent.keyDown(themeButton, { key: "Enter" });

      expect(mockOnDarkModeChange).toHaveBeenCalledWith(true);
    });

    it("handles theme toggle errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockOnDarkModeChange.mockImplementationOnce(() => {
        throw new Error("Theme toggle failed");
      });

      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      const themeButton = screen.getByRole("switch");
      fireEvent.click(themeButton);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      const themeButton = screen.getByRole("switch");
      expect(themeButton).toHaveAttribute("aria-checked", "false");
      expect(themeButton).toHaveAttribute("aria-label", "Switch to dark mode");
    });

    it("handles keyboard navigation", () => {
      render(
        <Header
          onFileUpload={mockOnFileUpload}
          onDarkModeChange={mockOnDarkModeChange}
          isDarkMode={false}
        />
      );

      const themeButton = screen.getByRole("switch");
      fireEvent.keyDown(themeButton, { key: " " });
      expect(mockOnDarkModeChange).toHaveBeenCalledWith(true);
    });
  });
});
