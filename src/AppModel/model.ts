import {reactive} from 'vue';
import {WebSocketService} from "@/WebSocketService";
import {AppMethods} from "@/AppMethods";
import {MessageType, Uri} from "@/shared/constants";

interface IUserInfo {
    Token: string | null;
    Username: string | null;
}

interface ILogItem {
    Timestamp: string,
    Level: string, //- Уровень логов (FATAL,ERROR,DEBUG,INFO,TRACE)
    Message: string,
    Source: string

}

interface ILogs {
    Action: number,
    Items: ILogItem[]
}

interface IAppModel {
    connected: boolean;
    isAuthorized: boolean;
    userInfo?: IUserInfo;
    isLogsLoaded: boolean;
    logs: ILogs;
}

enum Action {
    Adding = 0,
    Initialization = 3,
}

export class AppModel extends AppMethods {
    wsService: WebSocketService;
    // public model: Reactive<IAppModel>;
    model: any;

    constructor() {
        super();
        this.model = reactive({
            connected: false,
            isAuthorized: false,
            userInfo: {
                Token: null,
                Username: null,
            },
            isLogsLoaded: false,
            logs: {
                Action: 0,
                Items: [],
            }
        });
        this.wsService = new WebSocketService();
    }

    public parseMessage = (event: MessageEvent) => {
        const [messageType, payload, result] = JSON.parse(event.data);

        switch (messageType) {
            case MessageType.Welcome:
                this.model.connected = true;
                if (this.model.userInfo?.Token) {
                    this.loginByToken(this.getCallId(), this.model.userInfo.Token);
                } else this.login(this.getCallId());
                break;

            case MessageType.CallResult:
                this.checklogin(payload, result);
                break;

            case MessageType.CallError:
                this.checklogin(payload, result);
                break;

            case MessageType.Event:
                if (result.SubscribeError) {
                    this.subscribe();
                } else if (payload === Uri.logs) {
                    this.updateLogs(result);
                }
                break;

            default:
                break;
        }
    };

    public updateLogs(result: ILogs): void {
        switch (result.Action) {
            case Action.Adding:
                this.model.logs.Items = [
                    ...this.model.logs.Items,
                    ...result.Items,
                ];
                break;

            case Action.Initialization:
                this.model.logs.Items = [...result.Items];
                break;

            default:
                break;
        }
    }

    private checklogin(callId: string, result: IUserInfo): void {
        if (this.isLogin(callId)) {
            this.model.isAuthorized = true;
            this.model.userInfo = result;
            this.subscribe();
        } else if (this.model.userInfo?.Token) {
            this.loginByToken(this.getCallId(), this.model.userInfo.Token);
        } else this.login(this.getCallId());
    }

    private isLogin(callId: string): boolean {
        return this.getCallId() === callId;
    }
}
