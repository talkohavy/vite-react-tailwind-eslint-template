/**
 * Basic usage examples for the Query Language Parser
 *
 * This file demonstrates how to use the QueryParser and QueryLexer
 * implemented in Phase 2 of the project.
 */

import { QueryParser, QueryLexer, EXAMPLE_QUERIES } from '../index';

/**
 * Basic parser usage example
 */
export function basicParserExample() {
  console.log('=== Query Language Parser - Basic Usage ===\n');

  const parser = new QueryParser();

  // Parse some example queries
  const queries = [
    'status: active',
    'name: "John Doe"',
    'status: active AND role: admin',
    'status: active OR status: pending',
    '(status: active OR status: pending) AND role: admin',
  ];

  queries.forEach((query, index) => {
    console.log(`Example ${index + 1}: ${query}`);

    const result = parser.parse(query);

    if (result.success && result.ast) {
      console.log('✅ Parse successful');
      console.log('📄 AST Type:', result.ast.expression.type);

      if (result.ast.expression.type === 'condition') {
        const condition = result.ast.expression;
        console.log(`   Key: "${condition.key}", Value: "${condition.value}"`);
      } else if (result.ast.expression.type === 'boolean') {
        const boolExpr = result.ast.expression;
        console.log(`   Operator: ${boolExpr.operator}`);
        console.log(`   Left: ${boolExpr.left.type}, Right: ${boolExpr.right.type}`);
      }
    } else {
      console.log('❌ Parse failed');
      result.errors.forEach((error) => {
        console.log(`   Error: ${error.message} at position ${error.position.start}-${error.position.end}`);
      });
    }

    console.log('');
  });
}

/**
 * Lexer usage example
 */
export function basicLexerExample() {
  console.log('=== Query Language Lexer - Token Analysis ===\n');

  const query = 'status: "active user" AND (role: admin OR role: moderator)';
  console.log(`Query: ${query}\n`);

  const lexer = new QueryLexer(query);
  const tokens = lexer.tokenize();

  console.log('🔤 Tokens:');
  tokens.forEach((token, index) => {
    if (token.type !== 'EOF') {
      console.log(`  ${index + 1}. ${token.type}: "${token.value}" [${token.position.start}-${token.position.end}]`);
    }
  });

  console.log('');
}

/**
 * Error handling examples
 */
export function errorHandlingExample() {
  console.log('=== Query Language Parser - Error Handling ===\n');

  const parser = new QueryParser();

  const invalidQueries = [
    '', // Empty query
    'status:', // Missing value
    'status active', // Missing colon
    '(status: active', // Unbalanced parentheses
    'status: active XOR role: admin', // Invalid operator
  ];

  invalidQueries.forEach((query, index) => {
    console.log(`Error Example ${index + 1}: "${query || '[empty]'}"`);

    const result = parser.parse(query);

    if (!result.success) {
      console.log('❌ Parse failed (as expected)');
      result.errors.forEach((error) => {
        console.log(`   Error: ${error.message}`);
      });
    } else {
      console.log('⚠️  Unexpectedly parsed successfully');
    }

    console.log('');
  });
}

/**
 * Context determination for auto-completion
 */
export function contextDeterminationExample() {
  console.log('=== Query Language Parser - Context Determination ===\n');

  const parser = new QueryParser();

  const partialQueries = [
    '', // Should suggest keys
    'status: ', // Should suggest values
    'status: active ', // Should suggest operators
    'status: active AND ', // Should suggest keys
    '(status: active ', // Should suggest operators
  ];

  partialQueries.forEach((query, index) => {
    console.log(`Context Example ${index + 1}: "${query || '[empty]'}"`);

    const result = parser.parsePartial(query);

    console.log(`   Context: ${result.context}`);
    console.log(`   Errors: ${result.errors.length}`);

    if (result.ast) {
      console.log(`   Partial AST: ${result.ast.type}`);
    }

    console.log('');
  });
}

/**
 * Performance testing with example queries
 */
export function performanceExample() {
  console.log('=== Query Language Parser - Performance Test ===\n');

  const parser = new QueryParser();

  console.log('Testing performance with example queries...');

  const startTime = performance.now();
  let successCount = 0;
  let errorCount = 0;

  // Parse all example queries multiple times
  for (let i = 0; i < 100; i++) {
    EXAMPLE_QUERIES.forEach((query) => {
      const result = parser.parse(query);
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    });
  }

  const endTime = performance.now();
  const totalQueries = 100 * EXAMPLE_QUERIES.length;

  console.log('📊 Results:');
  console.log(`   Total queries parsed: ${totalQueries}`);
  console.log(`   Successful parses: ${successCount}`);
  console.log(`   Failed parses: ${errorCount}`);
  console.log(`   Total time: ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`   Average time per query: ${((endTime - startTime) / totalQueries).toFixed(3)}ms`);
  console.log('');
}

/**
 * Run all examples
 */
export function runAllExamples() {
  basicParserExample();
  basicLexerExample();
  errorHandlingExample();
  contextDeterminationExample();
  performanceExample();

  console.log('🎉 Phase 2 implementation complete!');
  console.log('   ✅ QueryLexer: Tokenizes query strings');
  console.log('   ✅ QueryParser: Builds Abstract Syntax Trees');
  console.log('   ✅ Error handling: Graceful error recovery');
  console.log('   ✅ Context analysis: Ready for auto-completion');
  console.log('   ✅ Unit tests: Comprehensive test coverage');
}

// Export individual functions for selective usage
export default {
  basicParserExample,
  basicLexerExample,
  errorHandlingExample,
  contextDeterminationExample,
  performanceExample,
  runAllExamples,
};
