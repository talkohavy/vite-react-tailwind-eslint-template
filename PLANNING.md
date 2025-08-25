# Query Language Project Planning

## High-Level Direction

- Build a custom query language parser and auto-completion engine for use in React apps.
- Syntax: `key: value AND (key: value OR key: value)`
- Initial support for:
  - Keys (with auto-completion)
  - Values (auto-completion for closed lists)
  - Operators: AND, OR
  - Comparator: equals (future: add more)
- Target: TypeScript, React, modular code, extensible for future comparators/operators.
- UI: Integrate with existing controls in `src/components/controls` for input/autocomplete.
- Parser: Robust, handles nested parentheses, whitespace, invalid syntax gracefully.
- Auto-completion: Context-aware, suggests keys, values, and operators as appropriate.
- Testing: Unit tests for parser and auto-completion logic, placed alongside code.

## Scope

- Core parser for query language
- Auto-completion engine
- UI integration (input field with suggestions)
- Extensible for future comparators/operators

## Tech Stack

- TypeScript (preferred)
- React functional components
- Jest for unit testing
- Use project conventions (see copilot-instructions.md)

## Constraints

- File length < 500 lines; split into modules/helpers as needed
- Consistent naming, imports, and architecture
- All UI elements use controls from `src/components/controls`
- All code must be unit tested

## Future Directions

- Support for additional comparators (>, <, !=, etc.)
- More operators (NOT, etc.)
- Advanced value types (dates, numbers, enums)
- Error highlighting in UI
- Query serialization/deserialization
