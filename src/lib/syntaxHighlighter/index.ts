import hljs from 'highlight.js';
import { typescriptLanguageToRegister } from './languages/typescript';
import { javascriptLanguageToRegister } from './languages/javascript';
import './styles/vscode-dark.css';

hljs.registerLanguage('javascript', javascriptLanguageToRegister);
hljs.registerLanguage('typescript', typescriptLanguageToRegister);
