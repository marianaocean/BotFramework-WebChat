import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Activity, CardActionTypes, ConnectionStatus, DirectLine, DirectLineOptions, IBotConnection, User } from 'botframework-directlinejs';
import { Provider } from 'react-redux';
import { getTabIndex } from './getTabIndex';
import { UserSaysFetcher } from './helpers/UserSaysFetcher';
import * as konsole from './Konsole';
import { Speech } from './SpeechModule';
import { SpeechOptions } from './SpeechOptions';
import { ChatActions, createStore, sendMessage } from './Store';
import { ActivityOrID, FormatOptions } from './Types';
import { UrlToQrcode } from './UrlToQrcode';
import { INPUT_COMPLETION, rewriteConst } from './utils/const';
import { WaitingMessage } from './WaitingMessage';

export interface ChatProps {
    adaptiveCardsHostConfig: any;
    bot: User;
    botConnection?: IBotConnection;
    chatTitle?: boolean | string;
    directLine?: DirectLineOptions;
    disabled?: boolean;
    formatOptions?: FormatOptions;
    locale?: string;
    resize?: 'none' | 'window' | 'detect';
    selectedActivity?: BehaviorSubject<ActivityOrID>;
    sendTyping?: boolean;
    showUploadButton?: boolean;
    icon: {type: string, content: string, name?: string};
    showLanguageSelector?: boolean;
    languages: any[];
    customMenu: any;
    waitingMessage: any;
    urlToQrcode: any;
    speechOptions?: SpeechOptions;
    user: User;
    botName?: string;
    session?: boolean;
    botExtensions: any;
    fromAppProps?: any;
}

export interface BotCallBacks {
    conversationStarted?: (sessionId: string) => void;
}

import { Configuration } from './Configuration';
import { CustomMenu } from './CustomMenu';
import { History } from './History';
import { Languages } from './LanguageSelector';
import { MessagePane } from './MessagePane';
import { Shell, ShellFunctions } from './Shell';

export class Chat extends React.Component<ChatProps, {}> {

    private store = createStore();
    private botConnection: IBotConnection;

    private activitySubscription: Subscription;
    private connectionStatusSubscription: Subscription;
    private selectedActivitySubscription: Subscription;
    private shellRef: React.Component & ShellFunctions;
    private historyRef: React.Component;
    private chatviewPanelRef: HTMLElement;

    private resizeListener = () => this.setSize();

    // tslint:disable:variable-name
    private _handleCardAction = this.handleCardAction.bind(this);
    private _handleKeyDownCapture = this.handleKeyDownCapture.bind(this);
    private _saveChatviewPanelRef = this.saveChatviewPanelRef.bind(this);
    private _saveHistoryRef = this.saveHistoryRef.bind(this);
    private _saveShellRef = this.saveShellRef.bind(this);
    private _toggleConfig = this.toggleConfig.bind(this);
    private _toggleContainer = this.toggleContainer.bind(this);
    // tslint:enable:variable-name

    constructor(props: ChatProps) {
        super(props);

        if (props.botExtensions && props.botExtensions.intervalTime && typeof props.botExtensions.intervalTime === 'number' && props.botExtensions.intervalTime >= 1) {
            this.store.dispatch<ChatActions>({type: 'Enable_Interval_Controller', store: this.store, timeInterval: props.botExtensions.intervalTime});
        }
        konsole.log('BotChat.Chat props', props);

        const initLocale = props.locale || (window.navigator as any).userLanguage || window.navigator.language || 'en';
        this.store.dispatch<ChatActions>({
            type: 'Set_Locale',
            locale: initLocale
        });

        if (!!props.botExtensions.inputCompletion) {
            const userSaysFetcher = new UserSaysFetcher({secret: props.directLine.secret, store: this.store});
            this.store.dispatch<ChatActions>({type: 'Input_Completion_Initialize', fetcher: userSaysFetcher, active: !props.botExtensions.inputCompletion.disabled});
            if (!props.botExtensions.inputCompletion.disabled) {
                userSaysFetcher.fetchData(initLocale);
            }
            if (!!props.botExtensions.inputCompletion.maxHeight && typeof props.botExtensions.inputCompletion.maxHeight === 'number' && props.botExtensions.inputCompletion.maxHeight > 300) {
                rewriteConst(INPUT_COMPLETION, 'CONTAINER_MAX_HEIGHT', props.botExtensions.inputCompletion.maxHeight);
            }

            if (!!props.botExtensions.inputCompletion.maxOptions && typeof props.botExtensions.inputCompletion.maxOptions === 'number' && props.botExtensions.inputCompletion.maxOptions >= 10  && props.botExtensions.inputCompletion.maxOptions <= 30) {
                rewriteConst(INPUT_COMPLETION, 'COMPLETIONS_MAXIMUM', props.botExtensions.inputCompletion.maxOptions);
            }

            if (!!props.botExtensions.inputCompletion.keywordMinLength && typeof props.botExtensions.inputCompletion.keywordMinLength === 'number' && props.botExtensions.inputCompletion.keywordMinLength >= 1  && props.botExtensions.inputCompletion.keywordMinLength <= 5) {
                rewriteConst(INPUT_COMPLETION, 'MINIMUM_KEYWORD_LENGTH', props.botExtensions.inputCompletion.keywordMinLength);
            }
        }

        if (props.adaptiveCardsHostConfig) {
            this.store.dispatch<ChatActions>({
                type: 'Set_AdaptiveCardsHostConfig',
                payload: props.adaptiveCardsHostConfig
            });
        }

        let { chatTitle } = props;

        if (props.formatOptions) {
            console.warn('DEPRECATED: "formatOptions.showHeader" is deprecated, use "chatTitle" instead. See https://github.com/Microsoft/BotFramework-WebChat/blob/master/CHANGELOG.md#formatoptionsshowheader-is-deprecated-use-chattitle-instead.');

            if (typeof props.formatOptions.showHeader !== 'undefined' && typeof props.chatTitle === 'undefined') {
                chatTitle = props.formatOptions.showHeader;
            }
        }

        if (typeof chatTitle !== 'undefined') {
            this.store.dispatch<ChatActions>({ type: 'Set_Chat_Title', chatTitle });
        }

        this.store.dispatch<ChatActions>({ type: 'Toggle_Upload_Button', showUploadButton: props.showUploadButton !== false });

        if (props.sendTyping) {
            this.store.dispatch<ChatActions>({ type: 'Set_Send_Typing', sendTyping: props.sendTyping });
        }

        if (props.speechOptions) {
            this.store.dispatch<ChatActions>({ type: 'Save_Setting', recognizer: props.speechOptions.speechRecognizer });
            Speech.SpeechRecognizer.setSpeechRecognizer(props.speechOptions.speechRecognizer);
            Speech.SpeechSynthesizer.setSpeechSynthesizer(props.speechOptions.speechSynthesizer);
            this.store.dispatch<ChatActions>({ type: 'Set_Auto_Listen', autoListenAfterSpeak: props.speechOptions.autoListenAfterSpeak, alwaysSpeak: props.speechOptions.alwaysSpeak });
        }

        if (props.languages) {
            this.store.dispatch<ChatActions>({ type: 'Set_Language_Setting', display: true, languages: props.languages });
        }

        if (props.customMenu) {
            if (props.customMenu.showMenu) {
                this.store.dispatch<ChatActions>({
                    type: 'Set_Custom_Menu_Setting',
                    showMenu: props.customMenu.showMenu,
                    commonIcons: props.customMenu.commonIcons,
                    menuToggleSetting: props.customMenu.menuToggleSetting,
                    allMessages: props.customMenu.allMessages
                });
            }
        }

        if (props.icon || this.props.waitingMessage || this.props.urlToQrcode || (this.props.botExtensions && this.props.botExtensions.scrollToBottom > 1)) {
            let pIcon = null;
            let pWaitingMessage = null;
            let pUrlToQrcode = null;
            let pScrollToBottom = 1;
            if (props.icon) {
                let icontype: string = 'none';
                if (['image'].indexOf(props.icon.type.toLowerCase()) >= 0) {
                    icontype = 'url';
                } else if (['message'].indexOf(props.icon.type.toLowerCase()) >= 0) {
                    icontype = 'string';
                }
                pIcon = {...props.icon, type: icontype};
            }
            if (this.props.waitingMessage) {
                pWaitingMessage = new WaitingMessage(this.props.waitingMessage);
            }
            if (this.props.urlToQrcode) {
                pUrlToQrcode = new UrlToQrcode(this.props.urlToQrcode);
            }
            if (this.props.botExtensions && this.props.botExtensions.scrollToBottom > 1) {
                pScrollToBottom = this.props.botExtensions.scrollToBottom;
            }
            this.store.dispatch<ChatActions>({ type: 'Set_Custom_Settings', icon: pIcon, waitingMessage: pWaitingMessage, urlToQrcode: pUrlToQrcode, scrollToBottom: pScrollToBottom });
        }
        if (props.botExtensions && props.botExtensions.configurable) {
            this.store.dispatch<ChatActions>({ type: 'Enable_Configuration' });
        }
    }

    private handleIncomingActivity(activity: Activity) {
        const state = this.store.getState();
        if ((!state.customSetting.sessionId && activity.conversation && activity.conversation.id) || state.customSetting.sessionId !== activity.conversation.id) {
            this.store.dispatch<ChatActions>({ type: 'Save_Conversation_Id', conversationId: activity.conversation.id });
        }
        switch (activity.type) {
            case 'message':
                if (state.customSetting.intervalController.available) {
                    if (activity.from.id === state.connection.user.id) {
                        this.store.dispatch<ChatActions>({ type: 'Receive_Sent_Message', activity });
                    } else if (this.historyCheck(activity, this.props.botName)) {
                        this.store.dispatch<ChatActions>({type: 'Receive_Message', activity});
                    } else {
                        state.customSetting.intervalController.pushActivity(activity);
                        try {
                            localStorage.setItem('obotConversationLastActivityID_' + this.props.botName, activity.id);
                        } catch (err) {
                            console.error('localStorage not work');
                        }
                    }
                } else {
                    this.store.dispatch<ChatActions>({ type: activity.from.id === state.connection.user.id ? 'Receive_Sent_Message' : 'Receive_Message', activity });
                    try {
                        localStorage.setItem('obotConversationLastActivityID_' + this.props.botName, activity.id);
                    } catch (err) {
                        console.error('localStorage not work');
                    }
                }
                if (activity.from.id !== state.connection.user.id && this.props.botName && this.props.session) {
                    const botName = this.props.botName;
                    localStorage.setItem('obotConversationId_' + botName,  activity.conversation.id);
                    localStorage.setItem('obotConversationIdTimestamp_' + botName,  Date.now().toString());
                }
                break;

            case 'typing':
                if (activity.from.id !== state.connection.user.id) {
                    this.store.dispatch<ChatActions>({ type: 'Show_Typing', activity });
                }
                break;
        }
    }

    private historyCheck(activity: Activity, botName: string) {
        try {
            const activityIdSet = activity.id.split('|');
            const lastActivityIdSet = localStorage.getItem('obotConversationLastActivityID_' + botName).split('|');
            if (activityIdSet.length === lastActivityIdSet.length && activityIdSet.length === 2) {
                if (activityIdSet[0] === lastActivityIdSet[0] && parseInt(activityIdSet[1], 10) <= parseInt(lastActivityIdSet[1], 10)) {
                    return true;
                }
            }
        } catch (error) {
            return false;
        }

        return false;
    }

    private setSize() {
        this.store.dispatch<ChatActions>({
            type: 'Set_Size',
            width: this.chatviewPanelRef.offsetWidth,
            height: this.chatviewPanelRef.offsetHeight
        });
    }

    private handleCardAction() {
        try {
            // After the user click on any card action, we will "blur" the focus, by setting focus on message pane
            // This is for after click on card action, the user press "A", it should go into the chat box
            const historyDOM = findDOMNode(this.historyRef) as HTMLElement;

            if (historyDOM) {
                historyDOM.focus();
            }
        } catch (err) {
            // In Emulator production build, React.findDOMNode(this.historyRef) will throw an exception saying the
            // component is unmounted. I verified we did not miss any saveRef calls, so it looks weird.
            // Since this is an optional feature, I am try-catching this for now. We should find the root cause later.
            //
            // Some of my thoughts, React version-compatibility problems.
        }
    }

    private handleKeyDownCapture(evt: React.KeyboardEvent<HTMLDivElement>) {
        const target = evt.target as HTMLElement;
        const tabIndex = getTabIndex(target);

        if (
            evt.altKey
            || evt.ctrlKey
            || evt.metaKey
            || (!inputtableKey(evt.key) && evt.key !== 'Backspace')
        ) {
            // Ignore if one of the utility key (except SHIFT) is pressed
            // E.g. CTRL-C on a link in one of the message should not jump to chat box
            // E.g. "A" or "Backspace" should jump to chat box
            return;
        }

        if (
            target === findDOMNode(this.historyRef)
            || typeof tabIndex !== 'number'
            || tabIndex < 0
        ) {
            evt.stopPropagation();

            let key: string;

            // Quirks: onKeyDown we re-focus, but the newly focused element does not receive the subsequent onKeyPress event
            //         It is working in Chrome/Firefox/IE, confirmed not working in Edge/16
            //         So we are manually appending the key if they can be inputted in the box
            if (/(^|\s)Edge\/16\./.test(navigator.userAgent)) {
                key = inputtableKey(evt.key);
            }

            // shellRef is null if Web Chat is disabled
            if (this.shellRef) {
                this.shellRef.focus(key);
            }
        }
    }

    private saveChatviewPanelRef(chatviewPanelRef: HTMLElement) {
        this.chatviewPanelRef = chatviewPanelRef;
    }

    private saveHistoryRef(historyWrapper: any) {
        this.historyRef = historyWrapper && historyWrapper.getWrappedInstance();
    }

    private saveShellRef(shellWrapper: any) {
        this.shellRef = shellWrapper && shellWrapper.getWrappedInstance();
    }

    private toggleConfig() {
        this.store.dispatch<ChatActions>({type: 'Toggle_Config'});
    }

    private toggleContainer() {
        this.props.fromAppProps.toggleContainer();
    }

    componentDidMount() {
        // Now that we're mounted, we know our dimensions. Put them in the store (this will force a re-render)
        this.setSize();

        const botConnection = this.props.directLine
            ? (this.botConnection = new DirectLine(this.props.directLine))
            : this.props.botConnection
            ;

        if (this.props.resize === 'window') {
            window.addEventListener('resize', this.resizeListener);
        }

        this.store.dispatch<ChatActions>({ type: 'Start_Connection', user: this.props.user, bot: this.props.bot, botConnection, selectedActivity: this.props.selectedActivity });

        this.connectionStatusSubscription = botConnection.connectionStatus$.subscribe(connectionStatus => {
                if (this.props.speechOptions && this.props.speechOptions.speechRecognizer) {
                    const refGrammarId = botConnection.referenceGrammarId;
                    if (refGrammarId) {
                        this.props.speechOptions.speechRecognizer.referenceGrammarId = refGrammarId;
                    }
                }
                if (connectionStatus === ConnectionStatus.Online) {
                    const output = (this.botConnection as any).conversationId as string;
                    const state = this.store.getState();
                    if (this.props.botExtensions && this.props.botExtensions.callbacks) {
                        const botCallbacks = this.props.botExtensions.callbacks as BotCallBacks;
                        if (botCallbacks.conversationStarted && typeof botCallbacks.conversationStarted === 'function' && !state.customSetting.sessionId) {
                            botCallbacks.conversationStarted(output);
                        }
                    }
                }
                this.store.dispatch<ChatActions>({ type: 'Connection_Change', connectionStatus });
            }
        );

        this.activitySubscription = botConnection.activity$.subscribe(
            activity => this.handleIncomingActivity(activity),
            error => konsole.log('activity$ error', error)
        );

        if (this.props.selectedActivity) {
            this.selectedActivitySubscription = this.props.selectedActivity.subscribe(activityOrID => {
                this.store.dispatch<ChatActions>({
                    type: 'Select_Activity',
                    selectedActivity: activityOrID.activity || this.store.getState().history.activities.find(activity => activity.id === activityOrID.id)
                });
            });
        }
    }

    componentWillUnmount() {
        this.connectionStatusSubscription.unsubscribe();
        this.activitySubscription.unsubscribe();
        if (this.selectedActivitySubscription) {
            this.selectedActivitySubscription.unsubscribe();
        }
        if (this.botConnection) {
            this.botConnection.end();
        }
        window.removeEventListener('resize', this.resizeListener);
    }

    componentWillReceiveProps(nextProps: ChatProps) {
        if (this.props.adaptiveCardsHostConfig !== nextProps.adaptiveCardsHostConfig) {
            this.store.dispatch<ChatActions>({
                type: 'Set_AdaptiveCardsHostConfig',
                payload: nextProps.adaptiveCardsHostConfig
            });
        }

        if (this.props.showUploadButton !== nextProps.showUploadButton) {
            this.store.dispatch<ChatActions>({
                type: 'Toggle_Upload_Button',
                showUploadButton: nextProps.showUploadButton
            });
        }

        if (this.props.chatTitle !== nextProps.chatTitle) {
            this.store.dispatch<ChatActions>({
                type: 'Set_Chat_Title',
                chatTitle: nextProps.chatTitle
            });
        }
    }

    // At startup we do three render passes:
    // 1. To determine the dimensions of the chat panel (nothing needs to actually render here, so we don't)
    // 2. To determine the margins of any given carousel (we just render one mock activity so that we can measure it)
    // 3. (this is also the normal re-render case) To render without the mock activity

    render() {
        const state = this.store.getState();
        konsole.log('BotChat.Chat state', state);
        // only render real stuff after we know our dimensions
        return (
            <Provider store={ this.store }>
                <div
                    className="wc-chatview-panel"
                    onKeyDownCapture={ this._handleKeyDownCapture }
                    ref={ this._saveChatviewPanelRef }
                >
                {
                    !!state.format.chatTitle &&
                        <div className="wc-header">
                            {
                                !!this.props.fromAppProps && !!this.props.fromAppProps.toggleContainer && typeof this.props.fromAppProps.toggleContainer === 'function' &&
                                    <span className="wc-bot-toggle" onClick={ this._toggleContainer }></span>
                            }
                            <span>{ typeof state.format.chatTitle === 'string' ? state.format.chatTitle : state.format.strings.title }</span>
                            {
                                !!state.customSetting.configurable && <span className="wc-configurature" onClick={ this._toggleConfig }>
                                    <svg width="20px" height="20px" viewBox="0 0 512 512">
                                        <path d="M497.569,215.169l-55.341-13.064c-4.037-13.955-9.495-27.277-16.376-39.735l29.844-48.304c4.57-7.395,3.45-16.945-2.688-23.084l-31.992-31.991c-6.128-6.129-15.67-7.248-23.073-2.68l-48.286,29.854c-12.468-6.881-25.789-12.348-39.734-16.376l-13.064-55.368c-2-8.44-9.551-14.422-18.23-14.422h-45.24c-8.679,0-16.22,5.982-18.22,14.422L202.105,69.79c-13.955,4.028-27.276,9.478-39.735,16.376l-48.304-29.871c-7.386-4.551-16.945-3.441-23.084,2.697L58.992,90.974c-6.129,6.137-7.248,15.706-2.689,23.082l29.863,48.313c-6.881,12.458-12.349,25.78-16.367,39.716L14.422,215.15C5.982,217.169,0,224.701,0,233.389v45.231c0,8.679,5.982,16.239,14.422,18.229L69.8,309.914c4.028,13.945,9.486,27.257,16.367,39.707l-29.872,48.322c-4.551,7.394-3.441,16.954,2.697,23.101l31.982,31.973c6.138,6.147,15.706,7.256,23.082,2.688l48.322-29.872c12.469,6.89,25.79,12.349,39.726,16.367l13.064,55.368c2,8.468,9.541,14.431,18.22,14.431h45.24c8.679,0,16.23-5.964,18.23-14.431l13.064-55.368c13.936-4.018,27.258-9.477,39.708-16.367l48.313,29.863c7.403,4.57,16.945,3.45,23.092-2.688l31.982-31.992c6.128-6.128,7.248-15.688,2.678-23.083l-29.863-48.304c6.899-12.45,12.349-25.771,16.377-39.716l55.368-13.065c8.468-2,14.422-9.541,14.422-18.229V233.38C512,224.71,506.036,217.169,497.569,215.169z M255.995,397.319c-78.001,0-141.296-63.295-141.296-141.324c0-78.038,63.296-141.324,141.296-141.324c78.03,0,141.324,63.286,141.324,141.324C397.319,334.024,334.025,397.319,255.995,397.319z"></path>
                                        <path d="M256.005,180.507c-41.671,0-75.469,33.809-75.469,75.488c0,41.68,33.798,75.488,75.469,75.488c41.68,0,75.487-33.808,75.487-75.488C331.492,214.316,297.684,180.507,256.005,180.507z"></path>
                                    </svg>
                                </span>
                            }
                        </div>
                }
                    <MessagePane disabled={ this.props.disabled }>
                        <History
                            disabled={ this.props.disabled }
                            onCardAction={ this._handleCardAction }
                            ref={ this._saveHistoryRef }
                        />
                    </MessagePane>
                    {
                        !!state.changeLanguage.display && <Languages ref="languages" />
                    }
                    {
                        !!state.customSetting.configurable && <Configuration />
                    }
                    {
                        !!state.customMenu.showMenu && <CustomMenu />
                    }
                    {
                        !this.props.disabled && <Shell ref={ this._saveShellRef } />
                    }
                    {
                        this.props.resize === 'detect' &&
                            <ResizeDetector onresize={ this.resizeListener } />
                    }
                </div>
            </Provider>
        );
    }
}

export type IDoCardAction = (type: CardActionTypes, value: string | object) => void;

export const doCardAction = (
    botConnection: IBotConnection,
    from: User,
    locale: string,
    sendMessage: (value: string, user: User, locale: string) => void
): IDoCardAction => (
    type,
    actionValue
) => {
    const text = (typeof actionValue === 'string') ? actionValue as string : undefined;
    const value = (typeof actionValue === 'object') ? actionValue as object : undefined;

    switch (type) {
        case 'imBack':
            if (typeof text === 'string') {
                sendMessage(text, from, locale);
            }
            break;

        case 'postBack':
            sendPostBack(botConnection, text, value, from, locale);
            break;

        case 'call':
        case 'openUrl':
        case 'playAudio':
        case 'playVideo':
        case 'showImage':
        case 'downloadFile':
            window.open(text);
            break;
        case 'signin':
            const loginWindow = window.open();
            if (botConnection.getSessionId)  {
                botConnection.getSessionId().subscribe(sessionId => {
                    konsole.log('received sessionId: ' + sessionId);
                    loginWindow.location.href = text + encodeURIComponent('&code_challenge=' + sessionId);
                }, error => {
                    konsole.log('failed to get sessionId', error);
                });
            } else {
                loginWindow.location.href = text;
            }
            break;

        default:
            konsole.log('unknown button type', type);
        }
};

export const sendPostBack = (botConnection: IBotConnection, text: string, value: object, from: User, locale: string) => {
    botConnection.postActivity({
        type: 'message',
        text,
        value,
        from,
        locale,
        channelData: {
            postback: true
        }
    })
    .subscribe(
        id => konsole.log('success sending postBack', id),
        error => konsole.log('failed to send postBack', error)
    );
};

export const renderIfNonempty = (value: any, renderer: (value: any) => JSX.Element ) => {
    if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 0)) {
        return renderer(value);
    }
};

export const classList = (...args: Array<string | boolean>) => {
    return args.filter(Boolean).join(' ');
};

// note: container of this element must have CSS position of either absolute or relative
const ResizeDetector = (props: {
    onresize: () => void
}) =>
    // adapted to React from https://github.com/developit/simple-element-resize-detector
    <iframe
        style={{
            border: 'none',
            height: '100%',
            left: 0,
            margin: '1px 0 0',
            opacity: 0,
            pointerEvents: 'none',
            position: 'absolute',
            top: '-100%',
            visibility: 'hidden',
            width: '100%'
        }}
        ref={ frame => {
            if (frame) {
                frame.contentWindow.onresize = props.onresize;
            }
        } }
    />;

// For auto-focus in some browsers, we synthetically insert keys into the chatbox.
// By default, we insert keys when:
// 1. evt.key.length === 1 (e.g. "1", "A", "=" keys), or
// 2. evt.key is one of the map keys below (e.g. "Add" will insert "+", "Decimal" will insert ".")
const INPUTTABLE_KEY: { [key: string]: string } = {
    Add: '+',      // Numpad add key
    Decimal: '.',  // Numpad decimal key
    Divide: '/',   // Numpad divide key
    Multiply: '*', // Numpad multiply key
    Subtract: '-'  // Numpad subtract key
};

function inputtableKey(key: string) {
    return key.length === 1 ? key : INPUTTABLE_KEY[key];
}
