import {MessageType} from "@/shared/constants";
import {CallIdMethods} from "@/AppMethods/callId";

const HEARTBEAT_PING_INTERVAL = 30000;

type callbackMessage = (event: MessageEvent) => void;

export class WebSocketService extends CallIdMethods {
    private socket: WebSocket | null = null;
    private callbackMessage: callbackMessage | null = null;
    private heartbeatCounter = 0;
    private callId: String | null;

    public connect(callbackMessage: callbackMessage): void {
        this.socket = new WebSocket(import.meta.env.VITE_APP_WEB_SOCKET_URL, ["wamp"]);

        this.callbackMessage = callbackMessage;
        this.callId = this.getCallId();

        this.socket.onopen = () => {
            let self = this;
            setInterval(() => self.heartbeat(self), HEARTBEAT_PING_INTERVAL);
        };

        this.socket.onclose = (event) => {
            this.socket = null;
            this.heartbeatCounter = 0;
            if (this.callbackMessage) this.callbackMessage(<MessageEvent<any>>event);
        };

        this.socket.onerror = (event) => {
            if (this.callbackMessage) this.callbackMessage(<MessageEvent<any>>event);
        };

        this.socket.onmessage = (event) => {
            if (this.callbackMessage) this.callbackMessage(event);
        };
    }

    public close(): void {
        if (this.socket) this.socket.close();
    }

    private heartbeat(self): void {
        self.call([
            MessageType.Heartbeat,
            this.callId,
            this.heartbeatCounter
        ]);
        this.heartbeatCounter++;
    }

    public call( payload: [MessageType, string | number, string?, string?, string?]): void {
        if (this.socket) return this.socket.send(JSON.stringify(payload));
    }
}
