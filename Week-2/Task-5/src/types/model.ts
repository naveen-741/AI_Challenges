import { Group } from "three";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

export interface ModelMetadata {
  id: string;
  name: string;
  meshCount: number;
  materialCount: number;
  vertexCount: number;
  animations: string[];
}

export interface ModelState {
  id: string;
  model: THREE.Object3D;
  metadata: {
    id: string;
    name: string;
    meshCount: number;
    materialCount: number;
    vertexCount: number;
    animations: string[];
  };
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  wireframe: boolean;
  visible: boolean;
  currentAnimation?: string;
  gltf?: GLTF;
}

export interface SceneState {
  models: ModelState[];
  ambientLightIntensity: number;
  directionalLightIntensity: number;
}

export type LightType = "ambient" | "directional" | "point" | "spot";

export interface LightSource {
  id: string;
  type: LightType;
  name: string;
  color: string;
  intensity: number;
  position: [number, number, number];
  // Specific properties for different light types
  distance?: number; // For PointLight, SpotLight
  decay?: number; // For PointLight, SpotLight
  angle?: number; // For SpotLight
  penumbra?: number; // For SpotLight
  target?: [number, number, number]; // For DirectionalLight, SpotLight
}
