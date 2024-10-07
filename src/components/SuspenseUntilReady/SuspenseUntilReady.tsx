import { type PropsWithChildren, useEffect, useState } from 'react';

type SuspenseUntilReadyProps = PropsWithChildren<{
  asyncFn: () => Promise<void>;
}>;

export default function SuspenseUntilReady(props: SuspenseUntilReadyProps) {
  const { children, asyncFn } = props;

  const [isReady, setIsReady] = useState<boolean>();

  useEffect(() => {
    asyncFn().then(() => setIsReady(true));
  }, [asyncFn]);

  if (!isReady) return null;

  return children;
}
