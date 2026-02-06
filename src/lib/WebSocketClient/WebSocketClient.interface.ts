export type WebSocketClientOptions = {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
  onMessage?: (event: MessageEvent<string | Blob>) => void;
};
