import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { ConnectionState, WebRtcSignalTypes, type ConnectionStateValues } from '../../../logic/constants';
import { attachStreamToVideo } from './attachStreamToVideo';
import { getMediaStream, type ShareSource } from './getMediaStream';
import { setupWebRtcSending } from './setupWebRtcSending';
import type { WebRtcSignalingPayload } from '../../../logic/types';

function generateSessionId(): string {
  return crypto.randomUUID();
}

export function useSenderTabLogic() {
  const [sessionId, setSessionId] = useState(generateSessionId);
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Idle);
  const [error, setError] = useState<Error | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleGenerateNewSession = () => {
    disconnect();
    setSessionId(generateSessionId());
  };

  const isConnected = connectionState === ConnectionState.Open;
  const isConnecting = connectionState === ConnectionState.Connecting;

  const isConnectDisabled = isConnecting || isConnected;
  const isDisconnectDisabled = !isConnected && !isConnecting;
  const isStartSharingDisabled = !isConnected || isSharing;

  const connect = useCallback(() => {
    setError(null);
    setConnectionState(ConnectionState.Connecting);

    const socket = new WebSocket(API_GATEWAY_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionState(ConnectionState.Open);

      const webRtcMessage: SocketEventMessage<WebRtcSignalingPayload> = {
        event: SocketEvents.WebRtc,
        payload: {
          type: WebRtcSignalTypes.Sender,
          sessionId,
        },
      };

      socket.send(JSON.stringify(webRtcMessage));
    };

    socket.onclose = () => {
      setConnectionState(ConnectionState.Closed);
      socketRef.current = null;
    };

    socket.onerror = () => {
      setError(new Error('WebSocket error'));
    };
  }, [sessionId]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;

    const isClosable = socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING;

    if (isClosable) socket.close();

    socketRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => void track.stop());
    mediaStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    setConnectionState(ConnectionState.Closed);
    setIsSharing(false);
  }, []);

  const startSharing = useCallback(
    async (source: ShareSource) => {
      const socket = socketRef.current;

      const canShare = socket?.readyState === WebSocket.OPEN;

      if (!canShare) return;

      let mediaStream: MediaStream;
      try {
        mediaStream = await getMediaStream(source);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get media stream'));
        return;
      }

      mediaStreamRef.current = mediaStream;

      attachStreamToVideo(mediaStream, videoRef.current);

      const peerConnection = setupWebRtcSending({ socket, sessionId, mediaStream });
      peerConnectionRef.current = peerConnection;

      setIsSharing(true);
    },
    [sessionId],
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    videoRef,
    error,
    isSharing,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    isStartSharingDisabled,
    connect,
    disconnect,
    startSharing,
    sessionId,
    handleGenerateNewSession,
  };
}
