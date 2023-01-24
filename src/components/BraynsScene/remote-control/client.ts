interface PendingQuery {
  resolve(value: any): void;
  reject(err: { code: number; message: string }): void;
}

type Listener = (event: { name: string; params?: any }) => void;

export default class RemoteControlClient {
  private queriesCounter = 1;

  private readonly pendingQueries = new Map<string, PendingQuery>();

  private readonly listeners: Listener[] = [];

  constructor(private readonly iframe: HTMLIFrameElement, private readonly prefix = 'BCS') {
    window.addEventListener(
      'message',
      (evt) => {
        const payload = evt.data;
        if (!payload || typeof payload !== 'object') return;

        if (payload.type === `${prefix}-Event`) {
          this.triggerEvent(payload.name ?? 'unknonw', payload.data);
          return;
        }

        const pendingQuery = this.pendingQueries.get(payload.id);
        if (!pendingQuery) return;

        this.pendingQueries.delete(payload.id);
        const { resolve, reject } = pendingQuery;
        switch (payload.type) {
          case 'BCS-Response':
            resolve(payload.data);
            break;
          case 'BCS-Error':
            reject({
              code: payload.code,
              message: payload.message,
            });
            break;
          default:
          // This message is not for us. We just ignore it.
        }
      },
      false
    );
  }

  addEventListener(listener: Listener) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: Listener) {
    const { listeners } = this;
    for (let index = listeners.length - 1; index >= 0; index -= 1) {
      if (listener === listeners[index]) {
        listeners.splice(index, 1);
        return;
      }
    }
  }

  exec(method: string, params?: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = this.queriesCounter.toString(16);
      this.queriesCounter += 1;
      this.pendingQueries.set(id, { resolve, reject });
      this.iframe.contentWindow?.postMessage(
        {
          id,
          type: `${this.prefix}-Query`,
          method,
          params,
        },
        '*'
      );
    });
  }

  private triggerEvent(name: string, params: unknown) {
    // eslint-disable-next-line no-restricted-syntax
    for (const listener of this.listeners) {
      try {
        listener({ name, params });
      } catch (ex) {
        console.error('Error in a RemoteControlClient listener:', ex);
        console.error('...listener:', listener);
      }
    }
  }
}
