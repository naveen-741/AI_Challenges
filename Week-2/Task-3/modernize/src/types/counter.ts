import { z } from 'zod';

/**
 * Schema for validating counter props
 */
export const CounterPropsSchema = z.object({
  initialValue: z.number().default(0),
  minValue: z.number().default(-100),
  maxValue: z.number().default(100),
  step: z.number().positive().default(1),
  onChange: z.function()
    .args(z.number())
    .returns(z.void())
    .optional(),
});

/**
 * Type for counter props derived from the schema
 */
export type CounterProps = z.infer<typeof CounterPropsSchema>;

/**
 * Type for counter state
 */
export interface CounterState {
  count: number;
  error: string | null;
} 