# Query Language Grammar Specification

## Overview

This document defines the grammar and syntax rules for our custom query language, designed for filtering and searching data with auto-completion support.

## Basic Syntax

```
key: value AND (key: value OR key: value)
```

## Grammar Rules (EBNF-like notation)

```
Query         := Expression
Expression    := Term (BooleanOp Term)*
Term          := Condition | "(" Expression ")"
Condition     := Key ":" Value
Key           := Identifier
Value         := Identifier | QuotedString
BooleanOp     := "AND" | "OR"
Identifier    := [a-zA-Z_][a-zA-Z0-9_]*
QuotedString  := '"' [^"]* '"' | "'" [^']* "'"
```

## Syntax Rules

### 1. Keys

- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Case-sensitive
- Examples: `name`, `user_id`, `createdAt`

### 2. Values

- Can be unquoted identifiers (same rules as keys)
- Can be quoted strings (single or double quotes)
- Examples: `active`, `"John Doe"`, `'in progress'`

### 3. Operators

- **AND**: Logical AND operation (higher precedence)
- **OR**: Logical OR operation (lower precedence)
- Case-insensitive (`and`, `AND`, `And` all valid)

### 4. Comparator

- **:** (colon) - equals comparator (only one supported initially)
- Future: `>`, `<`, `>=`, `<=`, `!=`, `~` (contains)

### 5. Grouping

- Parentheses `()` for grouping expressions
- Nested parentheses allowed
- Must be balanced

### 6. Whitespace

- Ignored around operators, colons, and parentheses
- Required between adjacent identifiers
- Examples: `key:value`, `key : value`, `key : value` all valid

## Operator Precedence

1. Parentheses (highest)
2. AND
3. OR (lowest)

## Usage Examples

### Basic Conditions

```
status: active
name: "John Doe"
age: 25
```

### Boolean Logic

```
status: active AND role: admin
status: active OR status: pending
name: "John" AND (role: admin OR role: moderator)
```

### Complex Queries

```
(status: active OR status: pending) AND role: admin
status: active AND (department: engineering OR department: design) AND level: senior
```

### Invalid Syntax Examples

```
status:           # Missing value
: active          # Missing key
status active     # Missing colon
status: AND role: admin  # Missing value before AND
((status: active)       # Unbalanced parentheses
```

## Auto-Completion Context

### 1. Key Context

- At start of query
- After AND/OR operators
- After opening parentheses
- Suggest: Available keys

### 2. Value Context

- After colon (:)
- Suggest: Values for the specific key (if closed list), or common patterns

### 3. Operator Context

- After complete condition (key: value)
- Before closing parentheses
- Suggest: AND, OR

### 4. Grouping Context

- Suggest opening parentheses when logical grouping would be helpful
- Auto-complete closing parentheses

## Error Handling Strategy

### Parse Errors

- Incomplete expressions
- Unbalanced parentheses
- Invalid characters
- Missing operators/operands

### Error Recovery

- Continue parsing after errors when possible
- Provide meaningful error messages with position
- Suggest corrections when feasible

## Future Extensions

### Additional Comparators

- `>`, `<`, `>=`, `<=` for numeric/date comparisons
- `!=` for not equals
- `~` or `contains` for substring matching
- `in` for list membership

### Advanced Value Types

- Numbers: `age > 25`
- Dates: `created > "2023-01-01"`
- Lists: `role in ["admin", "moderator"]`
- Ranges: `age between 25 and 65`

### Additional Operators

- `NOT` for negation
- `NEAR` for proximity searches
- Custom operators for domain-specific logic

## Implementation Notes

### Parser Design

- Recursive descent parser
- Error recovery mechanisms
- Position tracking for error reporting
- AST (Abstract Syntax Tree) generation

### Auto-Completion Engine

- Context-aware suggestions
- Fuzzy matching for partial inputs
- Smart ranking of suggestions
- Real-time validation feedback
