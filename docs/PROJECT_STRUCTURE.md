# Query Language Project Structure

## Directory Organization

```
src/lib/QueryLanguage/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript type definitions
├── constants.ts                # Constants, patterns, and config
│
├── lexer/                      # Lexical analysis (Phase 2)
│   ├── QueryLexer.ts          # Main lexer implementation
│   ├── TokenStream.ts         # Token stream management
│   ├── lexer.test.ts          # Lexer unit tests
│   └── index.ts               # Lexer exports
│
├── parser/                     # Parsing logic (Phase 2)
│   ├── QueryParser.ts         # Main parser implementation
│   ├── ASTBuilder.ts          # AST construction utilities
│   ├── ErrorRecovery.ts       # Error recovery strategies
│   ├── parser.test.ts         # Parser unit tests
│   └── index.ts               # Parser exports
│
├── completion/                 # Auto-completion engine (Phase 3)
│   ├── CompletionEngine.ts    # Main completion logic
│   ├── ContextAnalyzer.ts     # Context analysis for suggestions
│   ├── SuggestionRanker.ts    # Ranking and filtering suggestions
│   ├── completion.test.ts     # Completion unit tests
│   └── index.ts               # Completion exports
│
├── validation/                 # Query validation (Phase 3)
│   ├── QueryValidator.ts      # Main validation logic
│   ├── SemanticAnalyzer.ts    # Semantic validation
│   ├── SchemaValidator.ts     # Schema-based validation
│   ├── validation.test.ts     # Validation unit tests
│   └── index.ts               # Validation exports
│
├── utils/                      # Utility functions
│   ├── astUtils.ts            # AST manipulation utilities
│   ├── stringUtils.ts         # String processing utilities
│   ├── positionUtils.ts       # Position tracking utilities
│   ├── errorUtils.ts          # Error handling utilities
│   ├── utils.test.ts          # Utility tests
│   └── index.ts               # Utility exports
│
└── examples/                   # Example implementations
    ├── basicUsage.ts          # Simple usage examples
    ├── advancedUsage.ts       # Complex usage examples
    └── integrationDemo.ts     # Integration examples
```

## Component Responsibilities

### Core Components (Phase 2)

#### QueryLexer

- Tokenize input strings into meaningful tokens
- Handle quoted strings, operators, identifiers
- Track token positions for error reporting
- Support configurable case sensitivity

#### QueryParser

- Parse token streams into Abstract Syntax Trees (AST)
- Implement recursive descent parsing
- Handle operator precedence correctly
- Provide error recovery mechanisms
- Generate meaningful error messages

#### ASTBuilder

- Construct well-formed AST nodes
- Validate node relationships
- Optimize AST structure
- Support AST transformations

### Auto-Completion Components (Phase 3)

#### CompletionEngine

- Main interface for auto-completion functionality
- Coordinate between context analysis and suggestion generation
- Filter and rank completion suggestions
- Support fuzzy matching and smart filtering

#### ContextAnalyzer

- Analyze current cursor position and query state
- Determine appropriate completion context
- Extract relevant context information
- Handle partial tokens and incomplete expressions

#### SuggestionRanker

- Rank completion suggestions by relevance
- Apply user preferences and configuration
- Support different ranking strategies
- Handle suggestion filtering and deduplication

### Validation Components (Phase 3)

#### QueryValidator

- Validate parsed queries against schema
- Check semantic correctness
- Provide validation warnings and errors
- Support different validation levels

#### SemanticAnalyzer

- Analyze query semantics beyond syntax
- Check key-value relationships
- Validate operator usage
- Detect logical inconsistencies

#### SchemaValidator

- Validate queries against data schema
- Check field existence and types
- Validate value constraints
- Provide schema-aware error messages

### Utility Components

#### AST Utilities

- AST traversal and manipulation functions
- AST serialization and deserialization
- AST transformation utilities
- AST comparison and diffing

#### String Utilities

- Text processing and manipulation
- Escape/unescape functions
- Pattern matching utilities
- String normalization

#### Position Utilities

- Position tracking and calculation
- Line/column conversion
- Range manipulation
- Position-based operations

#### Error Utilities

- Error formatting and presentation
- Error recovery suggestions
- Error categorization
- Error message templates

## Implementation Phases

### Phase 1: ✅ Complete

- [x] Grammar design and documentation
- [x] Type definitions
- [x] Constants and patterns
- [x] Project structure setup
- [x] Usage examples

### Phase 2: Core Parser Implementation

- [ ] QueryLexer implementation
- [ ] TokenStream management
- [ ] QueryParser implementation
- [ ] ASTBuilder implementation
- [ ] Error recovery mechanisms
- [ ] Unit tests for lexer and parser

### Phase 3: Auto-Completion Engine

- [ ] CompletionEngine implementation
- [ ] ContextAnalyzer implementation
- [ ] SuggestionRanker implementation
- [ ] Integration with parser
- [ ] Unit tests for completion system

### Phase 4: UI Integration

- [ ] React component integration
- [ ] Input field with auto-completion
- [ ] Error highlighting
- [ ] Real-time validation feedback
- [ ] Accessibility support

### Phase 5: Extensibility & Future Features

- [ ] Additional comparator support
- [ ] Query serialization
- [ ] Performance optimizations
- [ ] Advanced value types
- [ ] Plugin architecture

## Testing Strategy

### Unit Tests

- Each component has corresponding `.test.ts` file
- Test files located alongside implementation files
- Follow naming convention: `ComponentName.test.ts`
- Use Jest testing framework
- Aim for >90% code coverage

### Integration Tests

- Test component interactions
- Validate end-to-end functionality
- Test with realistic data sets
- Performance benchmarking

### Example Test Structure

```typescript
describe('QueryParser', () => {
  describe('parseSimpleCondition', () => {
    test('should parse basic key-value pair', () => {
      // Test implementation
    });

    test('should handle quoted values', () => {
      // Test implementation
    });
  });

  describe('parseBooleanLogic', () => {
    test('should parse AND operations', () => {
      // Test implementation
    });

    test('should parse OR operations', () => {
      // Test implementation
    });
  });
});
```

## API Design Principles

### Consistency

- Consistent naming conventions across all components
- Standardized error handling patterns
- Uniform configuration interfaces
- Predictable return types

### Modularity

- Each component has single responsibility
- Clear interfaces between components
- Minimal coupling between modules
- Easy to test and maintain

### Extensibility

- Plugin-based architecture where appropriate
- Configurable behavior through options
- Support for custom operators and comparators
- Extensible validation rules

### Performance

- Lazy evaluation where possible
- Efficient parsing algorithms
- Minimal memory allocation
- Caching for repeated operations

## Documentation Standards

### Code Documentation

- JSDoc comments for all public APIs
- Type annotations for all functions
- Usage examples in code comments
- Clear parameter descriptions

### API Documentation

- Comprehensive API reference
- Usage examples for each component
- Integration guides
- Best practices documentation

### User Documentation

- Getting started guide
- Advanced usage patterns
- Troubleshooting guide
- Migration guides for version updates
