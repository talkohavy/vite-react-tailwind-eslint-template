import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Copy from '../svgs/Copy';
import styles from './CodeBlock.module.scss';
import useSyntaxHighlighter from './logic/hooks/useSyntaxHighlighter';

type CodeBlockProps = {
  code: string;
  onCopySuccess?: () => void;
  language?: string; // 'bash' | 'javascript' | 'typescript' | 'html';
};

export default function CodeBlock(props: CodeBlockProps) {
  const { code, language, onCopySuccess } = props;

  const codeRef = useRef<HTMLElement>(null);
  const copyTimeoutRef = useRef(null as any);

  const [copied, setCopied] = useState(false);

  useSyntaxHighlighter({ codeRef });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopySuccess?.();

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      copyTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  }, []);

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
