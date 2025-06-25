import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";
import type { ModelState } from "../types/model";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

interface ModelControlsProps {
  model: ModelState;
  gltf?: GLTF;
}

export const ModelControls = ({ model, gltf }: ModelControlsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const primitiveRef = useRef<THREE.Object3D>(null);

  // Setup animations: Use primitiveRef as the root
  const { actions, names } = useAnimations(gltf?.animations || [], gltf?.scene);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            materials.forEach((mat) => {
              mat.side = THREE.DoubleSide;
              mat.transparent = false;
              mat.opacity = 1;
              mat.wireframe = model.wireframe;
              mat.needsUpdate = true;
            });
          }
        }
      });
    }
  }, [model.model, model.wireframe]);

  // Animation playback effect
  useEffect(() => {
    if (!model.currentAnimation) {
      names.forEach((name) => {
        const action = actions[name];
        if (action) {
          action.stop();
        }
      });
      return;
    }

    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        if (name === model.currentAnimation) {
          action.reset().fadeIn(0.5).play();
        } else {
          action.fadeOut(0.5).stop();
        }
      }
    });
  }, [model.currentAnimation, actions, names]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...model.position);
      groupRef.current.rotation.set(...model.rotation);
      groupRef.current.scale.set(...model.scale);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={model.gltf?.scene || model.model}
        visible={model.visible}
        wireframe={model.wireframe}
        ref={primitiveRef}
      />
    </group>
  );
};
