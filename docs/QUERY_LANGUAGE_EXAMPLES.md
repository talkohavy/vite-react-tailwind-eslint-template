# Query Language Usage Examples

## Overview

This document provides comprehensive examples of how to use the Query Language system, demonstrating various syntax patterns, use cases, and integration scenarios.

## Basic Syntax Examples

### Simple Conditions

```typescript
// Basic key-value pairs
status: active
name: "John Doe"
age: 25
role: admin
department: engineering
```

### Quoted Values

```typescript
// Values with spaces require quotes
name: "John Smith"
title: "Senior Developer"
location: "San Francisco"

// Single quotes also work
name: 'John Smith'
status: 'in progress'
```

### Boolean Logic - AND Operations

```typescript
// Multiple conditions (all must be true)
status: active AND role: admin
name: "John" AND department: engineering
status: active AND role: admin AND level: senior
```

### Boolean Logic - OR Operations

```typescript
// Alternative conditions (any must be true)
status: active OR status: pending
role: admin OR role: moderator
department: engineering OR department: design
```

### Complex Boolean Logic

```typescript
// Combining AND and OR (AND has higher precedence)
status: active AND role: admin OR role: moderator
// Equivalent to: status: active AND (role: admin OR role: moderator)

// Using parentheses for explicit grouping
(status: active OR status: pending) AND role: admin
status: active AND (role: admin OR role: moderator)
```

### Nested Grouping

```typescript
// Complex nested conditions
(status: active OR status: pending) AND (role: admin OR role: moderator)
status: active AND (department: engineering OR department: design) AND level: senior
(name: "John" OR name: "Jane") AND (role: admin OR (role: user AND department: engineering))
```

## Real-World Use Cases

### User Management System

```typescript
// Find active administrators
status: active AND role: admin

// Find users pending approval or inactive
status: pending OR status: inactive

// Find senior engineers or designers
(department: engineering OR department: design) AND level: senior

// Find users who need attention
(status: pending AND role: admin) OR (status: inactive AND lastLogin: "2023-01-01")
```

### Project Management

```typescript
// High priority tasks assigned to John
priority: high AND assignee: "John Doe"

// Tasks that are overdue or blocked
status: overdue OR status: blocked

// Critical bugs in production
severity: critical AND environment: production AND type: bug

// Tasks ready for review
(status: completed OR status: "ready for review") AND assignee: "John Doe"
```

### E-commerce Filtering

```typescript
// Available products in specific categories
status: available AND (category: electronics OR category: books)

// Products on sale or with high ratings
onSale: true OR rating: excellent

// Premium products within budget
tier: premium AND price: "under 100"

// Popular items that are in stock
(popularity: high OR trending: true) AND inventory: "in stock"
```

### Content Management

```typescript
// Published articles by specific authors
status: published AND (author: "John Smith" OR author: "Jane Doe")

// Content that needs review
(status: draft AND reviewer: unassigned) OR status: "pending review"

// Popular content in specific categories
(views: high OR shares: high) AND (category: technology OR category: science)
```

## Auto-Completion Scenarios

### Key Completion (Start of Expression)

```typescript
// User types: "st"
// Suggestions: status, startDate, story

// User types: "user"
// Suggestions: userId, userName, userRole, userStatus
```

### Value Completion (After Colon)

```typescript
// User types: "status: "
// Suggestions: active, inactive, pending, suspended

// User types: "role: a"
// Suggestions: admin, analyst

// User types: "department: "
// Suggestions: engineering, design, marketing, sales
```

### Operator Completion (After Complete Condition)

```typescript
// User types: "status: active "
// Suggestions: AND, OR

// User types: "name: \"John\" "
// Suggestions: AND, OR
```

### Smart Grouping Suggestions

```typescript
// User types: "status: active OR status: pending "
// Suggestions: AND, OR, ) (if inside group)

// User types: "status: active AND ("
// Suggestions: status, name, role, department (key suggestions)
```

## Error Handling Examples

### Syntax Errors

```typescript
// Missing value
"status: "
// Error: Expected value after ':'

// Missing key
": active"
// Error: Expected key name

// Missing operator
"status: active role: admin"
// Error: Expected 'AND' or 'OR' between conditions

// Unbalanced parentheses
"(status: active"
// Error: Expected closing parenthesis
```

### Invalid Identifiers

```typescript
// Invalid key names
"123status: active"
// Error: Keys must start with letter or underscore

"status-type: active"
// Error: Invalid character in key name

// Reserved keywords as keys
"AND: value"
// Error: 'AND' is a reserved keyword
```

## Integration Examples

### React Component Usage

```typescript
import { QueryLanguage } from '@/lib/QueryLanguage';

function SearchFilter() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const completions = QueryLanguage.getCompletions(value, keyConfigs);
    setSuggestions(completions);
  };

  return (
    <QueryInput
      value={query}
      onChange={handleQueryChange}
      suggestions={suggestions}
      placeholder="Enter search query..."
    />
  );
}
```

### Backend API Integration

```typescript
// Express.js endpoint
app.get('/api/users', (req, res) => {
  const query = req.query.filter as string;

  try {
    const parseResult = QueryLanguage.parse(query);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.errors });
    }

    const users = await UserService.findByQuery(parseResult.ast);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Invalid query' });
  }
});
```

## Performance Considerations

### Optimized Queries

```typescript
// Good: Specific conditions first
status: active AND department: engineering AND level: senior

// Less optimal: Broad conditions first
level: senior AND status: active AND department: engineering
```

### Complex Query Limits

```typescript
// Reasonable complexity
(status: active OR status: pending) AND (role: admin OR role: moderator)

// Potentially slow (deeply nested)
((((status: active OR status: pending) AND role: admin) OR role: moderator) AND department: engineering)
```

## Future Syntax Examples (Planned Features)

### Additional Comparators

```typescript
// Numeric comparisons
age > 25
price <= 100
rating >= 4.0

// Date comparisons
createdAt > "2023-01-01"
lastLogin < "2023-12-31"

// String operations
name ~ "John"  // contains
email != "admin@example.com"  // not equals
```

### Advanced Value Types

```typescript
// List membership
role in ["admin", "moderator"]
status not in ["deleted", "banned"]

// Range queries
age between 25 and 65
price between 10.00 and 50.00

// Boolean values
active = true
verified = false
```

### Additional Operators

```typescript
// Negation
NOT status: deleted
status: active AND NOT role: guest

// Proximity
title NEAR "query language"
description CONTAINS "TypeScript"
```

## Testing Examples

### Unit Test Cases

```typescript
describe('Query Parser', () => {
  test('parses simple condition', () => {
    const result = parser.parse('status: active');
    expect(result.success).toBe(true);
    expect(result.ast?.expression.type).toBe('condition');
  });

  test('handles boolean logic', () => {
    const result = parser.parse('status: active AND role: admin');
    expect(result.success).toBe(true);
    expect(result.ast?.expression.type).toBe('boolean');
  });

  test('reports syntax errors', () => {
    const result = parser.parse('status:');
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
```

### Integration Test Cases

```typescript
describe('Auto-completion', () => {
  test('suggests keys at start', () => {
    const completions = getCompletions('', keyConfigs);
    expect(completions.map(c => c.type)).toContain('key');
  });

  test('suggests values after colon', () => {
    const completions = getCompletions('status: ', keyConfigs);
    expect(completions.map(c => c.text)).toContain('active');
  });

  test('suggests operators after complete condition', () => {
    const completions = getCompletions('status: active ', keyConfigs);
    expect(completions.map(c => c.text)).toContain('AND');
  });
});
```
