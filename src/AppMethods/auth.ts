import {WebSocketService} from "@/WebSocketService";
import { MessageType } from "@/shared/constants";
import { CallIdMethods } from "./callId";


export class AuthMethods extends CallIdMethods{
    private wsService: WebSocketService;

    constructor() {
        super();
        this.wsService = WebSocketService;
    }

    public subscribe(): void {
        this.wsService.call([
            MessageType.Subscribe,
            `${import.meta.env.VITE_APP_BASE_URL}/subscription/logs/list`
        ]);
    }

    public unsubscribe(): void {

    }

    public login(callId: string): void {
        this.wsService.call([
            MessageType.Call,
            callId,
            `${import.meta.env.VITE_APP_BASE_URL}/login`,
            import.meta.env.VITE_APP_USERNAME,
            import.meta.env.VITE_APP_PASSWORD,
        ]);
    }

    public loginByToken(callId: string, Token: string): void {
        this.wsService.call([
            MessageType.Call,
            callId,
            `${import.meta.env.VITE_APP_BASE_URL}/loginByToken`,
            Token,
        ]);
    }

    public logout(): void {
        this.wsService.call([
            MessageType.Call,
            this.updateLoginId(),
            `${import.meta.env.VITE_APP_BASE_URL}/logout`,
        ]);
    }

    private isLogin(payload: string): boolean {
        return this.getCallId() === payload;
    }
}
