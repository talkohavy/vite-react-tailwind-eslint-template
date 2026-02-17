import { type RefObject, useEffect } from 'react';
import hljs from 'highlight.js';

type useSyntaxHighlighterProps = {
  codeRef: RefObject<HTMLElement | null>;
};

export default function useSyntaxHighlighter(props: useSyntaxHighlighterProps) {
  const { codeRef } = props;

  useEffect(() => {
    if (codeRef.current) hljs.highlightElement(codeRef.current);
    // codeRef is a ref object, therefore it shouldn't be a dependency.
    // eslint-disable-next-line
  }, []);

  return null;
}
