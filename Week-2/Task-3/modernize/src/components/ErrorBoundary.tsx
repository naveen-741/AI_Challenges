import React, { useState, useEffect } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Error caught by boundary:", event.error);
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="error-boundary" role="alert">
        <h2>Something went wrong</h2>
        <p>{error?.message || "An unexpected error occurred"}</p>
        <button
          onClick={() => {
            setHasError(false);
            setError(null);
          }}
          className="error-boundary-button"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
