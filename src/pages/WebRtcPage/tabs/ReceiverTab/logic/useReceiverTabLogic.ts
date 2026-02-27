import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { ConnectionState, type ConnectionStateValues, WEB_RTC_EVENT } from '../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../logic/types';

export function useReceiverTabLogic() {
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Idle);
  const [error, setError] = useState<Error | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isConnected = connectionState === ConnectionState.Open;
  const isConnecting = connectionState === ConnectionState.Connecting;

  const isConnectDisabled = isConnecting || isConnected;
  const isDisconnectDisabled = !isConnected && !isConnecting;

  const connect = useCallback(() => {
    setError(null);
    setConnectionState(ConnectionState.Connecting);

    const socket = new WebSocket(API_GATEWAY_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionState(ConnectionState.Open);

      const payload: WebRtcSignalingPayload = { type: 'receiver' };
      const message = { event: WEB_RTC_EVENT, payload };

      socket.send(JSON.stringify(message));
    };

    socket.onmessage = async (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as {
        type: string;
        sdp?: RTCSessionDescriptionInit;
        candidate?: RTCIceCandidateInit;
      };

      if (message.type === 'createOffer' && message.sdp) {
        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        pc.onicecandidate = (iceEvent) => {
          if (iceEvent.candidate) {
            const payload: WebRtcSignalingPayload = { type: 'iceCandidate', candidate: iceEvent.candidate };
            const message = { event: WEB_RTC_EVENT, payload };

            socket.send(JSON.stringify(message));
          }
        };

        pc.ontrack = (trackEvent) => {
          const stream = new MediaStream([trackEvent.track]);

          setRemoteStream(stream);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        };

        await pc.setRemoteDescription(message.sdp);

        const answer = await pc.createAnswer();

        await pc.setLocalDescription(answer);

        const payload: WebRtcSignalingPayload = { type: 'createAnswer', sdp: pc.localDescription! };

        socket.send(JSON.stringify({ event: WEB_RTC_EVENT, payload }));
      } else if (message.type === 'iceCandidate' && message.candidate && peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(message.candidate);
      }
    };

    socket.onclose = () => {
      setConnectionState(ConnectionState.Closed);
      socketRef.current = null;
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      setRemoteStream(null);
    };

    socket.onerror = () => {
      setError(new Error('WebSocket error'));
    };
  }, []);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    const isClosable = socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING;

    if (isClosable) socket.close();

    socketRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    setRemoteStream(null);
    setConnectionState(ConnectionState.Closed);
  }, []);

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
  };
}
