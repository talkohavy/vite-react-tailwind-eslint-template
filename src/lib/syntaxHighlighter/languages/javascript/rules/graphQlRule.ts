import type { HLJSApi } from 'highlight.js';
import { SUBST } from '../constants';

function getGraphQlRule(hljs: HLJSApi) {
  return {
    begin: '.?gql`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'graphql',
    },
  };
}

export { getGraphQlRule };
