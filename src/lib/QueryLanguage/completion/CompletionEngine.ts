/**
 * Completion Engine for Query Language Auto-Completion
 *
 * This is the main entry point for the auto-completion system. It coordinates
 * the context analysis and suggestion ranking to provide intelligent
 * auto-completion suggestions based on the current query state.
 */

import type { CompletionItem, CompletionConfig, CompletionContext, CompletionItemType } from '../types';
import { ContextAnalyzer } from './ContextAnalyzer';
import { SuggestionRanker } from './SuggestionRanker';

/**
 * Main auto-completion engine
 */
export class CompletionEngine {
  private contextAnalyzer: ContextAnalyzer;
  private suggestionRanker: SuggestionRanker;
  private config: CompletionConfig;

  constructor(config: Partial<CompletionConfig> = {}) {
    this.config = {
      keys: [],
      caseSensitive: false,
      fuzzyMatch: true,
      maxSuggestions: 20,
      ...config,
    };
    this.contextAnalyzer = new ContextAnalyzer();
    this.suggestionRanker = new SuggestionRanker(this.config);
  }

  /**
   * Gets completion suggestions for a query at the specified cursor position
   */
  public getCompletions(query: string, cursorPosition: number): CompletionItem[] {
    // Analyze the current context
    const context = this.contextAnalyzer.analyzeContext(query, cursorPosition);

    // Generate suggestions for each expected type
    const allSuggestions: CompletionItem[] = [];

    context.expectedTypes.forEach((type) => {
      const suggestions = this.generateSuggestionsForType(type, context.incompleteValue, context);
      allSuggestions.push(...suggestions);
    });

    // Remove duplicates and sort by priority
    const uniqueSuggestions = this.removeDuplicates(allSuggestions);
    return this.sortByPriority(uniqueSuggestions);
  }

  /**
   * Gets detailed context information for debugging/analysis
   */
  public getContext(query: string, cursorPosition: number): CompletionContext {
    return this.contextAnalyzer.analyzeContext(query, cursorPosition);
  }

  /**
   * Updates the completion configuration
   */
  public updateConfig(config: Partial<CompletionConfig>): void {
    this.config = { ...this.config, ...config };
    this.suggestionRanker.updateConfig(this.config);
  }

  /**
   * Gets the current configuration
   */
  public getConfig(): CompletionConfig {
    return { ...this.config };
  }

  /**
   * Generates suggestions for a specific completion type
   */
  private generateSuggestionsForType(
    type: CompletionItemType,
    input: string,
    context: CompletionContext,
  ): CompletionItem[] {
    const contextInfo = this.extractContextInfo(context);
    return this.suggestionRanker.generateSuggestions(type, input, contextInfo);
  }

  /**
   * Extracts relevant context information for suggestion generation
   */
  private extractContextInfo(context: CompletionContext): { key?: string } {
    // Try to find the current key for value completions
    let currentKey: string | undefined;

    if (context.previousToken?.type === 'COLON') {
      // Look for the identifier before the colon
      currentKey = this.findKeyBeforeColon(context);
    }

    return { key: currentKey };
  }

  /**
   * Finds the key identifier before a colon token
   */
  private findKeyBeforeColon(context: CompletionContext): string | undefined {
    // This is a simplified implementation - in a more complex scenario,
    // we might need to parse backwards through the token stream
    if (context.previousToken?.type === 'COLON') {
      // Look for identifier token positions - this would need actual token stream analysis
      // For now, we'll implement a basic string-based approach
      return this.extractKeyFromQuery(context);
    }
    return undefined;
  }

  /**
   * Extracts the key from the query string using simple parsing
   */
  private extractKeyFromQuery(_context: CompletionContext): string | undefined {
    // Simple approach: look backwards from cursor for "key:" pattern

    // This is a simplified implementation - a full implementation would
    // properly parse the token stream to find the associated key
    // For now, we'll return undefined and rely on configuration
    return undefined;
  }

  /**
   * Removes duplicate suggestions based on text content
   */
  private removeDuplicates(suggestions: CompletionItem[]): CompletionItem[] {
    const seen = new Set<string>();
    return suggestions.filter((suggestion) => {
      const key = `${suggestion.type}:${suggestion.text}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Sorts suggestions by priority (descending)
   */
  private sortByPriority(suggestions: CompletionItem[]): CompletionItem[] {
    return suggestions.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Gets suggestions for a specific key's values
   */
  public getValueSuggestions(key: string, input = ''): CompletionItem[] {
    return this.suggestionRanker.generateSuggestions('value', input, { key });
  }

  /**
   * Gets all available keys as suggestions
   */
  public getKeySuggestions(input = ''): CompletionItem[] {
    return this.suggestionRanker.generateSuggestions('key', input);
  }

  /**
   * Gets operator suggestions
   */
  public getOperatorSuggestions(input = ''): CompletionItem[] {
    return this.suggestionRanker.generateSuggestions('operator', input);
  }

  /**
   * Checks if completions are available for the current position
   */
  public hasCompletions(query: string, cursorPosition: number): boolean {
    const completions = this.getCompletions(query, cursorPosition);
    return completions.length > 0;
  }

  /**
   * Gets completion statistics for debugging
   */
  public getCompletionStats(
    query: string,
    cursorPosition: number,
  ): {
    contextType: CompletionItemType[];
    suggestionCount: number;
    hasErrors: boolean;
  } {
    const context = this.getContext(query, cursorPosition);
    const completions = this.getCompletions(query, cursorPosition);

    return {
      contextType: context.expectedTypes,
      suggestionCount: completions.length,
      hasErrors: context.syntaxErrors.length > 0,
    };
  }
}
