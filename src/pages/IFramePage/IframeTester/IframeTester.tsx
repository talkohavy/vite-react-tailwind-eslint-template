import { useRef, useEffect, useState } from 'react';
import { useCommunicationWithIframe } from '@src/hooks/useCommunicationWithIframe';

const IFRAME_ORIGIN = 'http://localhost:3003';

interface IframeTestComponentProps {
  className?: string;
}

export default function IframeTester(props: IframeTestComponentProps) {
  const { className = '' } = props;
  const iframeRef = useRef<HTMLIFrameElement>({} as HTMLIFrameElement);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);

  useCommunicationWithIframe({ iframeWindow, allowedOrigin: IFRAME_ORIGIN });

  useEffect(() => {
    checkServerStatus();
  }, []);

  async function checkServerStatus(): Promise<void> {
    try {
      const response = await fetch(IFRAME_ORIGIN);
      setIsServerRunning(response.ok);
    } catch {
      setIsServerRunning(false);
    }
  }

  function onIframeLoad(): void {
    try {
      // Try to access iframe content (will work only if same-origin)
      const iframeWindow = iframeRef.current?.contentWindow ?? null;
      setIframeWindow(iframeWindow);
    } catch (error) {
      console.log('Cannot access iframe content (same-origin policy):', error);
    }
  }

  if (!isServerRunning) {
    return (
      <div className={`p-6 border border-red-300 bg-red-50 rounded-lg ${className}`}>
        <h3 className='text-lg font-semibold text-red-800 mb-2'>📡 Iframe Server Not Running</h3>

        <p className='text-red-700 mb-4'>The iframe server is not running on port 3003. Please start it first:</p>

        <div className='bg-gray-800 text-green-400 p-4 rounded font-mono text-sm mb-4'>
          <div>open project `vite-react-iframe`</div>
          <div>run `pnpm install`</div>
          <div>run `pnpm dev`</div>
        </div>

        <button
          type='button'
          onClick={checkServerStatus}
          className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors'
        >
          Check Again
        </button>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={IFRAME_ORIGIN}
      title='Iframe Test'
      onLoad={onIframeLoad}
      // sandbox='allow-same-origin allow-forms allow-scripts allow-top-navigation-by-user-activation'
      className='w-[90%] mx-auto h-full border-4 border-red-500 rounded-2xl'
    />
  );
}
