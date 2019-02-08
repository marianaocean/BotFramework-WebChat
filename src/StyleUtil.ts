import {Theme} from './Theme';

export function colorCodeMatch(colorCode: string) {
    if (!colorCode) { return null; }
    const result = colorCode.match(/^[#][0-9a-fA-F]{0,6}/);
    return !!result ? result[0] : null;
}

export const headerStyleCreator = (theme: Theme) => {
    const headerStyle: {backgroundColor: string, color: string} = {backgroundColor: null, color: null};
    if (theme) {
        if (theme.themeColor) {
            headerStyle.backgroundColor = theme.themeColor;
        }
        if (theme.textColor) {
            headerStyle.color = theme.textColor;
        }
    }
    return headerStyle;
};

export const backgroundColorCreator = (theme: Theme) => {
    const backgroundColor: { backgroundColor: string } = { backgroundColor: null};
    if (theme) {
        if (theme.backgroundColor) {
            backgroundColor.backgroundColor = theme.backgroundColor;
        }
    } else {
        return null;
    }
    return backgroundColor;
};

export const borderStyleCreator = (border: any) => {
    const borderStyle: {borderColor: string, borderImage: string} = { borderColor: null, borderImage: null };
    if (!!border) {
        if (!!border.color) {
            borderStyle.borderColor = border.color;
        }
        if (!!border.imgUrl) {
            if (border.imgUrl.match(/^url\('/)) {
                borderStyle.borderImage = border.imgUrl + ' 4 round';
            } else if (border.imgUrl.match(/^linear-gradient\(/)) {
                borderStyle.borderImage = border.imgUrl;
            }
        }
        return borderStyle;
    }
    return {};
};

export const buttonStyleCreator = (theme: Theme) => {
    const buttonStyle: {backgroundColor: string, color: string} = { backgroundColor: null, color: null};
    if (theme) {
        if (theme.themeColor) {
            buttonStyle.backgroundColor = theme.themeColor;
        }
        if (theme.textColor) {
            buttonStyle.color = theme.textColor;
        }
    }
    return buttonStyle;
};

export const consoleStyleCreator = (theme: Theme) => {
    const consoleStyle: {borderColor: string} = {borderColor: null};
    if (theme) {
        if (theme.themeColor) {
            consoleStyle.borderColor = theme.themeColor;
        }
    } else {
        return null;
    }
    return consoleStyle;
};

export const messageStyleCreator = (theme: Theme, who: string) => {
    const messageStyle: { backgroundColor: string, color: string } = { backgroundColor: null, color: null};
    if (theme) {
        if (who === 'bot') {
            if (theme.messageFromBotBgColor) {
                messageStyle.backgroundColor = theme.messageFromBotBgColor;
            }
            if (theme.messageFromBotTextColor) {
                messageStyle.color = theme.messageFromBotTextColor;
            }
        } else {
            if (theme.messageFromMeBgColor) {
                messageStyle.backgroundColor = theme.messageFromMeBgColor;
            }
            if (theme.messageFromBotTextColor) {
                messageStyle.color = theme.messageFromMeTextColor;
            }
        }
    } else {
        return null;
    }
    return messageStyle;
};

export const fillStyleCreator = (bgColor: string) => {
    if (bgColor) {
        return {fill: bgColor};
    } else {
        return null;
    }
};
