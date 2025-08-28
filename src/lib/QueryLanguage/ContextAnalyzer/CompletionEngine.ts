/**
 * Completion Engine for Query Language Auto-Completion
 *
 * This is the main entry point for the auto-completion system. It coordinates
 * the context analysis and suggestion ranking to provide intelligent
 * auto-completion suggestions based on the current query state.
 */

import type { CompletionItem, CompletionConfig, CompletionContext } from '../types';
import type { ContextTypeValues } from './logic/constants';
import { TokenTypes } from '../QueryLexer/logic/constants';
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
      const suggestions = this.generateSuggestionsForType(type, context.incompleteValue, context, query);
      allSuggestions.push(...suggestions);
    });

    // Remove duplicates and sort by priority
    const uniqueSuggestions = this.removeDuplicates(allSuggestions);
    const uniqueSortedSuggestions = this.sortByPriority(uniqueSuggestions);
    return uniqueSortedSuggestions;
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
    type: ContextTypeValues,
    input: string,
    context: CompletionContext,
    query: string,
  ): CompletionItem[] {
    const contextInfo = this.extractContextInfo(context, query);
    const generatedSuggestions = this.suggestionRanker.generateSuggestions(type, input, contextInfo);

    return generatedSuggestions;
  }

  /**
   * Extracts relevant context information for suggestion generation
   */
  private extractContextInfo(context: CompletionContext, query: string): { key?: string } {
    // Try to find the current key for value completions
    let currentKey: string | undefined;

    if ([context.previousToken?.type, context.currentToken?.type].includes(TokenTypes.Colon)) {
      // Look for the identifier before the colon/value
      currentKey = this.extractKeyFromQuery(context, query);
    }

    return { key: currentKey };
  }

  /**
   * Extracts the key from the query string using simple parsing
   */
  private extractKeyFromQuery(context: CompletionContext, query: string): string | undefined {
    // Look backwards from cursor position to find the key before the colon
    const cursorPosition = context.cursorPosition;

    // Find the colon position - look backwards from cursor
    let colonPosition = -1;

    for (let i = cursorPosition - 1; i >= 0; i--) {
      if (query[i] === ':') {
        colonPosition = i;
        break;
      }
    }

    if (colonPosition === -1) {
      return undefined;
    }

    // Look backwards from the colon to find the key
    let keyStart = colonPosition - 1;
    let keyEnd = colonPosition;

    // Skip whitespace before the colon
    while (keyStart >= 0 && query[keyStart] && /\s/.test(query[keyStart]!)) {
      keyStart--;
    }

    if (keyStart < 0) {
      return undefined;
    }

    keyEnd = keyStart + 1;

    // Find the start of the key (alphanumeric and underscore)
    while (keyStart >= 0 && query[keyStart] && /[a-zA-Z0-9_]/.test(query[keyStart]!)) {
      keyStart--;
    }

    keyStart++; // Move to the first character of the key

    if (keyStart >= keyEnd) {
      return undefined;
    }

    const key = query.substring(keyStart, keyEnd).trim();
    return key.length > 0 ? key : undefined;
  }

  /**
   * Removes duplicate suggestions based on text content
   */
  private removeDuplicates(suggestions: CompletionItem[]): CompletionItem[] {
    const seen = new Set<string>();

    return suggestions.filter((suggestion) => {
      const key = `${suggestion.type}:${suggestion.text}`;
      if (seen.has(key)) return false;

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
    contextType: ContextTypeValues[];
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
