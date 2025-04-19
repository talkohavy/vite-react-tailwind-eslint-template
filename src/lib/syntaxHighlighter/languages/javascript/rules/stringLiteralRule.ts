import type { HLJSApi } from 'highlight.js';
import { SUBST } from '../constants';

function getStringLiteralRule(hljs: HLJSApi) {
  return {
    scope: 'string',
    begin: '`',
    end: '`',
    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
  };
}

export { getStringLiteralRule };
