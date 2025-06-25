import React from 'react';
import { CounterProps } from '../types/counter';
import { useCounter } from '../hooks/useCounter';

/**
 * Counter component with validation and error handling
 * @param props - Counter configuration props
 */
export const Counter: React.FC<CounterProps> = (props) => {
  const { count, error, increment, decrement, reset } = useCounter(props);

  return (
    <div className="counter" role="region" aria-label="Counter">
      <h2>Counter: {count}</h2>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <div className="counter-controls">
        <button
          onClick={decrement}
          aria-label="Decrement counter"
          disabled={count <= props.minValue}
        >
          Decrement
        </button>
        <button
          onClick={increment}
          aria-label="Increment counter"
          disabled={count >= props.maxValue}
        >
          Increment
        </button>
        <button
          onClick={reset}
          aria-label="Reset counter"
          disabled={count === props.initialValue}
        >
          Reset
        </button>
      </div>
    </div>
  );
}; 