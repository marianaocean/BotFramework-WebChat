
export class WaitingMessage {
    public type: string = null;
    public content: any = null;

    constructor(props: any) {
        this.type = props.type;
        this.content = props.content;
    }

    public get isValid() {
        if (['css', 'message', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(this.type) !== -1) {
            if (this.type !== 'css' && !this.content) {
                return false;
            }
            return true;
        }
        return false;
    }
}
