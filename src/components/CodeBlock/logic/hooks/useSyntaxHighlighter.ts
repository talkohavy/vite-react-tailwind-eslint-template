import { useEffect } from 'react';
import hljs from 'highlight.js';

type useSyntaxHighlighterProps = {
  codeRef: any;
};

export default function useSyntaxHighlighter(props: useSyntaxHighlighterProps) {
  const { codeRef } = props;

  useEffect(() => {
    if (codeRef.current) hljs.highlightElement(codeRef.current);
  }, []);

  return null;
}
