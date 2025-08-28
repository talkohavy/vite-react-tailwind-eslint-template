/**
 * Suggestion Ranker for Auto-Completion
 *
 * This module ranks and filters completion suggestions based on the current
 * context, user input, and configuration. It supports fuzzy matching and
 * priority-based ranking.
 */

import type { CompletionItem, CompletionConfig } from '../types';
import { ContextTypes, type ContextTypeValues } from './logic/constants';

/**
 * Ranks and filters completion suggestions
 */
export class SuggestionRanker {
  private config: CompletionConfig;

  constructor(config: CompletionConfig) {
    this.config = config;
  }

  /**
   * Generates completion suggestions for a given type and input
   */
  public generateSuggestions(type: ContextTypeValues, input: string, context?: { key?: string }): CompletionItem[] {
    let suggestions: CompletionItem[] = [];

    switch (type) {
      case ContextTypes.Key:
        suggestions = this.generateKeySuggestions(input);
        break;
      case ContextTypes.Value:
        suggestions = this.generateValueSuggestions(input, context?.key);
        break;
      case ContextTypes.Operator:
        suggestions = this.generateOperatorSuggestions(input);
        break;
      case ContextTypes.Grouping:
        suggestions = this.generateGroupingSuggestions(input);
        break;
    }

    const rankedFilteredSuggestions = this.rankAndFilter(suggestions, input);

    return rankedFilteredSuggestions;
  }

  /**
   * Generates key completion suggestions
   */
  private generateKeySuggestions(input: string): CompletionItem[] {
    return this.config.keys.map((keyConfig) => ({
      text: keyConfig.name,
      type: ContextTypes.Key,
      description: keyConfig.description,
      insertText: keyConfig.name,
      priority: this.calculatePriority(keyConfig.name, input),
    }));
  }

  /**
   * Generates value completion suggestions for a specific key
   */
  private generateValueSuggestions(input: string, key?: string): CompletionItem[] {
    if (!key) return [];

    const keyConfig = this.config.keys.find((k) => k.name === key);
    if (!keyConfig?.values) return [];

    const valueSuggestions = keyConfig.values.map((valueConfig) => ({
      text: valueConfig.value,
      type: ContextTypes.Value,
      description: valueConfig.description,
      insertText: this.shouldQuoteValue(valueConfig.value) ? `"${valueConfig.value}"` : valueConfig.value,
      priority: this.calculatePriority(valueConfig.value, input),
    }));

    return valueSuggestions;
  }

  /**
   * Generates operator completion suggestions
   */
  private generateOperatorSuggestions(input: string): CompletionItem[] {
    const operators = [
      { text: 'AND', description: 'Boolean AND operator' },
      { text: 'OR', description: 'Boolean OR operator' },
    ];

    return operators.map((op) => ({
      text: op.text,
      type: ContextTypes.Operator,
      description: op.description,
      insertText: ` ${op.text} `,
      priority: this.calculatePriority(op.text, input),
    }));
  }

  /**
   * Generates grouping completion suggestions
   */
  private generateGroupingSuggestions(input: string): CompletionItem[] {
    const groupings = [
      { text: '(', description: 'Start grouped expression' },
      { text: ')', description: 'End grouped expression' },
    ];

    return groupings.map((grouping) => ({
      text: grouping.text,
      type: ContextTypes.Grouping,
      description: grouping.description,
      insertText: grouping.text,
      priority: this.calculatePriority(grouping.text, input),
    }));
  }

  /**
   * Ranks and filters suggestions based on input and configuration
   */
  private rankAndFilter(suggestions: CompletionItem[], input: string): CompletionItem[] {
    const trimmedInput = input.trim();

    // Filter suggestions based on input
    let filtered = suggestions.filter((suggestion) => {
      if (!trimmedInput) return true;

      if (this.config.fuzzyMatch) {
        return this.fuzzyMatch(suggestion.text, trimmedInput);
      }

      const text = this.config.caseSensitive ? suggestion.text : suggestion.text.toLowerCase();
      const searchInput = this.config.caseSensitive ? trimmedInput : trimmedInput.toLowerCase();
      return text.startsWith(searchInput) || text.includes(searchInput);
    });

    // Sort by priority (higher priority first)
    filtered.sort((a, b) => b.priority - a.priority);

    // Limit results
    if (this.config.maxSuggestions > 0) {
      filtered = filtered.slice(0, this.config.maxSuggestions);
    }

    return filtered;
  }

  /**
   * Calculates priority score for a suggestion
   */
  private calculatePriority(suggestion: string, input: string): number {
    const trimmedInput = input.trim();
    if (!trimmedInput) return 50; // Default priority

    const suggestionLower = suggestion.toLowerCase();
    const inputLower = trimmedInput.toLowerCase();

    // Exact match gets highest priority
    if (suggestionLower === inputLower) return 100;

    // Starts with input gets high priority
    if (suggestionLower.startsWith(inputLower)) return 80;

    // Contains input gets medium priority
    if (suggestionLower.includes(inputLower)) return 60;

    // Fuzzy match gets lower priority
    if (this.config.fuzzyMatch && this.fuzzyMatch(suggestion, trimmedInput)) {
      return 40;
    }

    return 0;
  }

  /**
   * Performs fuzzy matching between suggestion and input
   */
  private fuzzyMatch(suggestion: string, input: string): boolean {
    const suggestionText = this.config.caseSensitive ? suggestion : suggestion.toLowerCase();
    const inputText = this.config.caseSensitive ? input : input.toLowerCase();

    let suggestionIndex = 0;
    let inputIndex = 0;

    while (suggestionIndex < suggestionText.length && inputIndex < inputText.length) {
      if (suggestionText[suggestionIndex] === inputText[inputIndex]) {
        inputIndex++;
      }
      suggestionIndex++;
    }

    return inputIndex === inputText.length;
  }

  /**
   * Determines if a value should be quoted
   */
  private shouldQuoteValue(value: string): boolean {
    // Quote if contains spaces or special characters
    return /[\s():"']/.test(value);
  }

  /**
   * Updates the configuration
   */
  public updateConfig(config: Partial<CompletionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets the current configuration
   */
  public getConfig(): CompletionConfig {
    return { ...this.config };
  }
}
