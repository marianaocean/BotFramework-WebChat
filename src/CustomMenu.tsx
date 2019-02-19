import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { ChatActions, CustomMenuState, CustomSettingState } from './Store';
import { ChatState, checkLocale, sendMenuMessage, toggleMenu } from './Store';
import { buttonStyleCreator } from './StyleUtil';
import { Theme } from './Theme';

interface Props {
    locale: string;
    allMessages: any[];
    customMenu: CustomMenuState;
    customSetting: CustomSettingState;
    sendMenuMessage: (message: string) => void;
    toggleMenu: () => void;
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

    private toggleMenu() {
        this.props.toggleMenu();
    }

    render() {
        const menuClass = classList(
            'wc-custom-menu',
            this.props.customMenu.showMenu && 'wc-custom-menu-show',
            this.props.customMenu.menuToggleSetting && this.props.customMenu.menuToggleSetting.transition === 'on' && 'wc-transition-on'
        );
        const menuToggleClass = classList(
            'wc-custom-menu-toggle',
            this.props.customMenu.showMenu && 'wc-custom-menu-show',
            this.props.customMenu.menuToggleSetting && this.props.customMenu.menuToggleSetting.transition === 'on' && 'wc-transition-on'
        );
        const UNDEFINED = 'undefined';
        const commonIconsLength = this.props.customMenu.commonIcons ? this.props.customMenu.commonIcons.length : 0;
        const all = this.props.allMessages.find(messages => checkLocale(messages.locale, this.props.locale)) || {messages: []};
        const list = [];
        for (let i = 6; i > all.messages.length ; i--) {
            list.push(this.createDisabledButton(i, (all.defaultMessage || UNDEFINED)));
        }
        return (<div>
            <div className={ menuToggleClass }>
                <button onClick={() => this.toggleMenu()}>
                 {
                     this.props.customMenu.menuToggleSetting && this.props.customMenu.menuToggleSetting.type === 'image' && this.props.customMenu.menuToggleSetting ?
                     <img src={this.props.customMenu.menuToggleSetting.content} alt={this.props.customMenu.menuToggleSetting.content}></img> :
                     this.props.customMenu.menuToggleSetting.content
                 }
                </button>
            </div>
            {
                <div className={ menuClass }>
                    {
                        all.messages.map((message: any, index: any) => {
                            if (index >= 6) {
                                return null;
                            } else {
                                return message.sendingMessage ?
                                <button key={index} onClick={() => this.sendMenuMessage(message.sendingMessage)} style={buttonStyleCreator(this.props.customSetting.theme)}>
                                {
                                    !(message.imgUrl && message.imgUrl === 'no') && (this.props.customMenu.commonIcons || message.imgUrl) && <img src={ message.imgUrl || (index < commonIconsLength && this.props.customMenu.commonIcons[index]) || (commonIconsLength > 0 && this.props.customMenu.commonIcons[commonIconsLength - 1]) || UNDEFINED} alt={ message.sendingMessage || all.defaultMessage || UNDEFINED }></img>
                                }
                                <span>{ message.buttonText || message.sendingMessage || all.defaultMessage || UNDEFINED }</span></button>
                                :
                                this.createDisabledButton(index, (all.defaultMessage || UNDEFINED));
                            }
                        })
                    }
                    {list}
                </div>
            }
        </div>);
    }

}

export const CustomMenu = connect(
    (state: ChatState) => ({
        locale: state.format.locale,
        user: state.connection.user,
        allMessages: state.customMenu.allMessages,
        customMenu: state.customMenu,
        customSetting: state.customSetting
    }),
    {
        sendMenuMessage,
        toggleMenu
    },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // from stateProps
        locale: stateProps.locale,
        allMessages: stateProps.allMessages,
        customMenu: stateProps.customMenu,
        customSetting: stateProps.customSetting,
        sendMenuMessage: (message: string) => dispatchProps.sendMenuMessage(message, stateProps.user, stateProps.locale),
        toggleMenu: () => dispatchProps.toggleMenu()
    })
)(Menu);
