import type { TokenTypeValues } from 'create-query-language';

export type ColorableTokenTypes = Exclude<TokenTypeValues, 'WHITESPACE' | 'EOF'>;

export type TokenMetaInfo = {
  backgroundColor: string;
  color: string;
  label: string;
};
