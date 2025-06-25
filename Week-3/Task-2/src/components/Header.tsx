import React from "react";
import { Upload, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onFileUpload: (files: FileList) => void;
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

export const Header = ({
  onFileUpload,
  isDarkMode,
  onDarkModeChange,
}: HeaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">3D Model Viewer</h1>
      </div>

      <div className="flex items-center space-x-4">
        <label
          className="btn btn-primary cursor-pointer whitespace-nowrap"
          aria-label="Upload Model"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Model
          <input
            type="file"
            className="hidden"
            accept=".glb"
            multiple
            onChange={handleFileChange}
            data-testid="upload-file-input"
          />
        </label>

        <button
          className="btn btn-secondary"
          onClick={() => onDarkModeChange(!isDarkMode)}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
