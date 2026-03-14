import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { ConnectionState, WebRtcSignalTypes, type ConnectionStateValues } from '../../../logic/constants';
import { setupWebRtcReceiving } from './setupWebRtcReceiving';
import type { WebRtcSignalingPayload } from '../../../logic/types';

export function useReceiverTabLogic() {
  const [sessionId, setSessionId] = useState('');
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Idle);
  const [error, setError] = useState<Error | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageHandlerRef = useRef<{ handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void> } | null>(
    null,
  );

  const isConnected = connectionState === ConnectionState.Open;
  const isConnecting = connectionState === ConnectionState.Connecting;

  const isConnectDisabled = isConnecting || isConnected || !sessionId.trim();
  const isDisconnectDisabled = !isConnected && !isConnecting;

  const clearRemoteStreamAndVideo = useCallback(() => {
    const mediaStream = remoteStreamRef.current;

    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => void track.stop());
      remoteStreamRef.current = null;
    }

    setRemoteStream(null);

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.srcObject = null;
      videoElement.load();
    }
  }, []);

  const connect = useCallback(() => {
    setError(null);
    setConnectionState(ConnectionState.Connecting);

    const socket = new WebSocket(API_GATEWAY_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionState(ConnectionState.Open);

      const message: SocketEventMessage<WebRtcSignalingPayload> = {
        event: SocketEvents.WebRtc,
        payload: {
          type: WebRtcSignalTypes.Receiver,
          sessionId,
        },
      };

      socket.send(JSON.stringify(message));
    };

    socket.onmessage = async (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data);

      if (payload.type === WebRtcSignalTypes.CreateOffer && payload.sdp) {
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        messageHandlerRef.current = null;
        clearRemoteStreamAndVideo();

        const { peerConnection, handleIceCandidate } = setupWebRtcReceiving({
          socket,
          sessionId,
          offerSdp: payload.sdp,
          callbacks: {
            onRemoteStream: (stream) => {
              remoteStreamRef.current = stream;
              setRemoteStream(stream);
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(() => {});
              }
            },
            onStreamCleared: clearRemoteStreamAndVideo,
          },
        });

        peerConnectionRef.current = peerConnection;
        messageHandlerRef.current = { handleIceCandidate };
      } else if (payload.type === WebRtcSignalTypes.IceCandidate && payload.candidate) {
        await messageHandlerRef.current?.handleIceCandidate(payload.candidate);
      }
    };

    socket.onclose = () => {
      setConnectionState(ConnectionState.Closed);
      socketRef.current = null;
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      messageHandlerRef.current = null;
      clearRemoteStreamAndVideo();
    };

    socket.onerror = () => {
      setError(new Error('WebSocket error'));
    };
  }, [clearRemoteStreamAndVideo, sessionId]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    const isClosable = socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING;

    if (isClosable) socket.close();

    socketRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    messageHandlerRef.current = null;
    clearRemoteStreamAndVideo();
    setConnectionState(ConnectionState.Closed);
  }, [clearRemoteStreamAndVideo]);

  const setVideoRef = useCallback(
    (videoElement: HTMLVideoElement | null) => {
      videoRef.current = videoElement;

      if (videoElement && remoteStream) {
        videoElement.srcObject = remoteStream;
        videoElement.play().catch(() => {});
      }
    },
    [remoteStream],
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    error,
    hasRemoteStream: !!remoteStream,
    remoteStream,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    connect,
    disconnect,
    setVideoRef,
    sessionId,
    setSessionId,
  };
}
