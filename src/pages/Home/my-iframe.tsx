import { useRef, useEffect, useState } from 'react';

const iframeUrl = 'http://localhost:3003';

interface IframeTestComponentProps {
  className?: string;
}

export default function IframeTestComponent(props: IframeTestComponentProps) {
  const { className = '' } = props;
  const iframeRef = useRef<HTMLIFrameElement>({} as HTMLIFrameElement);
  const [isServerRunning, setIsServerRunning] = useState(false);

  useEffect(() => {
    checkServerStatus();
  }, []);

  async function checkServerStatus(): Promise<void> {
    try {
      const response = await fetch('http://localhost:3003');
      setIsServerRunning(response.ok);
    } catch (_error: any) {
      setIsServerRunning(false);
    }
  }

  function onIframeLoad(): void {
    try {
      // Try to access iframe content (will work only if same-origin)
      console.log('Iframe loaded:', iframeUrl);
      const iframeDoc = iframeRef.current?.contentDocument;
      const iframeWindow = iframeRef.current?.contentWindow;

      console.log('Iframe document:', iframeDoc);
      console.log('Iframe window:', iframeWindow);
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
          <div>cd iframe-server</div>
          <div>npm install</div>
          <div>npm start</div>
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
      src={iframeUrl}
      title='Iframe Test'
      onLoad={onIframeLoad}
      sandbox='allow-same-origin allow-scripts allow-top-navigation allow-forms'
      className='w-full h-full border-0'
    />
  );
}
