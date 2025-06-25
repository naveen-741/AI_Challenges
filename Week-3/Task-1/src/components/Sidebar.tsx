import React, { useState } from "react";
import { Settings, Camera, Layers, Trash2, Lightbulb } from "lucide-react";
import type { ModelState, LightSource } from "../types/model";
import { LightCreator } from "./LightCreator";

interface SidebarProps {
  models: ModelState[];
  onUpdateModels: (models: ModelState[]) => void;
  sceneLights: LightSource[];
  onUpdateLights: (lights: LightSource[]) => void;
  resetCamera: () => void;
  onClearModels: () => void;
}

export const Sidebar = ({
  models,
  onUpdateModels,
  sceneLights,
  onUpdateLights,
  resetCamera,
  onClearModels,
}: SidebarProps) => {
  const [showLightCreator, setShowLightCreator] = useState(false);
  const [editingLight, setEditingLight] = useState<LightSource | undefined>(
    undefined
  );

  // State for collapsible sections
  const [isSceneControlsExpanded, setIsSceneControlsExpanded] = useState(true);
  const [isLightControlsExpanded, setIsLightControlsExpanded] = useState(true);
  const [isModelsExpanded, setIsModelsExpanded] = useState(true);

  const handleModelChange = (modelId: string, changes: Partial<ModelState>) => {
    onUpdateModels(
      models.map((model) =>
        model.id === modelId ? { ...model, ...changes } : model
      )
    );
  };

  const handleModelDelete = (modelId: string) => {
    onUpdateModels(models.filter((model) => model.id !== modelId));
  };

  const handleAddLight = (newLight: LightSource) => {
    onUpdateLights([...sceneLights, newLight]);
    setShowLightCreator(false);
  };

  const handleEditLight = (updatedLight: LightSource) => {
    onUpdateLights(
      sceneLights.map((light) =>
        light.id === updatedLight.id ? updatedLight : light
      )
    );
    setEditingLight(undefined);
    setShowLightCreator(false);
  };

  const handleDeleteLight = (lightId: string) => {
    onUpdateLights(sceneLights.filter((light) => light.id !== lightId));
  };

  return (
    <aside className="md:w-80 w-full fixed md:static z-20 border-r border-border bg-background p-4 overflow-y-auto h-full md:h-auto transition-all duration-300">
      <button
        className="md:hidden mb-4 btn btn-secondary"
        onClick={() => setIsModelsExpanded((v) => !v)}
      >
        {isModelsExpanded ? "Hide Sidebar" : "Show Sidebar"}
      </button>
      <div className="space-y-2">
        {/* Scene Controls */}
        <div className="space-y-2">
          <h2
            className="text-sm font-semibold flex items-center justify-between cursor-pointer"
            onClick={() => setIsSceneControlsExpanded(!isSceneControlsExpanded)}
          >
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Scene Controls
            </div>
            {isSceneControlsExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            )}
          </h2>
          <div
            className={`space-y-4 transition-all duration-300 ease-in-out ${
              isSceneControlsExpanded ? "max-h-96" : "max-h-0"
            } overflow-hidden`}
          >
            <button
              className="btn btn-secondary w-full flex items-center justify-center text-sm"
              onClick={resetCamera}
            >
              <Camera className="w-4 h-4 mr-2" />
              Reset Camera
            </button>
          </div>
        </div>

        {/* Light Controls */}
        <div className="space-y-2">
          <h2
            className="text-sm font-semibold flex items-center justify-between cursor-pointer"
            onClick={() => setIsLightControlsExpanded(!isLightControlsExpanded)}
          >
            <div className="flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Light Controls
            </div>
            {isLightControlsExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            )}
          </h2>
          <div
            className={`space-y-4 transition-all duration-300 ease-in-out ${
              isLightControlsExpanded ? "max-h-none" : "max-h-0"
            } overflow-hidden`}
          >
            <button
              className="btn btn-primary w-full flex items-center justify-center text-sm"
              onClick={() => {
                setEditingLight(undefined);
                setShowLightCreator(true);
              }}
            >
              Add New Light
            </button>

            {showLightCreator && (
              <LightCreator
                light={editingLight}
                onSave={editingLight ? handleEditLight : handleAddLight}
                onCancel={() => {
                  setShowLightCreator(false);
                  setEditingLight(undefined);
                }}
              />
            )}

            <div className="space-y-4">
              {sceneLights.map((light) => (
                <div
                  key={light.id}
                  className="flex items-center justify-between p-2 border border-border rounded-lg bg-background"
                >
                  <span className="font-medium text-sm">
                    {light.name} ({light.type})
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-secondary px-3 py-1 text-sm"
                      onClick={() => {
                        setEditingLight(light);
                        setShowLightCreator(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary px-3 py-1 text-sm text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteLight(light.id)}
                      aria-label="Delete Light"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model List */}
        <div className="space-y-2">
          <h2
            className="text-sm font-semibold flex items-center justify-between cursor-pointer"
            onClick={() => setIsModelsExpanded(!isModelsExpanded)}
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Models</span>
            </div>
            <div className="flex items-center space-x-2">
              {models.length > 0 && (
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-red-500 bg-red-500 hover:bg-red-600 text-white cursor-pointer px-2 [padding-top:0.375rem] [padding-bottom:0.375rem]"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling section expansion
                    onClearModels();
                  }}
                  aria-label="Clear All Models"
                  title="Clear All Models"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  <span>Clear</span>
                </button>
              )}
              {isModelsExpanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </div>
          </h2>
          <div
            className={`space-y-4 transition-all duration-300 ease-in-out ${
              isModelsExpanded ? "max-h-none" : "max-h-0"
            } overflow-hidden`}
          >
            {models.map((model) => (
              <div
                key={model.id}
                className="p-4 border border-border rounded-lg space-y-4"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-medium break-words min-w-0 flex-1 text-sm">
                    {model.metadata.name}
                  </h3>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      className="btn btn-secondary px-3 py-1 text-sm"
                      onClick={() =>
                        handleModelChange(model.id, {
                          visible: !model.visible,
                        })
                      }
                    >
                      {model.visible ? "Hide" : "Show"}
                    </button>
                    <button
                      className="btn btn-secondary px-3 py-1 text-sm text-red-500 hover:text-red-600"
                      onClick={() => handleModelDelete(model.id)}
                      aria-label={`Delete ${model.metadata.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Model Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`wireframe-${model.id}`}
                      className="text-sm"
                    >
                      Wireframe
                    </label>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        id={`wireframe-${model.id}`}
                        checked={model.wireframe}
                        onChange={(e) =>
                          handleModelChange(model.id, {
                            wireframe: e.target.checked,
                          })
                        }
                      />
                    </label>
                  </div>

                  {model.metadata.animations.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-sm" htmlFor="animation-select">
                        Animation
                      </label>
                      <select
                        id="animation-select"
                        name="Animation"
                        value={model.currentAnimation || ""}
                        onChange={(e) =>
                          handleModelChange(model.id, {
                            currentAnimation: e.target.value || undefined,
                          })
                        }
                        className="w-full p-2 border border-border rounded bg-background text-sm"
                      >
                        <option value="">None</option>
                        {model.metadata.animations.map((anim) => (
                          <option key={anim} value={anim}>
                            {anim}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Transform Controls */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Transform</h4>
                    {(["position", "rotation", "scale"] as const).map(
                      (transform) => (
                        <div key={transform} className="grid grid-cols-3 gap-2">
                          {(["X", "Y", "Z"] as const).map((axis) => {
                            const index =
                              axis === "X" ? 0 : axis === "Y" ? 1 : 2;
                            return (
                              <input
                                key={axis}
                                type="number"
                                value={model[transform][index]}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  const newTransform = [...model[transform]];
                                  newTransform[index] = value;
                                  handleModelChange(model.id, {
                                    [transform]: newTransform,
                                  });
                                }}
                                className="w-full p-1 border border-border rounded bg-background text-sm"
                                step={transform === "scale" ? 0.1 : 0.5}
                              />
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
