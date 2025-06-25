import React from "react";
import { Counter } from "./components/Counter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";

/**
 * Main application component
 */
const App: React.FC = () => {
  const handleCounterChange = (newCount: number) => {
    console.log("Counter changed:", newCount);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>React Modern Template</h1>
          <Counter
            initialValue={0}
            minValue={-100}
            maxValue={100}
            step={1}
            onChange={handleCounterChange}
          />
        </header>
      </div>
    </ErrorBoundary>
  );
};

export default App;
