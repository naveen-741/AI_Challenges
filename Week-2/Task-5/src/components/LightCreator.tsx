import React, { useState, useEffect } from "react";
import type { LightSource, LightType } from "../types/model";

interface LightCreatorProps {
  light?: LightSource; // Optional, for editing existing light
  onSave: (light: LightSource) => void;
  onCancel: () => void;
}

const generateUniqueId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const LightCreator = ({
  light,
  onSave,
  onCancel,
}: LightCreatorProps) => {
  const [id, setId] = useState(light?.id || generateUniqueId("light"));
  const [name, setName] = useState(light?.name || "New Light");
  const [type, setType] = useState<LightType>(light?.type || "directional");
  const [color, setColor] = useState(light?.color || "#ffffff");
  const [intensity, setIntensity] = useState(light?.intensity || 1);
  const [position, setPosition] = useState<[number, number, number]>(
    light?.position || [0, 0, 0]
  );

  // Specific light properties
  const [distance, setDistance] = useState(light?.distance || 10);
  const [decay, setDecay] = useState(light?.decay || 2);
  const [angle, setAngle] = useState(light?.angle || Math.PI / 4);
  const [penumbra, setPenumbra] = useState(light?.penumbra || 0);
  const [target, setTarget] = useState<[number, number, number]>(
    light?.target || [0, 0, 0]
  );

  useEffect(() => {
    if (light) {
      setId(light.id);
      setName(light.name);
      setType(light.type);
      setColor(light.color);
      setIntensity(light.intensity);
      setPosition(light.position);
      setDistance(light.distance || 10);
      setDecay(light.decay || 2);
      setAngle(light.angle || Math.PI / 4);
      setPenumbra(light.penumbra || 0);
      setTarget(light.target || [0, 0, 0]);
    }
  }, [light]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLight: LightSource = {
      id,
      name,
      type,
      color,
      intensity,
      position,
    };

    if (type === "point" || type === "spot") {
      newLight.distance = distance;
      newLight.decay = decay;
    }
    if (type === "spot") {
      newLight.angle = angle;
      newLight.penumbra = penumbra;
    }
    if (type === "directional" || type === "spot") {
      newLight.target = target;
    }

    onSave(newLight);
  };

  return (
    <div className="p-4 border border-border rounded-lg space-y-4 bg-background">
      <h3 className="text-lg font-semibold">
        {light ? "Edit Light Source" : "Add New Light Source"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="light-name"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="light-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background text-foreground"
            required
          />
        </div>

        <div>
          <label
            htmlFor="light-type"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Type
          </label>
          <select
            id="light-type"
            value={type}
            onChange={(e) => setType(e.target.value as LightType)}
            className="w-full p-2 border border-border rounded bg-background text-foreground"
          >
            <option value="ambient">AmbientLight</option>
            <option value="directional">DirectionalLight</option>
            <option value="point">PointLight</option>
            <option value="spot">SpotLight</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="light-color"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Color
          </label>
          <input
            type="color"
            id="light-color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-border rounded bg-background"
          />
        </div>

        <div>
          <label
            htmlFor="light-intensity"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Intensity
          </label>
          <input
            type="number"
            id="light-intensity"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            step="0.1"
            min="0"
            className="w-full p-2 border border-border rounded bg-background text-foreground"
            required
          />
        </div>

        {type !== "ambient" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={position[0]}
                onChange={(e) =>
                  setPosition([
                    parseFloat(e.target.value),
                    position[1],
                    position[2],
                  ])
                }
                className="w-full p-1 border border-border rounded bg-background text-foreground"
                step="0.1"
              />
              <input
                type="number"
                value={position[1]}
                onChange={(e) =>
                  setPosition([
                    position[0],
                    parseFloat(e.target.value),
                    position[2],
                  ])
                }
                className="w-full p-1 border border-border rounded bg-background text-foreground"
                step="0.1"
              />
              <input
                type="number"
                value={position[2]}
                onChange={(e) =>
                  setPosition([
                    position[0],
                    position[1],
                    parseFloat(e.target.value),
                  ])
                }
                className="w-full p-1 border border-border rounded bg-background text-foreground"
                step="0.1"
              />
            </div>
          </div>
        )}

        {(type === "directional" || type === "spot") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Target Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={target[0]}
                onChange={(e) =>
                  setTarget([parseFloat(e.target.value), target[1], target[2]])
                }
                className="w-full p-1 border border-border rounded bg-background text-foreground"
                step="0.1"
              />
              <input
                type="number"
                value={target[1]}
                onChange={(e) =>
                  setTarget([target[0], parseFloat(e.target.value), target[2]])
                }
                className="w-full p-1 border border-border rounded bg-background text-foreground"
                step="0.1"
              />
              <input
                type="number"
                value={target[2]}
                onChange={(e) =>
                  setTarget([target[0], target[1], parseFloat(e.target.value)])
                }
                className="w-full p-1 border border-border rounded bg-background text-foreground"
                step="0.1"
              />
            </div>
          </div>
        )}

        {(type === "point" || type === "spot") && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="light-distance"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Distance
              </label>
              <input
                type="number"
                id="light-distance"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                className="w-full p-2 border border-border rounded bg-background text-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="light-decay"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Decay
              </label>
              <input
                type="number"
                id="light-decay"
                value={decay}
                onChange={(e) => setDecay(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                className="w-full p-2 border border-border rounded bg-background text-foreground"
              />
            </div>
          </div>
        )}

        {type === "spot" && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="light-angle"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Angle
              </label>
              <input
                type="number"
                id="light-angle"
                value={angle}
                onChange={(e) => setAngle(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max={Math.PI / 2}
                className="w-full p-2 border border-border rounded bg-background text-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="light-penumbra"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Penumbra
              </label>
              <input
                type="number"
                id="light-penumbra"
                value={penumbra}
                onChange={(e) => setPenumbra(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="1"
                className="w-full p-2 border border-border rounded bg-background text-foreground"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {light ? "Save Changes" : "Add Light"}
          </button>
        </div>
      </form>
    </div>
  );
};
