import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chat, ChatProps } from './Chat';
import * as konsole from './Konsole';
import { Speech } from './SpeechModule';

export type AppProps = ChatProps;

export const App = (props: AppProps, container: HTMLElement) => {
    if (!props.botName) {
        console.error('please set botName');
        return;
    }

    const botName = props.botName;

    let cid = null;

    if (props.session) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        cid = localStorage.getItem('obotConversationId_' + botName);
        const ts = localStorage.getItem('obotConversationIdTimestamp_'  + botName);
        if (!!cid) {
                const dateTs = new Date(parseInt(ts, 10)).toLocaleDateString('ja-JP', options);
                const dateNow = new Date(Date.now()).toLocaleDateString('ja-JP', options);
                if (dateTs !== dateNow) {
                cid = null;
            }
        }
    }

    if (!props.bot) {
        props.bot = {
            id: 'bot' + botName,
            name: 'botname' + botName
        };
    } else {
        props.bot = {
            ...props.bot,
            id: props.bot.id || 'bot' + botName,
            name: props.bot.name || 'botname' + botName
        };
    }

    if (!props.user) {
        props.user = {
            id: botName,
            name: botName
        };
    } else {
        props.user = {
            ...props.user,
            id: props.user.id || botName,
            name: props.user.name || botName
        };
    }

    if (!props.locale) {
        props.locale = 'ja';
    }

    if (!props.resize) {
        props.resize = 'window';
    }

    if (!props.showUploadButton) {
        props.showUploadButton = false;
    }

    if (props.speechOptions) {
        props.speechOptions = {
            ...props.speechOptions,
            speechRecognizer: props.speechOptions.speechRecognizer || new Speech.BrowserSpeechRecognizer('ja-JP'),
            speechSynthesizer: props.speechOptions.speechSynthesizer || new Speech.BrowserSpeechSynthesizer()
        };
    }

    if (!props.directLine) {
        console.error('please set directLine info');
    } else {
        props.directLine = {
            ...props.directLine,
            webSocket: !props.session,
            conversationId: cid
        };
    }

    if (props.icon) {
        props.icon = {
            ...props.icon,
            type: props.icon.type || 'image'
        };
    }

    if (props.waitingMessage) {
        props.waitingMessage = {
            ...props.waitingMessage,
            type: props.waitingMessage.type || 'image/gif'
        };
    }

    konsole.log('BotChat.App props', props);
    ReactDOM.render(React.createElement(AppContainer, props), container);
};

const AppContainer = (props: AppProps) =>
    <div className="wc-app">
        <Chat { ...props } />
    </div>;
