import './styles/1c-light.css';
import './styles/vscode-dark.css';
import hljs from 'highlight.js';
import { javascriptLanguageToRegister } from './languages/javascript';
import { typescriptLanguageToRegister } from './languages/typescript';

hljs.registerLanguage('javascript', javascriptLanguageToRegister);
hljs.registerLanguage('typescript', typescriptLanguageToRegister);
