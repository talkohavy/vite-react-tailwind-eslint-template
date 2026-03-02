import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { ConnectionState, WebRtcSignalTypes, type ConnectionStateValues } from '../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../logic/types';

export function useReceiverTabLogic() {
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Idle);
  const [error, setError] = useState<Error | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);

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

      const message: SocketEventMessage<WebRtcSignalingPayload> = {
        event: SocketEvents.WebRtc,
        payload: {
          type: WebRtcSignalTypes.Receiver,
          sessionId: 'aaa-bbb-ccc',
        },
      };

      socket.send(JSON.stringify(message));
    };

    socket.onmessage = async (event: MessageEvent<string>) => {
      const rawMessage = JSON.parse(event.data);
      const payload = rawMessage.payload;

      if (payload.type === WebRtcSignalTypes.CreateOffer && payload.sdp) {
        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;
        iceCandidateQueueRef.current = [];
        remoteStreamRef.current = new MediaStream();

        pc.onicecandidate = (iceEvent) => {
          if (iceEvent.candidate) {
            const eventMessage: SocketEventMessage<WebRtcSignalingPayload> = {
              event: SocketEvents.WebRtc,
              payload: {
                type: WebRtcSignalTypes.IceCandidate,
                candidate: iceEvent.candidate,
                sessionId: 'aaa-bbb-ccc',
              },
            };

            socket.send(JSON.stringify(eventMessage));
          }
        };

        pc.ontrack = (trackEvent) => {
          const stream = remoteStreamRef.current;

          if (!stream) return;

          stream.addTrack(trackEvent.track);
          setRemoteStream(stream);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        };

        await pc.setRemoteDescription(payload.sdp);

        for (const candidate of iceCandidateQueueRef.current) {
          await pc.addIceCandidate(candidate);
        }

        iceCandidateQueueRef.current = [];

        const answer = await pc.createAnswer();

        await pc.setLocalDescription(answer);

        const eventMessage: SocketEventMessage<WebRtcSignalingPayload> = {
          event: SocketEvents.WebRtc,
          payload: {
            type: WebRtcSignalTypes.CreateAnswer,
            sdp: pc.localDescription!,
            sessionId: 'aaa-bbb-ccc',
          },
        };

        socket.send(JSON.stringify(eventMessage));
      } else if (payload.type === WebRtcSignalTypes.IceCandidate && payload.candidate && peerConnectionRef.current) {
        const pc = peerConnectionRef.current;
        if (pc.remoteDescription) {
          await pc.addIceCandidate(payload.candidate);
        } else {
          iceCandidateQueueRef.current.push(payload.candidate);
        }
      }
    };

    socket.onclose = () => {
      setConnectionState(ConnectionState.Closed);
      socketRef.current = null;
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      remoteStreamRef.current = null;
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
    remoteStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

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
