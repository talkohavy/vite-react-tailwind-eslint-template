import { useRef } from 'react';
import styles from './CodeBlock.module.scss';
import CopyToClipboardButton from './logic/CopyToClipboardButton';
import useSyntaxHighlighter from './logic/hooks/useSyntaxHighlighter';

type CodeBlockProps = {
  code: string;
  onCopySuccess?: () => void;
};

export default function CodeBlock(props: CodeBlockProps) {
  const { code, onCopySuccess } = props;

  const codeRef = useRef<HTMLElement>(null);

  useSyntaxHighlighter({ codeRef });

  return (
    <pre className={styles.codeBlock}>
      <code ref={codeRef}>{code}</code>

      <CopyToClipboardButton code={code} onCopySuccess={onCopySuccess} />
    </pre>
  );
}
