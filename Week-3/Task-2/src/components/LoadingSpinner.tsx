import React from "react";
import { Html } from "@react-three/drei";

export const LoadingSpinner = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Html>
  );
};
