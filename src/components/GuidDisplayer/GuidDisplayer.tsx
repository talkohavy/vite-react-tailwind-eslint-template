import { useEffect, useRef, useState } from 'react';
import Button from '@src/components/controls/Button';
import { getGuidSegments } from './logic/utils/getGuidSegments';

/** Box styling to match PinInput: square, rounded, border, centered monospace. */
const charBoxClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#494844] bg-gray-100 font-mono text-base font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-100';

type SessionIdWithCopyProps = {
  value: string;
  onGenerateNew?: () => void;
};

/**
 * Displays a session ID (e.g. GUID) as character boxes with dashes between groups, plus copy button.
 * Optional "New session" button for the sender to generate a new ID.
 */
export default function SessionIdWithCopy({ value, onGenerateNew }: SessionIdWithCopyProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!copied) return;
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const segments = getGuidSegments(value);

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex items-center gap-0.5' title={value} role='img' aria-label={`Session ID: ${value}`}>
        {segments.map((segment, groupIndex) => (
          <span key={groupIndex} className='flex items-center gap-0.5'>
            {groupIndex > 0 && (
              <span className='flex h-10 w-4 shrink-0 items-center justify-center font-mono text-lg text-gray-500 dark:text-gray-400'>
                -
              </span>
            )}

            {segment.split('').map((char, i) => (
              <span key={`${groupIndex}-${i}`} className={charBoxClass}>
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>

      <Button onClick={handleCopy} className='bg-gray-600 hover:bg-gray-700 disabled:opacity-50'>
        {copied ? 'Copied!' : 'Copy'}
      </Button>

      {onGenerateNew && (
        <Button onClick={onGenerateNew} className='bg-amber-600 hover:bg-amber-700 disabled:opacity-50'>
          New session
        </Button>
      )}
    </div>
  );
}
