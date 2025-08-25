/**
 * Auto-Completion Engine Examples
 *
 * This file demonstrates how to use the auto-completion engine
 * for the query language system.
 */

import type { CompletionConfig } from '../types';
import { CompletionEngine } from '../completion/CompletionEngine';

// Example 1: Basic Setup
console.log('=== Auto-Completion Engine Examples ===\n');

// Define a sample configuration for a project management system
const projectConfig: CompletionConfig = {
  keys: [
    {
      name: 'status',
      description: 'Project status',
      values: [
        { value: 'active', description: 'Currently active projects' },
        { value: 'completed', description: 'Completed projects' },
        { value: 'on-hold', description: 'Projects on hold' },
        { value: 'cancelled', description: 'Cancelled projects' },
      ],
    },
    {
      name: 'priority',
      description: 'Project priority level',
      values: [
        { value: 'high', description: 'High priority projects' },
        { value: 'medium', description: 'Medium priority projects' },
        { value: 'low', description: 'Low priority projects' },
      ],
    },
    {
      name: 'assignee',
      description: 'Project assignee',
      values: [
        { value: 'john.doe', description: 'John Doe' },
        { value: 'jane.smith', description: 'Jane Smith' },
        { value: 'bob.wilson', description: 'Bob Wilson' },
      ],
    },
    {
      name: 'type',
      description: 'Project type',
      values: [
        { value: 'feature', description: 'Feature development' },
        { value: 'bugfix', description: 'Bug fix' },
        { value: 'maintenance', description: 'Maintenance work' },
        { value: 'research', description: 'Research project' },
      ],
    },
  ],
  caseSensitive: false,
  fuzzyMatch: true,
  maxSuggestions: 10,
};

// Create completion engine instance
const completionEngine = new CompletionEngine(projectConfig);

console.log('1. Basic Key Completions:');
console.log('   Input: "" (empty)');
const emptyCompletions = completionEngine.getKeySuggestions('');
emptyCompletions.forEach((completion) => {
  console.log(`   → ${completion.text} (${completion.description})`);
});

console.log('\n2. Filtered Key Completions:');
console.log('   Input: "st" (partial)');
const filteredKeys = completionEngine.getKeySuggestions('st');
filteredKeys.forEach((completion) => {
  console.log(`   → ${completion.text} (${completion.description})`);
});

console.log('\n3. Value Completions for Specific Key:');
console.log('   Input: status values');
const statusValues = completionEngine.getValueSuggestions('status');
statusValues.forEach((completion) => {
  console.log(`   → ${completion.text} (${completion.description})`);
});

console.log('\n4. Filtered Value Completions:');
console.log('   Input: priority values starting with "h"');
const priorityValues = completionEngine.getValueSuggestions('priority', 'h');
priorityValues.forEach((completion) => {
  console.log(`   → ${completion.text} (${completion.description})`);
});

console.log('\n5. Operator Completions:');
console.log('   Input: "" (all operators)');
const operators = completionEngine.getOperatorSuggestions('');
operators.forEach((completion) => {
  console.log(`   → "${completion.insertText}" (${completion.description})`);
});

console.log('\n6. Context-Aware Completions:');
const queries = [
  { query: '', position: 0, description: 'Empty query - expect keys' },
  { query: 'status: ', position: 8, description: 'After colon - expect values' },
  { query: 'status: active ', position: 15, description: 'After value - expect operators' },
  { query: 'status: active AND ', position: 19, description: 'After operator - expect keys' },
];

queries.forEach(({ query, position, description }) => {
  console.log(`\n   Scenario: ${description}`);
  console.log(`   Query: "${query}" (cursor at position ${position})`);

  const completions = completionEngine.getCompletions(query, position);
  const limited = completions.slice(0, 3); // Show first 3 suggestions

  limited.forEach((completion) => {
    console.log(`   → ${completion.type}: ${completion.text} (priority: ${completion.priority})`);
  });

  if (completions.length > 3) {
    console.log(`   ... and ${completions.length - 3} more suggestions`);
  }
});

console.log('\n7. Fuzzy Matching Example:');
console.log('   Input: "asgn" (should match "assignee")');
const fuzzyResults = completionEngine.getKeySuggestions('asgn');
fuzzyResults.forEach((completion) => {
  console.log(`   → ${completion.text} (priority: ${completion.priority})`);
});

console.log('\n8. Context Analysis:');
const complexQuery = 'status: active AND (priority: high OR type: ';
const contextInfo = completionEngine.getContext(complexQuery, complexQuery.length);
console.log(`   Query: "${complexQuery}"`);
console.log(`   Cursor Position: ${contextInfo.cursorPosition}`);
console.log(`   Expected Types: ${contextInfo.expectedTypes.join(', ')}`);
console.log(`   Can Insert Operator: ${contextInfo.canInsertOperator}`);
console.log(`   Can Insert Grouping: ${contextInfo.canInsertGrouping}`);
console.log(`   Is In Quotes: ${contextInfo.isInQuotes}`);
console.log(`   Incomplete Value: "${contextInfo.incompleteValue}"`);
console.log(`   Syntax Errors: ${contextInfo.syntaxErrors.length > 0 ? contextInfo.syntaxErrors.join(', ') : 'None'}`);

console.log('\n9. Completion Statistics:');
const stats = completionEngine.getCompletionStats(complexQuery, complexQuery.length);
console.log(`   Context Types: ${stats.contextType.join(', ')}`);
console.log(`   Available Suggestions: ${stats.suggestionCount}`);
console.log(`   Has Syntax Errors: ${stats.hasErrors}`);

console.log('\n10. Configuration Updates:');
console.log('    Original max suggestions:', completionEngine.getConfig().maxSuggestions);
completionEngine.updateConfig({ maxSuggestions: 3, caseSensitive: true });
console.log('    Updated max suggestions:', completionEngine.getConfig().maxSuggestions);
console.log('    Updated case sensitivity:', completionEngine.getConfig().caseSensitive);

const limitedCompletions = completionEngine.getKeySuggestions('');
console.log(`    Now showing only ${limitedCompletions.length} suggestions:`);
limitedCompletions.forEach((completion) => {
  console.log(`    → ${completion.text}`);
});

console.log('\n=== Examples Complete ===');

// Export for external use
export { completionEngine, projectConfig };
