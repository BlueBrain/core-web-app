const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

const RECONNECT_TIMEOUT = 3000;
const POLLING_INTERVAL = 5000;

const APIGatewayResponse = {
  RETRY: 'Retry later',
  PROCESSING: 'Processing message',
};

type Message = string;
type Data = any;
type CmdId = number;
type MessageQueueEntry = [Message, Data, CmdId | undefined];
type OnMessageHandler<WSResponses> = (cmd: WSResponses, data: any) => void;

export default class WsCommon<WSResponses> {
  private cmdId: number = 0;

  private closing: boolean = false;

  private messageQueue: MessageQueueEntry[] = [];

  private messageContext?: any;

  private onMessage: OnMessageHandler<WSResponses>;

  private requestResolvers = new Map<number, (data: Data) => void>();

  private webSocketUrl: string;

  private socket!: WebSocket;

  private serviceUp = false;

  constructor(webSocketUrl: string, token: string, onMessage: OnMessageHandler<WSResponses>) {
    this.webSocketUrl = webSocketUrl;

    this.onMessage = onMessage;

    this.init(token);
  }

  public get isServiceUp(){
    return this.serviceUp
  }

  send(message: Message, data?: Data, cmdId?: CmdId) {
    console.log('@@send/message', message, this.serviceUp)
    if (this.closing) {
      console.log('@@closing websocket')
      throw new Error('Can not use a closing websocket');
    }
    // as we need to wait for the service to be up, we queue the messages
    if (!this.serviceUp) {
      console.log('@@closing !this.serviceUp')
      this.messageQueue.push([message, data, cmdId]);
    } else {
      console.log('@@sending another socket')
      this._send(message, data, cmdId);
    }
  }

  _send(message: Message, data?: Data, cmdId?: CmdId) {
    if (this.socket.readyState !== ReadyState.OPEN || !this.serviceUp) {
      throw new Error('Websocket is not open');
    }
    console.log('@@__send', JSON.stringify({
      cmd: message,
      cmdid: cmdId,
      context: this.messageContext,
      data,
      timestamp: Date.now(),
    }, null, 2))
    this.socket.send(
      JSON.stringify({
        cmd: message,
        cmdid: cmdId,
        context: this.messageContext,
        data,
        timestamp: Date.now(),
      })
    );
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
    // if (this.closing) {
    //   throw new Error('Websocket is already being destroyed');
    // }

    // this.closing = true;

    // this.requestResolvers = new Map();
    // this.messageQueue = [];

    // this.socket.close();
  }

  sendCheckUpMsg() {
    console.log('@@ws-open')
    if (this.socket.readyState !== ReadyState.OPEN) return;
    if (this.serviceUp) return;

    this.socket.send(JSON.stringify({}));
  }

  private init = (token: string) => {
    if (this.closing) return;
    console.log('@@token', token)
    const socket = new WebSocket(this.webSocketUrl, `Bearer-${token}`);
    console.log('@@socket', socket)
    this.socket = socket;

    // send message to check until the service is up
    socket.addEventListener('open', () => this.sendCheckUpMsg());
    socket.addEventListener('close', this.reconnect);
    socket.addEventListener('error', (ev) => {
      console.log('@@error', ev)
    })
    socket.addEventListener('message', (e) => {
      console.log('@@ws-message', e)
      const message = JSON.parse(e.data);

      // coming as status messages from single-cell api gateway
      const apiGatewayMsg = message?.message;
      switch (apiGatewayMsg) {
        case APIGatewayResponse.RETRY:
          setTimeout(() => this.sendCheckUpMsg(), POLLING_INTERVAL);
          return;
        case APIGatewayResponse.PROCESSING:
          console.log('@@processing ...')
          if (!this.serviceUp) {
            console.log('@@processing/setting_service_up')
            // process all messages sent while the service was warming up
            this.serviceUp = true;
            this.processQueue();
            console.log('@@processing/is_service_up', this.serviceUp)
          }
          return;
        default:
          break;
      }

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

      this._send(...message);
    }
  };
}
