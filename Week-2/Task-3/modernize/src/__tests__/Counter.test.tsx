import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../components/Counter';

describe('Counter Component', () => {
  const defaultProps = {
    initialValue: 0,
    minValue: -100,
    maxValue: 100,
    step: 1,
  };

  it('renders with initial value', () => {
    render(<Counter {...defaultProps} />);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  it('increments counter when increment button is clicked', async () => {
    render(<Counter {...defaultProps} />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    await userEvent.click(incrementButton);
    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
  });

  it('decrements counter when decrement button is clicked', async () => {
    render(<Counter {...defaultProps} />);
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    await userEvent.click(decrementButton);
    expect(screen.getByText('Counter: -1')).toBeInTheDocument();
  });

  it('resets counter when reset button is clicked', async () => {
    render(<Counter {...defaultProps} />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });
    
    await userEvent.click(incrementButton);
    await userEvent.click(resetButton);
    
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  it('disables increment button when max value is reached', async () => {
    render(<Counter {...defaultProps} initialValue={100} />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    expect(incrementButton).toBeDisabled();
  });

  it('disables decrement button when min value is reached', async () => {
    render(<Counter {...defaultProps} initialValue={-100} />);
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    expect(decrementButton).toBeDisabled();
  });

  it('calls onChange callback when counter value changes', async () => {
    const onChange = jest.fn();
    render(<Counter {...defaultProps} onChange={onChange} />);
    
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    await userEvent.click(incrementButton);
    
    expect(onChange).toHaveBeenCalledWith(1);
  });
}); 