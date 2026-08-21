/**
 * AI Service Factory — WasteWise AI
 *
 * Resolves which AI provider to use based on environment configuration.
 * Default: MockAIProvider (works without any IBM Cloud credentials)
 * Optional: GraniteAIProvider (requires backend with valid IBM credentials)
 *
 * Frontend code should only import `aiService` from this module.
 */

import type { AIProvider } from './aiProvider';
import { MockAIProvider } from './mockAIProvider';
import { GraniteAIProvider } from './graniteProvider';

// Check if IBM Granite backend is configured
// VITE_AI_PROVIDER is safe to expose — it's just a mode flag, not a secret
const useGranite = import.meta.env.VITE_AI_PROVIDER === 'granite';

let _provider: AIProvider | null = null;

export const getAIProvider = (): AIProvider => {
  if (!_provider) {
    if (useGranite) {
      _provider = new GraniteAIProvider();
    } else {
      _provider = new MockAIProvider();
    }
  }
  return _provider;
};

// Convenience singleton
export const aiService = getAIProvider();

// Re-export types
export type { AIProvider };
export { MockAIProvider, GraniteAIProvider };
