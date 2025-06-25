import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  const mockOnFileUpload = jest.fn();
  const mockOnDarkModeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByLabelText(/Toggle dark mode/i)).toBeInTheDocument();
  });

  it("calls onFileUpload when a file is selected", async () => {
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

  it("calls onDarkModeChange with true when dark mode toggle is clicked and initially false", () => {
    render(
      <Header
        onFileUpload={mockOnFileUpload}
        onDarkModeChange={mockOnDarkModeChange}
        isDarkMode={false}
      />
    );
    fireEvent.click(screen.getByLabelText(/Toggle dark mode/i));
    expect(mockOnDarkModeChange).toHaveBeenCalledTimes(1);
    expect(mockOnDarkModeChange).toHaveBeenCalledWith(true);
  });

  it("calls onDarkModeChange with false when dark mode toggle is clicked and initially true", () => {
    render(
      <Header
        onFileUpload={mockOnFileUpload}
        onDarkModeChange={mockOnDarkModeChange}
        isDarkMode={true}
      />
    );
    fireEvent.click(screen.getByLabelText(/Toggle dark mode/i));
    expect(mockOnDarkModeChange).toHaveBeenCalledTimes(1);
    expect(mockOnDarkModeChange).toHaveBeenCalledWith(false);
  });
});
