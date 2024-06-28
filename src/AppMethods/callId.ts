import { getId } from "@/utils/uuid";

export class CallIdMethods {
  private state = {
    loginId: getId(),
  };

  public updateLoginId(): string {
    this.state.loginId = getId();
    return this.state.loginId;
  }

  public getCallId(): string {
    return this.state.loginId;
  }
}
