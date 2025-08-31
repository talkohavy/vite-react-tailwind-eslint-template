/**
 * Auto-Completion Module for Query Language
 *
 * This module provides the auto-completion functionality for the query language,
 * including context analysis, suggestion ranking, and the main completion engine.
 */

// Main completion engine
export { CompletionEngine } from './CompletionEngine';

// Utility classes
export { ContextAnalyzer } from './ContextAnalyzer';
export { SuggestionRanker } from './SuggestionRanker';

// Re-export types for convenience
export type { CompletionItem, CompletionConfig, CompletionContext, KeyConfig, ValueConfig } from '../types';
