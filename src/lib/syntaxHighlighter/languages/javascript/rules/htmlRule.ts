import { SUBST } from '../constants';
import type { HLJSApi } from 'highlight.js';

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
