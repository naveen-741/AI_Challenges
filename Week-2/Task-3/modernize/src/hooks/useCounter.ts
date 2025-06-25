import { useState, useCallback } from 'react';
import { CounterProps, CounterState } from '../types/counter';

/**
 * Custom hook for managing counter state and operations
 * @param props - Counter configuration props
 * @returns Counter state and operations
 */
export const useCounter = (props: CounterProps) => {
  const [state, setState] = useState<CounterState>({
    count: props.initialValue,
    error: null,
  });

  const validateCount = useCallback((newCount: number): boolean => {
    if (newCount < props.minValue) {
      setState(prev => ({
        ...prev,
        error: `Count cannot be less than ${props.minValue}`,
      }));
      return false;
    }
    if (newCount > props.maxValue) {
      setState(prev => ({
        ...prev,
        error: `Count cannot be greater than ${props.maxValue}`,
      }));
      return false;
    }
    return true;
  }, [props.minValue, props.maxValue]);

  const increment = useCallback(() => {
    const newCount = state.count + props.step;
    if (validateCount(newCount)) {
      setState(prev => ({
        count: newCount,
        error: null,
      }));
      props.onChange?.(newCount);
    }
  }, [state.count, props.step, validateCount, props.onChange]);

  const decrement = useCallback(() => {
    const newCount = state.count - props.step;
    if (validateCount(newCount)) {
      setState(prev => ({
        count: newCount,
        error: null,
      }));
      props.onChange?.(newCount);
    }
  }, [state.count, props.step, validateCount, props.onChange]);

  const reset = useCallback(() => {
    setState({
      count: props.initialValue,
      error: null,
    });
    props.onChange?.(props.initialValue);
  }, [props.initialValue, props.onChange]);

  return {
    count: state.count,
    error: state.error,
    increment,
    decrement,
    reset,
  };
}; 