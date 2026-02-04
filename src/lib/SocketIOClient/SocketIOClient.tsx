import { io, type Socket, type ManagerOptions } from 'socket.io-client';

export class SocketIOClient {
  private socket: Socket;

  constructor(url: string) {
    const options: Partial<ManagerOptions> = {
      path: '/ws/v1',
      withCredentials: true, // using this will send the request WITH cookies! attaches even httpOnly cookies.
      transports: ['polling', 'websocket'], // default value is ['polling', 'websocket']
      autoConnect: false,
      timeout: 4000, // <--- The timeout in milliseconds for our connection attempt.
      reconnection: true, // <--- defaults to true. Should we allow re-connections?
      reconnectionAttempts: Number.POSITIVE_INFINITY, // <--- defaults to Infinity. How many reconnection attempts should we try?
      reconnectionDelay: 8000, // <--- defaults to 1000. Upon client disconnection, the time delay in milliseconds between reconnection attempts.
      reconnectionDelayMax: 10000, // <--- defaults to 5000. The max time delay in milliseconds between reconnection attempts.
    };

    this.socket = io(url, options);
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket.connected;
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }
}
