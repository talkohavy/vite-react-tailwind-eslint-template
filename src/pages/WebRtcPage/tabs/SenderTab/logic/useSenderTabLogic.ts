import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { useWebSocket, WsConnectionStatus } from '@src/providers/WebSocketProvider';
import { WebRtcSignalTypes } from '../../../logic/constants';
import { attachStreamToVideo } from './attachStreamToVideo';
import { getMediaStream, type ShareSource } from './getMediaStream';
import { setupWebRtcSending } from './setupWebRtcSending';
import type { WebRtcSignalingPayload } from '../../../logic/types';

function generateSessionId(): string {
  return crypto.randomUUID();
}

export function useSenderTabLogic() {
  const {
    isConnected: isOpen,
    isConnectionAcknowledged,
    isConnecting,
    connect,
    disconnect,
    subscribeMessages,
    send,
    getSocket,
  } = useWebSocket();

  const [sessionId, setSessionId] = useState(generateSessionId);
  const [isSharing, setIsSharing] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleGenerateNewSession = () => {
    disconnect();
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  };

  const isConnected = isOpen || isConnectionAcknowledged;
  const isConnectDisabled = isConnecting || isConnected;
  const isDisconnectDisabled = !isConnected && !isConnecting;
  const isStartSharingDisabled = !isConnected || isSharing;

  const connectSender = useCallback(() => {
    connect(API_GATEWAY_URL);
  }, [connect]);

  useEffect(() => {
    return subscribeMessages((data) => {
      if (data.type === WsConnectionStatus.ConnectionAcknowledged) {
        const webRtcMessage: SocketEventMessage<WebRtcSignalingPayload> = {
          event: SocketEvents.WebRtc,
          payload: { type: WebRtcSignalTypes.Sender, sessionId },
        };

        send(JSON.stringify(webRtcMessage));
      }
    });
  }, [subscribeMessages, send, sessionId]);

  const disconnectSender = useCallback(() => {
    disconnect();

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => void track.stop());
    mediaStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    setIsSharing(false);
  }, [disconnect]);

  const startSharing = useCallback(
    async (source: ShareSource) => {
      const socket = getSocket();
      const canShare = socket?.readyState === WebSocket.OPEN;

      if (!canShare) return;

      let mediaStream: MediaStream;
      try {
        mediaStream = await getMediaStream(source);
      } catch (err) {
        console.error(err);
        return;
      }

      mediaStreamRef.current = mediaStream;

      attachStreamToVideo(mediaStream, videoRef.current);

      const peerConnection = setupWebRtcSending({ socket, sessionId, mediaStream });
      peerConnectionRef.current = peerConnection;

      setIsSharing(true);
    },
    [getSocket, sessionId],
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    videoRef,
    isSharing,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    isStartSharingDisabled,
    connectSender,
    disconnectSender,
    startSharing,
    sessionId,
    handleGenerateNewSession,
  };
}
