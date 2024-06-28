import { getId } from "@/utils/uuid";

export class CallIdMethods {
  private state = {
    callId: getId(),
  };

  public updateLoginId(): string {
    this.state.callId = getId();
    return this.state.callId;
  }

  public getCallId(): string {
    return this.state.callId;
  }
}
