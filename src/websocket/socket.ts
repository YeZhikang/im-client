import EventEmitter from "eventemitter3";
import {BehaviorSubject} from "rxjs";

type StatusType = 'close' | 'open' | 'error';

const errorResponse = {
    type: 'error',
    message: '消息体解析错误'
}

interface IOptions {
    maxReconnectCount: number,
    timeout: number,
    delay: number
}

interface ISocket {
    connect(): void;

    reconnect(delay?: number): void;

    close(shouldReconnect: boolean): void;

    onOpen(e: Event): void;

    onMessage(e: Event): void;

    onError(e: Event): void;

    onClose(e: Event): void;

    removeEventListener(target: WebSocket): void;

    sendMessage(packet): void;
    
}

export default class Socket implements ISocket {
    
    private readonly url = null;
    private socket: WebSocket | null = null;
    private reconnectCount = 0;
    private events: EventEmitter | null = null;
    private delayTimer: any = 0;
    readonly status = new BehaviorSubject<StatusType>('close');
    private shouldReconnect: boolean = true;
    private options: IOptions = {
        maxReconnectCount: 5,
        timeout: 2000,
        delay: 1000,
    };

    constructor(events, url, options = {
        maxReconnectCount: 5,
        timeout: 2000,
        delay: 1000
    }) {
        this.events = events;
        this.url = url;
        this.options = options;

        this.onError = this.onError.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    connect() {
        this.reconnect(0)
    }

    reconnect(delay = this.options.delay) {
        if (!this.shouldReconnect) {
            return;
        }
        if (this.reconnectCount > this.options.maxReconnectCount) {
            this.close(false);
            this.events!.emit('fail')
        } else {
            if (delay) {
                this.delayTimer = setTimeout(() => this.reconnect(0), delay)
            } else {
                this.socket = new WebSocket(this.url!);
                this.reconnectCount = this.reconnectCount + 1
                this.clearDelay();
                this.socket.addEventListener('open', this.onOpen)
                this.socket.addEventListener('message', this.onMessage)
                this.socket.addEventListener('close', this.onClose)
                this.socket.addEventListener('error', this.onError);
            }
        }
    }

    clearDelay() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = 0;
        }
    }

    close(shouldReconnect = true) {
        if (this.socket) {
            switch (this.socket.readyState) {
                case WebSocket.CLOSED:
                case WebSocket.CLOSING:
                    this.socket.close();
                    break;
                default:
                    break;
            }
        }
        this.clearDelay()
        this.shouldReconnect = shouldReconnect;
        this.reconnect()
    }

    onOpen(e: Event) {
        this.status.next('open');
        this.reconnectCount = 0;
        this.events!.emit('open');
    }

    onMessage(e: MessageEvent) {
        let messageContent;

        try {
            messageContent = JSON.parse(e.data);
        } catch (e) {
            messageContent = errorResponse
        }

        this.events!.emit('packet', messageContent)
    }

    onClose(e: Event) {
        this.status.next('close');
        this.events!.emit('close', e)
        this.removeEventListener(this.socket!)
        this.reconnect(this.options.delay)
    }

    onError(e: Event) {
        this.status.next('error');
        this.events!.emit('error', e)
        this.removeEventListener(this.socket!)
        this.reconnect(this.options.delay)
    }

    sendMessage(packet) {
        this.socket?.send(JSON.stringify(packet))
    }

    removeEventListener(target: WebSocket) {
        if (target === this.socket) {
            this.socket.removeEventListener('open', this.onOpen)
            this.socket.removeEventListener('message', this.onMessage)
            this.socket.removeEventListener('close', this.onClose)
            this.socket.removeEventListener('error', this.onError)
            this.socket = null;
        }
    }
}