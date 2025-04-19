import type { HLJSApi } from 'highlight.js';
import { SUBST } from '../constants';

function getCssRule(hljs: HLJSApi) {
  return {
    begin: '.?css`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'css',
    },
  };
}

export { getCssRule };
