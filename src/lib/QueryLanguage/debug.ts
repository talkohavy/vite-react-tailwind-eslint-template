/**
 * Debug script for completion engine
 */

import { CompletionEngine } from './completion/CompletionEngine';

const engine = new CompletionEngine({
  keys: [
    {
      name: 'status',
      values: [{ value: 'active' }, { value: 'inactive' }],
    },
  ],
  caseSensitive: false,
  fuzzyMatch: true,
  maxSuggestions: 10,
});

console.log('=== Debug Completion Engine ===');

// Test case 1: Cursor at beginning
const query1 = 'status: active';
const pos1 = 0;
console.log(`\nTest 1: Query "${query1}", cursor at ${pos1}`);
const context1 = engine.getContext(query1, pos1);
console.log('Context:', context1);
const completions1 = engine.getCompletions(query1, pos1);
console.log('Completions:', completions1.length);

// Test case 2: Cursor at end
const query2 = 'status: active';
const pos2 = query2.length;
console.log(`\nTest 2: Query "${query2}", cursor at ${pos2}`);
const context2 = engine.getContext(query2, pos2);
console.log('Context:', context2);
const completions2 = engine.getCompletions(query2, pos2);
console.log('Completions:', completions2.length);

// Test case 3: Empty query
const query3 = '';
const pos3 = 0;
console.log(`\nTest 3: Query "${query3}", cursor at ${pos3}`);
const context3 = engine.getContext(query3, pos3);
console.log('Context:', context3);
const completions3 = engine.getCompletions(query3, pos3);
console.log('Completions:', completions3.length);
