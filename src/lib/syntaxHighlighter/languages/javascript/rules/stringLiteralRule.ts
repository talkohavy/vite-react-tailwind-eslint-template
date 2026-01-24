import { SUBST } from '../constants';
import type { HLJSApi } from 'highlight.js';

function getStringLiteralRule(hljs: HLJSApi) {
  return {
    scope: 'string',
    begin: '`',
    end: '`',
    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
  };
}

export { getStringLiteralRule };
