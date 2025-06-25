import React, {
  Suspense,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import type { ModelState, LightSource } from "../types/model";
import { ModelControls } from "./ModelControls";
import { LoadingSpinner } from "./LoadingSpinner";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

// Helper function to generate unique ID
const generateUniqueId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Separate component for loading models
const ModelLoader = ({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: (gltf: GLTF) => void;
  onError: (error: Error) => void;
}) => {
  const gltf = useGLTF(url);
  const hasLoaded = React.useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;

    try {
      if (gltf.scene) {
        hasLoaded.current = true;
        onLoad(gltf);
      }
    } catch (err) {
      onError(err instanceof Error ? err : new Error("Failed to load model"));
    }

    return () => {
      hasLoaded.current = false;
    };
  }, [gltf, onLoad, onError]);

  return null;
};

// Component to render scene lights dynamically
interface SceneLightsProps {
  lights: LightSource[];
}

const SceneLights = ({ lights }: SceneLightsProps) => {
  return (
    <>
      {lights.map((light) => {
        const color = new THREE.Color(light.color);
        const position = new THREE.Vector3(...light.position);

        switch (light.type) {
          case "ambient":
            return (
              <ambientLight
                key={light.id}
                color={color}
                intensity={light.intensity}
              />
            );
          case "directional":
            const targetPosition = new THREE.Vector3(
              ...(light.target || [0, 0, 0])
            );
            return (
              <directionalLight
                key={light.id}
                color={color}
                intensity={light.intensity}
                position={position}
              >
                <object3D attach="target" position={targetPosition} />
              </directionalLight>
            );
          case "point":
            return (
              <pointLight
                key={light.id}
                color={color}
                intensity={light.intensity}
                position={position}
                distance={light.distance}
                decay={light.decay}
              />
            );
          case "spot":
            const spotTargetPosition = new THREE.Vector3(
              ...(light.target || [0, 0, 0])
            );
            return (
              <spotLight
                key={light.id}
                color={color}
                intensity={light.intensity}
                position={position}
                distance={light.distance}
                decay={light.decay}
                angle={light.angle}
                penumbra={light.penumbra}
              >
                <object3D attach="target" position={spotTargetPosition} />
              </spotLight>
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export const ModelViewer = () => {
  const [models, setModels] = useState<ModelState[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingModels, setLoadingModels] = useState<{
    [key: string]: boolean;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const processedUrls = useRef<Set<string>>(new Set());
  const orbitControlsRef = useRef<any>(null);
  const [sceneLights, setSceneLights] = useState<LightSource[]>([
    // Initial lights
    {
      id: generateUniqueId("ambient"),
      type: "ambient",
      name: "Ambient Light",
      color: "#ffffff",
      intensity: 0.5,
      position: [0, 0, 0],
    },
    {
      id: generateUniqueId("directional"),
      type: "directional",
      name: "Directional Light",
      color: "#ffffff",
      intensity: 1,
      position: [10, 10, 5],
      target: [0, 0, 0],
    },
  ]);

  const [pendingFiles, setPendingFiles] = useState<{ [url: string]: File }>({});

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleModelLoad = useCallback(
    (url: string, file: File) => (gltf: GLTF) => {
      if (processedUrls.current.has(url)) return;
      processedUrls.current.add(url);

      try {
        const modelScene = gltf.scene;
        const animations = gltf.animations || [];

        // Explicitly attach animations to the modelScene for useAnimations
        if (animations.length > 0) {
          // @ts-ignore: Three.js objects don't typically have an 'animations' property
          // unless assigned, but useAnimations looks for it here.
          modelScene.animations = animations;
        }

        // Calculate model metadata
        let meshCount = 0;
        let materialCount = 0;
        let vertexCount = 0;

        modelScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++;
            if (child.geometry) {
              vertexCount += child.geometry.attributes.position.count;
            }
          }
          if (child instanceof THREE.Material) {
            materialCount++;
          }
        });

        const modelId = generateUniqueId(file.name);
        const modelState: ModelState = {
          id: modelId,
          model: modelScene,
          metadata: {
            id: modelId,
            name: file.name,
            meshCount,
            materialCount,
            vertexCount,
            animations: animations.map((anim) => anim.name),
          },
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          wireframe: false,
          visible: true,
          gltf: gltf,
        };
        setModels((prevModels) => [...prevModels, modelState]);
        setLoadingModels((prev) => ({ ...prev, [url]: false }));
        setPendingFiles((prev) => {
          const newPending = { ...prev };
          delete newPending[url];
          return newPending;
        });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[url];
          return newErrors;
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to process model");
        // console.error(`Error processing model ${file.name}:`, error);
        setErrors((prev) => ({
          ...prev,
          [url]: `Error processing model: ${error.message}`,
        }));
        setLoadingModels((prev) => ({ ...prev, [url]: false }));
      }
    },
    []
  );

  const handleModelError = useCallback(
    (url: string, file: File) => (error: Error) => {
      // console.error(`Error loading model ${file.name}:`, error);
      setErrors((prev) => ({
        ...prev,
        [url]: `Error loading model: ${error.message}`,
      }));
      setLoadingModels((prev) => ({ ...prev, [url]: false }));
    },
    []
  );

  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.toLowerCase().endsWith(".glb")) {
        const url = URL.createObjectURL(file);
        setLoadingModels((prev) => ({ ...prev, [url]: true }));
        setPendingFiles((prev) => ({ ...prev, [url]: file }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[url];
          return newErrors;
        });
      }
    }
  }, []);

  const resetCamera = useCallback(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  }, []);

  const handleClearAllModels = useCallback(() => {
    setModels([]);
    setLoadingModels({});
    setErrors({});
    processedUrls.current.clear();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header
        onFileUpload={handleFileUpload}
        isDarkMode={isDarkMode}
        onDarkModeChange={setIsDarkMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          models={models}
          onUpdateModels={setModels}
          sceneLights={sceneLights}
          onUpdateLights={setSceneLights}
          resetCamera={resetCamera}
          onClearModels={handleClearAllModels}
        />

        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            className="w-full h-full"
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Environment preset="city" />
              <SceneLights lights={sceneLights} /> {/* Render dynamic lights */}
              {Object.entries(loadingModels).map(
                ([url, isLoading]) =>
                  isLoading &&
                  pendingFiles[url] && (
                    <ModelLoader
                      key={url}
                      url={url}
                      onLoad={handleModelLoad(url, pendingFiles[url])}
                      onError={handleModelError(url, pendingFiles[url])}
                    />
                  )
              )}
              {models.map((model) => (
                <ModelControls key={model.id} model={model} gltf={model.gltf} />
              ))}
              <OrbitControls ref={orbitControlsRef} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Error Display */}
      {Object.entries(errors).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <ul>
            {Object.entries(errors).map(([url, error]) => (
              <li key={url}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
