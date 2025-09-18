import type { Language } from '../types';

export const codeExamples: Record<Language, string> = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('Fibonacci result:', result);

// Modern JavaScript features
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
];

const adults = users
  .filter(user => user.age >= 18)
  .map(user => ({ ...user, isAdult: true }))
  .sort((a, b) => a.age - b.age);

console.log('Adult users:', adults);`,

  css: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .button {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
}`,

  json: `{
  "name": "react-simple-code-editor-demo",
  "version": "1.0.0",
  "description": "A code editor with syntax highlighting",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-simple-code-editor": "^0.14.1",
    "prismjs": "^1.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/prismjs": "^1.26.0",
    "vite": "^4.4.0"
  },
  "keywords": ["react", "code-editor", "prismjs"],
  "author": "Your Name",
  "license": "MIT"
}`,
};
