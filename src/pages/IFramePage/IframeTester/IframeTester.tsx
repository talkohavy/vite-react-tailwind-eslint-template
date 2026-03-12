import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { IncomingMessageEvents, PostMessageEvents } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import { useCommunicationWithIframe } from '@src/hooks/useCommunicationWithIframe';
import { useDarkTheme } from '@src/providers/DarkThemeProvider/DarkThemeContext';
import type { PostMessageEvent } from '@src/common/types';

const IFRAME_ORIGIN = 'http://localhost:3003';

interface IframeTestComponentProps {
  className?: string;
}

export default function IframeTester(props: IframeTestComponentProps) {
  const { className = '' } = props;
  const iframeRef = useRef<HTMLIFrameElement>({} as HTMLIFrameElement);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);

  const { toggleDarkMode, isDarkMode } = useDarkTheme();

  const sendLogToIframe = useCallback(() => {
    const message: PostMessageEvent<{ log: string }> = {
      type: PostMessageEvents.SendLogMessage,
      payload: { log: 'world' },
    };

    if (iframeWindow == null) return;

    iframeWindow.postMessage(message, '*');
  }, [iframeWindow]);

  const sayHiToIframe = useCallback(() => {
    const message: PostMessageEvent<{ message: string }> = {
      type: PostMessageEvents.SendHiToIframe,
      payload: { message: `hi from ${window.location.origin} - ${new Date().toISOString()}` },
    };

    if (iframeWindow == null) return;

    iframeWindow.postMessage(message, '*');
  }, [iframeWindow]);

  const sendOriginToIframe = useCallback(() => {
    const message: PostMessageEvent<{ origin: string }> = {
      type: PostMessageEvents.SendOrigin,
      payload: { origin: window.location.origin },
    };

    if (iframeWindow == null) return;

    iframeWindow.postMessage(message, '*');
  }, [iframeWindow]);

  const toggleAndSendThemeToIframe = useCallback(() => {
    const newIsDarkMode = toggleDarkMode();

    const message: PostMessageEvent<{ isDarkMode: boolean }> = {
      type: PostMessageEvents.SendTheme,
      payload: { isDarkMode: newIsDarkMode },
    };

    if (iframeWindow == null) return;

    iframeWindow.postMessage(message, '*');
  }, [iframeWindow, toggleDarkMode]);

  const requestOriginHandler = useCallback(() => {
    const response: PostMessageEvent<{ origin: string }> = {
      type: PostMessageEvents.SendOrigin,
      payload: { origin: window.location.origin },
    };

    return response;
  }, []);

  const incomingMessageHandlers = useMemo(() => {
    return {
      [IncomingMessageEvents.RequestOrigin]: requestOriginHandler,
    };
  }, [requestOriginHandler]);

  useCommunicationWithIframe({ incomingMessageHandlers, iframeWindow, allowedOrigin: IFRAME_ORIGIN });

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
    <div className='flex flex-col size-full gap-4'>
      <div className='flex gap-4'>
        <Button onClick={sendLogToIframe}>Log message to iframe</Button>

        <Button onClick={sayHiToIframe}>Render message in iframe</Button>

        <Button onClick={sendOriginToIframe}>Send origin to iframe</Button>

        <Button
          onClick={toggleAndSendThemeToIframe}
          className='bg-black hover:bg-blue-950 dark:bg-yellow-500 dark:hover:bg-yellow-600 active:bg-gray-900 dark:active:bg-none'
        >
          Switch to {isDarkMode ? 'light' : 'dark'} theme
        </Button>
      </div>

      <iframe
        ref={iframeRef}
        src={IFRAME_ORIGIN}
        title='Iframe Test'
        onLoad={onIframeLoad}
        allow='clipboard-write; clipboard-read'
        // sandbox='allow-same-origin allow-forms allow-scripts allow-top-navigation-by-user-activation'
        className='h-full border-4 border-red-500 rounded-2xl'
      />
    </div>
  );
}
