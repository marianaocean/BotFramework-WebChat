import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { ChatActions, CustomSettingState } from './Store';
import { ChatState, checkLocale, sendMenuMessage } from './Store';
import { borderStyleCreator, buttonStyleCreator } from './StyleUtil';
import { Theme } from './Theme';

interface Props {
    locale: string;
    allMessages: any[];
    border: any;
    customSetting: CustomSettingState;
    sendMenuMessage: (message: string) => void;
}

class Menu extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    private sendMenuMessage(message: string) {
        this.props.sendMenuMessage(message);
    }

    private createDisabledButton(key: any, message: string) {
        return <button key={key} className="button-disabled" disabled>{ message }</button>;
    }

    render() {
        const menuClass = classList(
            'wc-custom-menu'
        );
        const UNDEFINED = 'undefined';
        const all = this.props.allMessages.find(messages => checkLocale(messages.locale, this.props.locale)) || {messages: []};
        const list = [];
        for (let i = 6; i > all.messages.length ; i--) {
            list.push(this.createDisabledButton(i, (all.defaultMessage || UNDEFINED)));
        }
        return (
            <div className={ menuClass } style={borderStyleCreator(this.props.border)}>
                {
                    all.messages.map((message: any, index: any) => {
                        if (index >= 6) {
                            return null;
                        } else {
                            return message.sendingMessage ?
                            <button key={index} onClick={() => this.sendMenuMessage(message.sendingMessage)} style={buttonStyleCreator(this.props.customSetting.theme)}>
                            <img src={ message.imgUrl ||
                                'https://dummyimage.com/600x400/'
                                + (this.props.customSetting.theme && this.props.customSetting.theme.themeColor && this.props.customSetting.theme.themeColor.slice(1) || '6e9e44')
                                + (this.props.customSetting.theme && this.props.customSetting.theme.textColor && this.props.customSetting.theme.textColor.slice(1) || '/ffffff') + '&text='
                                + ( message.sendingMessage || all.defaultMessage || UNDEFINED )} alt={ message.sendingMessage || all.defaultMessage || UNDEFINED }></img>
                            <span>{ message.buttonText || message.sendingMessage || all.defaultMessage || UNDEFINED }</span></button>
                            :
                            this.createDisabledButton(index, (all.defaultMessage || UNDEFINED));
                        }
                    })
                }
                {list}
            </div>
        );
    }

}

export const CustomMenu = connect(
    (state: ChatState) => ({
        locale: state.format.locale,
        user: state.connection.user,
        allMessages: state.customMenu.allMessages,
        border: state.customMenu.border,
        customSetting: state.customSetting
    }),
    {
        sendMenuMessage
    },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // from stateProps
        locale: stateProps.locale,
        allMessages: stateProps.allMessages,
        border: stateProps.border,
        customSetting: stateProps.customSetting,
        sendMenuMessage: (message: string) => dispatchProps.sendMenuMessage(message, stateProps.user, stateProps.locale)
    })
)(Menu);
