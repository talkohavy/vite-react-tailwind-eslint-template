Prefer async/await syntax over .then()/.catch()

Prefer functional components over const components.

Prefer typescript over javascript.

Prefer `Array.forEach` over `for of`.

Prefer optional chaining (e.g., `registration?.sync`) over using logical AND (`registration && registration.sync`) inside conditional statements.

Always destruct the "props" object inside the function body, never in the function's signature.

Use components from `src/components/controls` for all UI elements (buttons, inputs, selects, etc.) rather than creating them from scratch.

All imports need to be relative as this project doesn't support absolute paths.

Avoid returning the output of a function directly as the input to another function. Always store the output in a variable first before passing it to another function.
