const ReadState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

const RECONNECT_TIMEOUT = 3000;

type Message = string;
type Data = any;
type CmdId = number;
type MessageQueueEntry = [Message, Data, CmdId | undefined];
type OnMessageHandler = (cmd: string, data: any) => void;

export default class Ws {
  private cmdId: number = 0;

  private closing: boolean = false;

  private messageQueue: MessageQueueEntry[] = [];

  private messageContext?: any;

  private onMessage: OnMessageHandler;

  private requestResolvers = new Map<number, (data: Data) => void>();

  private webSocketUrl: string;

  private socket!: WebSocket;

  constructor(webSocketUrl: string, onMessage: OnMessageHandler) {
    this.webSocketUrl = webSocketUrl;

    this.onMessage = onMessage;

    this.init();
  }

  send(message: Message, data?: Data, cmdId?: CmdId) {
    if (this.closing) {
      throw new Error('Can not use a closing websocket');
    }

    switch (this.socket.readyState) {
      case ReadState.OPEN: {
        this.socket.send(
          JSON.stringify({
            cmd: message,
            cmdid: cmdId,
            context: this.messageContext,
            data,
            timestamp: Date.now(),
          })
        );
        break;
      }
      case ReadState.CONNECTING:
      case ReadState.CLOSING:
      case ReadState.CLOSED:
      default: {
        this.messageQueue.push([message, data, cmdId]);
        break;
      }
    }
  }

  async request(message: Message, data: Data) {
    if (this.closing) {
      throw new Error('Can not use a closing websocket');
    }

    const currentCmdId = this.cmdId;
    this.cmdId += 1;

    const response = new Promise<Data>((resolve) => {
      this.requestResolvers.set(currentCmdId, resolve);
    });
    this.send(message, data, currentCmdId);
    return response;
  }

  destroy() {
    if (this.closing) {
      throw new Error('Websocket is already being destroyed');
    }

    this.closing = true;

    this.requestResolvers = new Map();
    this.messageQueue = [];

    this.socket.close();
  }

  private init = () => {
    if (this.closing) return;

    const socket = new WebSocket(this.webSocketUrl);
    this.socket = socket;

    socket.addEventListener('open', this.processQueue);
    socket.addEventListener('close', this.reconnect);

    socket.addEventListener('message', (e) => {
      const message = JSON.parse(e.data);

      const cmdId = message.data?.cmdid;
      if (cmdId) {
        const requestResolver = this.requestResolvers.get(cmdId);
        requestResolver?.(message.data);
        this.requestResolvers.delete(cmdId);
        return;
      }

      setTimeout(() => this.onMessage(message.cmd, message.data), 0);
    });
  };

  private reconnect = () => {
    if (this.closing) return;

    setTimeout(this.init, RECONNECT_TIMEOUT);
  };

  private processQueue = () => {
    if (this.closing) return;

    let queueLength = this.messageQueue.length;

    // TODO refactor
    // eslint-disable-next-line no-plusplus
    while (queueLength--) {
      const message = this.messageQueue.shift();
      if (!message) return;

      this.send(...message);
    }
  };
}
