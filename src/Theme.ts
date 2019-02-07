import { colorCodeMatch } from './StyleUtil';

export class Theme {
    public themeColor: string = null;
    public textColor: string = null;
    public backgroundColor: string = null;
    public messageFromMeTextColor: string = null;
    public messageFromBotTextColor: string = null;
    public messageFromMeBgColor: string = null;
    public messageFromBotBgColor: string = null;

    constructor(props: any) {
        this.themeColor = colorCodeMatch(props.themeColor);
        this.textColor = colorCodeMatch(props.textColor);
        this.backgroundColor = colorCodeMatch(props.backgroundColor);
        this.messageFromBotTextColor = colorCodeMatch(props.messageFromBotTextColor);
        this.messageFromMeTextColor = colorCodeMatch(props.messageFromMeTextColor);
        this.messageFromBotBgColor = colorCodeMatch(props.messageFromBgBotColor);
        this.messageFromMeBgColor = colorCodeMatch(props.messageFromMeBgColor);
    }
}
