import { useEffect } from 'react';
import { allMessageHandlers } from './handlers';
import { isValidMessage } from './logic/utils/isValidMessage';
import type { PostMessageRequest } from './types';

const MESSAGE_EVENT = 'message';

export type UseCommunicationWithIframeProps = {
  /**
   * The iframe's contentWindow. When null, no listener is active.
   */
  iframeWindow: Window | null;
  /**
   * Allowed origin for the iframe (e.g. 'http://localhost:3003'). Optional; if not set, any origin is accepted.
   */
  allowedOrigin?: string;
};

export function useCommunicationWithIframe(props: UseCommunicationWithIframeProps) {
  const { iframeWindow, allowedOrigin } = props;

  useEffect(() => {
    if (iframeWindow == null) return;

    function handleIncomingMessageFromIframe(eventMessage: MessageEvent<PostMessageRequest>) {
      const { data: message, source: eventSource, origin: eventOrigin } = eventMessage;
      const messageType = message.type;

      // Reject 1: Not the same origin
      const isSameOrigin = allowedOrigin === eventOrigin;

      // Reject 2: No iframe window
      if (!isSameOrigin || iframeWindow == null) return;

      // Reject 3: Invalid message
      if (!isValidMessage(message)) return;

      // Reject 4: Not the same source
      if (eventSource !== iframeWindow) return;

      const messageHandler = allMessageHandlers[messageType];

      const response = messageHandler(message);

      // Respond back to iframe if a response exists
      if (response) {
        iframeWindow.postMessage(response, eventOrigin);
      }
    }

    window.addEventListener(MESSAGE_EVENT, handleIncomingMessageFromIframe);

    return () => window.removeEventListener(MESSAGE_EVENT, handleIncomingMessageFromIframe);
  }, [iframeWindow, allowedOrigin]);
}
