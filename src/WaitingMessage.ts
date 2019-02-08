
export class WaitingMessage {
    public type: string = null;
    public content: any = null;

    constructor(props: any) {
        this.type = props.type;
        this.content = props.content;
    }
}
