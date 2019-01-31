import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { ChatActions } from './Store';
import { ChatState, checkLocale, sendMenuMessage } from './Store';

interface Props {
    locale: string;
    allMessages: any[];
    sendMenuMessage: (message: string) => void;
}

class Menu extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    private sendMenuMessage(message: string) {
        this.props.sendMenuMessage(message);
    }

    render() {
        const menuClass = classList(
            'wc-custom-menu'
        );

        const all = this.props.allMessages.find(messages => checkLocale(messages.locale, this.props.locale)) || {messages: []};
        const list = [];
        for (let i = 6; i > all.messages.length ; i--) {
            list.push(<button key={i} className="button-disabled" disabled>{ all.defaultMessage || 'undefined' }</button>);
        }
        return (
            <div className={ menuClass }>
                {
                    all.messages.map((message: any, index: any) => {
                        if (index >= 6) {
                            return null;
                        } else {
                            return <button key={index} onClick={() => this.sendMenuMessage(message.sendingMessage)}>
                            <img src={message.imgUrl} alt={ all.defaultMessage || 'undefined' }></img>
                            <span>{ message.buttonText || all.defaultMessage || 'undefined' }</span></button>;
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
        allMessages: state.customMenu.allMessages
    }),
    {
        sendMenuMessage
    },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // from stateProps
        locale: stateProps.locale,
        allMessages: stateProps.allMessages,
        sendMenuMessage: (message: string) => dispatchProps.sendMenuMessage(message, stateProps.user, stateProps.locale)
    })
)(Menu);
