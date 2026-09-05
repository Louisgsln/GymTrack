import { create } from 'zustand';
import { z } from 'zod';
export const preferencesSchema = z.object({
  locale: z.enum(['fr', 'en']),
  theme: z.enum(['light', 'dark', 'system']),
  weightUnit: z.enum(['kg', 'lb']),
  effort: z.enum(['RPE', 'RIR', 'OFF']),
});
export type Preferences = z.infer<typeof preferencesSchema>;
export const usePreferences = create<Preferences>(() => ({
  locale: 'fr',
  theme: 'system',
  weightUnit: 'kg',
  effort: 'RPE',
}));
