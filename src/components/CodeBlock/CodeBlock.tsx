import clsx from 'clsx';
import Copy from '../svgs/Copy';
import styles from './CodeBlock.module.scss';
import hljs from 'highlight.js';
import { useEffect, useRef, useState } from 'react';

type CodeBlockProps = {
  language: string;
  code: string;
  onCopySuccess?: () => void;
};

export default function CodeBlock(props: CodeBlockProps) {
  const { code, language, onCopySuccess } = props;

  const [copied, setCopied] = useState(false);

  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) hljs.highlightElement(codeRef.current);
  }, [code]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopySuccess?.();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <pre className={styles.codeBlock}>
      <code ref={codeRef} className={language}>
        {code}
      </code>

      <button type='button' onClick={handleCopyClick} className={clsx(styles.copyIconButton, copied && styles.copied)}>
        <Copy className='h-full relative block' />
      </button>
    </pre>
  );
}
