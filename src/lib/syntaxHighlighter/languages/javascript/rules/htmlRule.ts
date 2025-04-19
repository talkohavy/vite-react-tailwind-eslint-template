import type { HLJSApi } from 'highlight.js';
import { SUBST } from '../constants';

function getHtmlRule(hljs: HLJSApi) {
  return {
    begin: '.?html`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'xml',
    },
  };
}

export { getHtmlRule };
