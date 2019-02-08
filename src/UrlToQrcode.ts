export class UrlToQrcode {
    public additionStr: string = 'https://chart.apis.google.com/chart?cht=qr&chs=400x400&choe=utf-8&chl=';
    public type: string = 'page';

    constructor(props: any) {
        if (props.type && (props.type as string).toLowerCase() === 'message') {
            this.type = 'message';
        }
        if (props.apiSetting && props.apiSetting.service && props.apiSetting.key) {
            if ((props.apiSetting.service as string).toLowerCase() === 'obotai') {
                this.additionStr = '' + props.apiSetting.key + '';
            }
        }
    }

    getQrcodePath(url: string) {
        if (url.match(/&/) !== null) {
            url = url.replace(/&/g, '%26');
        }
        return this.additionStr + url;
    }
}
