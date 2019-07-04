import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chat, ChatProps } from './Chat';
import * as konsole from './Konsole';
import { Speech } from './SpeechModule';

export type AppProps = ChatProps;

export const App = (props: AppProps, container: HTMLElement, controller: HTMLElement = null) => {
    if (!props.botName) {
        console.error('please set botName');
        return;
    }

    const botName = props.botName;

    let cid = null;

    if (typeof localStorage === 'undefined') {
        console.log('localStorage disable');
        props.session = false;
    }

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

        if ( props.speechOptions.speechRecognizer && props.speechOptions.speechSynthesizer ) {
            props.speechOptions = {
                ...props.speechOptions
            };
        } else if ((window as any).webkitSpeechRecognition) {
            props.speechOptions = {
                ...props.speechOptions,
                speechRecognizer: new Speech.BrowserSpeechRecognizer('ja-JP'),
                speechSynthesizer: new Speech.BrowserSpeechSynthesizer()
            };
        } else {
            props.speechOptions = null;
        }
    }

    if (!props.directLine) {
        console.error('please set directLine info');
    } else {
        props.directLine = {
            ...props.directLine,
            webSocket: !!props.directLine.webSocket,
            conversationId: cid
        };
    }

    if (props.icon) {
        if (!props.icon.content && !props.icon.name) {
            console.error('please set icon content or delete icon');
            return;
        }
        props.icon = {
            ...props.icon,
            type: props.icon.type || 'image',
            content: props.icon.content || props.icon.name
        };
    }

    if (props.waitingMessage) {

        if (!props.waitingMessage.content) {
            console.error('please set waiting message content or delete waiting message');
            return;
        }

        props.waitingMessage = {
            ...props.waitingMessage,
            type: props.waitingMessage.type || 'image/gif'
        };
    }

    if (props.botExtensions && ['sendword', 'waiting', 'all'].indexOf(props.botExtensions.scrollToBottom)) {
        props.botExtensions.scrollToBottom = ['sendword', 'waiting', 'all'].indexOf(props.botExtensions.scrollToBottom) + 1;
    }

    if (props.languages) {

        if ( !(props.languages instanceof Array) ) {
            console.error('languages must be an array');
            return;
        } else if ( props.languages.length === 0) {
            props.languages =  ['ja', 'en', 'zh-hans', 'zh-hant', 'ko', 'ru', 'th'];
        }
    }

    if (props.customMenu) {
        props.customMenu = {
            ...props.customMenu,
            showMenu: true
        };
    }

    const lazyLoad = props.botExtensions && props.botExtensions.lazyLoad;
    let mobileScrollFix = false;
    let pcScrollFix = false;
    if (props.botExtensions && props.botExtensions.backgroundFix && props.botExtensions.backgroundFix instanceof Array) {
        mobileScrollFix = props.botExtensions.backgroundFix.findIndex((fx: string) => fx === 'mobile') > -1;
        pcScrollFix = props.botExtensions.backgroundFix.findIndex((fx: string) => fx === 'pc') > -1;
    }

    if (!lazyLoad || !controller) {
        konsole.log('BotChat.App props', props);
        ReactDOM.render(React.createElement(AppContainer, props), container);
    }
    if (controller && document.body.contains(controller)) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        let scrollbarSize: number = null;
        let enterCount: number = 0;
        let pageTop = 0;
        if (!isMobile && pcScrollFix) {
            const handleMouseEnter = () => {
                if (!isMobile && pcScrollFix && enterCount <= 0) {
                    enterCount ++ ;
                    scrollbarSize = window.innerWidth - document.body.clientWidth;
                    fixChatPosition(scrollbarSize);
                    fixControllerPosition(scrollbarSize);
                    document.body.style.overflowY = 'hidden';
                    document.body.style.width = (window.innerWidth - scrollbarSize) + 'px';
                }
            };

            const handleMouseLeave = () => {
                enterCount -- ;
                if (!isMobile && pcScrollFix) {
                    container.style.right = '';
                    container.style.width = '';
                    unfixControllerPosition();
                    document.body.style.overflowY = '';
                    document.body.style.width = '';
                }
            };

            const fixChatPosition = (scrollbarSize: number) => {
                let containerRight = container.style.right;
                let containerWidth = container.style.width;
                let computedStyle = null;
                if (!containerRight || !containerWidth) {
                    computedStyle = window.getComputedStyle(container);
                }
                if (computedStyle) {
                    containerRight = computedStyle.right;
                    containerWidth = computedStyle.width;
                }
                container.style.right = (getSizeNumFromStr(containerRight) + scrollbarSize) + 'px';
                container.style.width = getSizeNumFromStr(containerWidth) + 'px';
            };

            const fixControllerPosition = (scrollbarSize: number) => {
                Array.prototype.forEach.call(controller.getElementsByTagName('div'), (thisDiv: HTMLDivElement) => {
                    let divRight = thisDiv.style.marginRight;
                    if (!divRight) {
                        divRight = window.getComputedStyle(thisDiv).marginRight;
                    }
                    thisDiv.style.marginRight = (getSizeNumFromStr(divRight) + scrollbarSize) + 'px';
                });
            };

            const unfixControllerPosition = () => {
                Array.prototype.forEach.call(controller.getElementsByTagName('div'), (thisDiv: HTMLDivElement) => {
                    thisDiv.style.marginRight = '';
                });
            };

            container.addEventListener(
                'mouseenter', () => {
                    handleMouseEnter();
                }
            );

            container.addEventListener(
                'mouseleave', () => {
                    handleMouseLeave();
                }
            );
        }

        const getSizeNumFromStr = (str: string) => {
            try {
                return parseFloat(str.match(/^[0-9]+(.\d+){0,1}/i)[0]);
            } catch (error) {
                return 0;
            }
        };

        Array.prototype.forEach.call(controller.getElementsByTagName('div'), (thisDiv: HTMLDivElement) => {
            thisDiv.addEventListener(
                'click',
                () => {
                    thisDiv.classList.toggle('active');
                }
            );
        });
        container.style.transition = 'opacity .5s';
        controller.addEventListener('click', () => {
            if (lazyLoad) {
                if (container.getElementsByClassName('wc-app').length === 0) {
                    ReactDOM.render(React.createElement(AppContainer, props), container);
                }
            }
            const computedStyle = window.getComputedStyle(container, null);
            const isChatOpened = computedStyle.visibility;
            if (isChatOpened === 'hidden' || isChatOpened === '') {
                container.style.visibility = 'visible';
                container.style.opacity = '1';
            } else {
                container.style.visibility = 'hidden';
                container.style.opacity = '0';
            }

            if (isMobile && mobileScrollFix) {
                if (container.style.visibility === 'visible') {
                    document.body.style.overflow = 'hidden';
                    if (isIOS) {
                        pageTop = window.scrollY;
                        const setTop = (-1) * pageTop;
                        document.body.style.position = 'fixed';
                        document.body.style.width = '100%';
                        document.body.style.top = setTop + 'px';
                    }
                } else {
                    document.body.style.overflow = null;
                    if (isIOS) {
                        document.body.style.position = '';
                        document.body.style.width = '';
                        window.scroll(0, pageTop);
                        pageTop = 0;
                    }
                }
            }
        });
    }
};

const AppContainer = (props: AppProps) =>
    <div className="wc-app">
        <Chat { ...props } />
    </div>;
