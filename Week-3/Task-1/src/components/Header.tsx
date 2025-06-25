import React, { useEffect, useCallback } from "react";
import { Upload, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onFileUpload: (files: FileList) => void;
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
  onUploadError?: (error: Error) => void;
  isUploading?: boolean;
}

const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_ALLOWED_TYPES = [".glb"];

export const Header = ({
  onFileUpload,
  isDarkMode,
  onDarkModeChange,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  allowedFileTypes = DEFAULT_ALLOWED_TYPES,
  onUploadError,
  isUploading = false,
}: HeaderProps) => {
  // Persist theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Handle system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      onDarkModeChange(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [onDarkModeChange]);

  const validateFiles = useCallback(
    (files: FileList): File[] => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach((file) => {
        // Check file type
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        if (allowedFileTypes.indexOf(fileExtension) === -1) {
          errors.push(`Invalid file type for ${file.name}: ${fileExtension}`);
          return;
        }

        // Check file size
        if (file.size > maxFileSize) {
          errors.push(
            `File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(
              2
            )}MB)`
          );
          return;
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      return validFiles;
    },
    [allowedFileTypes, maxFileSize]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (!e.target.files?.length) {
          return;
        }

        const validFiles = validateFiles(e.target.files);
        if (validFiles.length > 0) {
          onFileUpload(e.target.files);
        }
      } catch (error) {
        onUploadError?.(
          error instanceof Error ? error : new Error("Upload failed")
        );
      }
    },
    [onFileUpload, onUploadError, validateFiles]
  );

  const handleThemeToggle = useCallback(() => {
    try {
      onDarkModeChange(!isDarkMode);
    } catch (error) {
      console.error("Failed to toggle theme:", error);
    }
  }, [isDarkMode, onDarkModeChange]);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">3D Model Viewer</h1>
      </div>

      <div className="flex items-center space-x-4">
        <label
          className={`btn btn-primary cursor-pointer whitespace-nowrap ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Upload Model"
          aria-busy={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Model"}
          <input
            type="file"
            className="hidden"
            accept={allowedFileTypes.join(",")}
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            data-testid="upload-file-input"
          />
        </label>

        <button
          className="btn btn-secondary"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          role="switch"
          aria-checked={isDarkMode}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleThemeToggle();
            }
          }}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
};
