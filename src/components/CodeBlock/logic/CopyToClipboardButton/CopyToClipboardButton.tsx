import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CopyV2 from '../../../svgs/CopyV2';
import VMarkV2 from '../../../svgs/VMarkV2';
import styles from './CopyToClipboardButton.module.scss';

type CopyToClipboardButtonProps = {
  code: string;
  onCopySuccess: any;
};

export default function CopyToClipboardButton(props: CopyToClipboardButtonProps) {
  const { code, onCopySuccess } = props;

  const copyTimeoutRef = useRef(null as any);

  const [copied, setCopied] = useState(false);

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
    }, 1400);
  };

  useEffect(() => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  }, []);

  return (
    <button
      type='button'
      onClick={handleCopyClick}
      className={clsx(styles.copyToClipboardButton, copied && styles.copied)}
    >
      <CopyV2 className={styles.copyIcon} />
      <VMarkV2 className={styles.copiedIcon} />
    </button>
  );
}
