import React, { useState } from "react";
import type { ModelState } from "../types/model";
import { Moon, Sun, Upload, Trash2, RotateCcw } from "lucide-react";

interface SceneControlsProps {
  models: ModelState[];
  onModelsChange: (models: ModelState[]) => void;
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  onFileUpload: (files: FileList) => void;
  resetCamera: () => void;
}

export const SceneControls = ({
  models,
  onModelsChange,
  isDarkMode,
  onDarkModeChange,
  onFileUpload,
  resetCamera,
}: SceneControlsProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    onFileUpload(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onDarkModeChange(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={resetCamera}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <label
            className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isDragging ? "bg-blue-100 dark:bg-blue-900" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload size={20} />
            <input
              type="file"
              accept=".glb"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{model.metadata.name}</h3>
              <button
                onClick={() => {
                  onModelsChange(models.filter((m) => m.id !== model.id));
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Meshes: {model.metadata.meshCount}</p>
                <p>Materials: {model.metadata.materialCount}</p>
                <p>Vertices: {model.metadata.vertexCount}</p>
              </div>

              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={model.wireframe}
                    onChange={() => {
                      onModelsChange(
                        models.map((m) =>
                          m.id === model.id
                            ? { ...m, wireframe: !m.wireframe }
                            : m
                        )
                      );
                    }}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm">Wireframe</span>
                </label>
              </div>

              {model.metadata.animations.length > 0 ? (
                <select
                  value={model.currentAnimation || ""}
                  onChange={(e) => {
                    onModelsChange(
                      models.map((m) =>
                        m.id === model.id
                          ? { ...m, currentAnimation: e.target.value }
                          : m
                      )
                    );
                  }}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="">No Animation</option>
                  {model.metadata.animations.map((anim) => (
                    <option key={anim} value={anim}>
                      {anim}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No Animation Available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
