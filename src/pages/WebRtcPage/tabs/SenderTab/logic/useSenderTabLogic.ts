import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { ConnectionState, WebRtcSignalTypes, type ConnectionStateValues } from '../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../logic/types';

export function useSenderTabLogic() {
  const [connectionState, setConnectionState] = useState<ConnectionStateValues>(ConnectionState.Idle);
  const [error, setError] = useState<Error | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
          sessionId: 'aaa-bbb-ccc',
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
  }, []);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;

    const isClosable = socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING;

    if (isClosable) socket.close();

    socketRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    streamRef.current?.getTracks().forEach((track) => void track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    setConnectionState(ConnectionState.Closed);
    setIsSharing(false);
  }, []);

  const startSharing = useCallback(async () => {
    const socket = socketRef.current;

    const canShare = socket?.readyState === WebSocket.OPEN;

    if (!canShare) return;

    const videoElement = videoRef.current;

    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const webRtcMessage: SocketEventMessage<WebRtcSignalingPayload> = {
        event: SocketEvents.WebRtc,
        payload: {
          type: WebRtcSignalTypes.CreateOffer,
          sdp: pc.localDescription!,
          sessionId: 'aaa-bbb-ccc',
        },
      };

      socket.send(JSON.stringify(webRtcMessage));
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      const webRtcMessage: SocketEventMessage<WebRtcSignalingPayload> = {
        event: SocketEvents.WebRtc,
        payload: {
          type: WebRtcSignalTypes.IceCandidate,
          candidate: event.candidate,
          sessionId: 'aaa-bbb-ccc',
        },
      };

      socket.send(JSON.stringify(webRtcMessage));
    };

    const iceCandidateQueue: RTCIceCandidateInit[] = [];
    let remoteDescriptionSet = false;

    socket.onmessage = async (event: MessageEvent<string>) => {
      const rawMessage = JSON.parse(event.data);
      const payload = rawMessage.payload;

      if (payload.type === WebRtcSignalTypes.CreateAnswer && payload.sdp) {
        await pc.setRemoteDescription(payload.sdp);
        remoteDescriptionSet = true;
        for (const candidate of iceCandidateQueue) {
          await pc.addIceCandidate(candidate);
        }
        iceCandidateQueue.length = 0;
      } else if (payload.type === WebRtcSignalTypes.IceCandidate && payload.candidate) {
        if (remoteDescriptionSet) {
          await pc.addIceCandidate(payload.candidate);
        } else {
          iceCandidateQueue.push(payload.candidate);
        }
      }
    };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get display media'));
      return;
    }
    streamRef.current = stream;

    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack) pc.addTrack(videoTrack, stream);

    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.play().catch(() => {});
    }

    setIsSharing(true);
  }, []);

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
  };
}
