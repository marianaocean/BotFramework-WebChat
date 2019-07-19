import { HostConfig } from 'adaptivecards';
import { Activity, Attachment, ConnectionStatus, IBotConnection, Media, MediaType, Message, User } from 'botframework-directlinejs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as konsole from './Konsole';
import { Speech } from './SpeechModule';
import { defaultStrings, strings, Strings } from './Strings';
import { ActivityOrID } from './Types';
import { UrlToQrcode } from './UrlToQrcode';
import { WaitingMessage } from './WaitingMessage';

// Reducers - perform state transformations

import { Reducer } from 'redux';

export enum ListeningState {
    STOPPED,
    STARTING,
    STARTED,
    STOPPING
}

export const languageChangeWords: any[] = [
    { text: 'japanese', language: 'ja-JP', message: 'こんにちは、日本語を設定しました。', recognizerLanguage: 'ja-JP' },
    { text: 'tchinese', language: 'zh-hant', message: '您好，語言已經設定為繁體中文。', recognizerLanguage: 'cmn-Hant-TW' },
    { text: 'chinese', language: 'zh', message: '您好，语言已经设定为简体中文。', recognizerLanguage: 'zh' },
    { text: 'english', language: 'en-US', message: 'Hello,Language has been set to English.', recognizerLanguage: 'en-US' },
    { text: 'korean', language: 'ko-kr', message: '안녕하세요，언어가 한국어로 설정되었습니다.', recognizerLanguage: 'ko-KR' },
    { text: 'russian', language: 'ru-ru', message: 'Привет, Язык установлен на русский язык.', recognizerLanguage: 'ru-RU' },
    { text: 'thai', language: 'th-th', message: 'สวัสดีภาษาได้รับการตั้งค่าเป็นภาษาไทยแล้ว.', recognizerLanguage: 'th-TH' }
];

export const sendMessage = (text: string, from: User, locale: string) => ({
    type: 'Send_Message',
    activity: {
        type: 'message',
        text,
        from,
        locale,
        textFormat: 'plain',
        timestamp: (new Date()).toISOString()
    }} as ChatActions);

export const changeLanguageTo = (language: string, from: User, locale: string) => ({
    type: 'Change_Language',
    activity: {
        type: 'message',
        text: language,
        from,
        locale,
        textFormat: 'plain',
        timestamp: (new Date()).toISOString()
    },
    language} as ChatActions);

export const sendMenuMessage = (message: string, from: User, locale: string) => ({
    type: 'Send_Menu_Message',
    activity: {
        type: 'message',
        text: message,
        from,
        locale,
        textFormat: 'plain',
        timestamp: (new Date()).toISOString()
    },
    message,
    from
} as ChatActions);

export const resetChangeLanguage = () => ({
    type: 'Reset_Change_Language'
} as ChatActions);

export const pushQrcodeMessage = (url: string, locale: string) => ({
    type: 'Push_Qrcode_Message',
    activity: {
        id: 'qrcode',
        type: 'message',
        from: {id: null, name: 'qrcode'} as User,
        locale,
        attachments: [{
            contentType: 'image/jpg' as MediaType,
            contentUrl: url
        }] as Media[]
    }
} as ChatActions);

export const sendFiles = (files: FileList, from: User, locale: string) => ({
    type: 'Send_Message',
    activity: {
        type: 'message',
        attachments: attachmentsFromFiles(files),
        from,
        locale
    }} as ChatActions);

export const toggleMenu = () => ({
    type: 'Toggle_Menu'
} as ChatActions);

const attachmentsFromFiles = (files: FileList) => {
    const attachments: Media[] = [];
    for (let i = 0, numFiles = files.length; i < numFiles; i++) {
        const file = files[i];
        attachments.push({
            contentType: file.type as MediaType,
            contentUrl: window.URL.createObjectURL(file),
            name: file.name
        });
    }
    return attachments;
};

export const LANGUAGE_COUNT = 7;
export function checkLocale(ComparingLocale: string, ComparedLocale: string) {
    const checkGroup = [
        ['ja', 'ja-JP', 'ja-jp'],
        ['en', 'en-US', 'EN'],
        ['zh-hant', 'cmn-Hant-TW'],
        ['zh-hans', 'zh', 'zh-CN'],
        ['ko', 'ko-kr', 'ko-KR'],
        ['ru', 'ru-ru', 'ru-RU'],
        ['th', 'th-th', 'th-TH']
    ];
    return checkGroup.some(locale => locale.indexOf(ComparingLocale) >= 0 && locale.indexOf(ComparedLocale) >= 0);
}

export interface CustomSettingState {
    icon: { type: string, content: string };
    waitingMessage: WaitingMessage;
    urlToQrcode: UrlToQrcode;
    autoListenAfterSpeak: boolean;
    alwaysSpeak: boolean;
    scrollToBottom: number;
    configurable: boolean;
    showConfig: boolean;
    intervalController: IntervalController;
}

export type CustomSettingAction = {
    type: 'Set_Custom_Settings',
    icon: { type: string, content: string },
    waitingMessage: WaitingMessage,
    urlToQrcode: UrlToQrcode,
    scrollToBottom: number
} | {
    type: 'Set_Auto_Listen',
    autoListenAfterSpeak: boolean,
    alwaysSpeak: boolean
} | {
    type: 'Toggle_Always_Speak' | 'Enable_Configuration' | 'Toggle_Config'　| 'Toggle_Auto_Listen_After_Speak'
} | {
    type: 'Enable_Interval_Controller',
    store: any,
    timeInterval: number
} | {
    type: 'Set_Interval_Time',
    scale: number
};

export const customSetting: Reducer<CustomSettingState> = (
    state: CustomSettingState = {
        icon: null,
        waitingMessage: null,
        urlToQrcode: null,
        autoListenAfterSpeak: false,
        alwaysSpeak: false,
        scrollToBottom: 1,
        configurable: false,
        showConfig: false,
        intervalController: new IntervalController({})
    },
    action: CustomSettingAction
) => {
    switch (action.type) {
        case 'Set_Custom_Settings':
            return {
                ...state,
                icon: !!action.icon ? { ...action.icon, content: action.icon.content || 'chatbot' } : null,
                waitingMessage: !!action.waitingMessage ? action.waitingMessage : null,
                urlToQrcode: action.urlToQrcode,
                scrollToBottom: action.scrollToBottom
            };
        case 'Set_Auto_Listen':
            return {
                ...state,
                autoListenAfterSpeak: action.autoListenAfterSpeak,
                alwaysSpeak: action.alwaysSpeak
            };
        case 'Toggle_Always_Speak':
            return {
                ...state,
                alwaysSpeak: !state.alwaysSpeak
            };
        case 'Enable_Configuration':
            return {
                ...state,
                configurable: true
            };
        case 'Toggle_Config':
            return {
                ...state,
                showConfig: !state.showConfig
            };
        case 'Toggle_Auto_Listen_After_Speak':
            return {
                ...state,
                autoListenAfterSpeak: !state.autoListenAfterSpeak
            };
        case 'Enable_Interval_Controller':
            state.intervalController.setTimeInterval(action.timeInterval);
            state.intervalController.setStore(action.store);
            return {
                ...state
            };
        case 'Set_Interval_Time':
            state.intervalController.setTimeInterval(state.intervalController.timeInterval + action.scale);
            return {
                ...state
            };
        default:
            return state;
    }
};

export interface CustomMenuState {
    showMenu: boolean;
    menuToggleSetting: any;
    allMessages: any[];
    commonIcons: string[];
    sendMessage: string;
    activity: Activity;
}

export type CustomMenuAction = {
    type: 'Set_Custom_Menu_Setting',
    showMenu: boolean,
    menuToggleSetting: any,
    commonIcons: string[],
    allMessages: any[]
} | {
    type: 'Send_Menu_Message',
    activity: Activity,
    message: string
} | {
    type: 'Toggle_Menu'
};

export const customMenu: Reducer<CustomMenuState> = (
    state: CustomMenuState = {
        showMenu: false,
        menuToggleSetting: null,
        commonIcons: [],
        allMessages: [],
        sendMessage: null,
        activity: null
    },
    action: CustomMenuAction
) => {
    switch (action.type) {
        case 'Set_Custom_Menu_Setting':
            return {
                ...state,
                showMenu: action.showMenu,
                commonIcons: action.commonIcons,
                allMessages: action.allMessages
            };
        case 'Send_Menu_Message':
            return {
                ...state,
                activity: {
                    ...action.activity
                },
                sendMessage: action.message
            };
        case 'Toggle_Menu':
            return {
                ...state,
                showMenu: !state.showMenu
            };
        default:
            return state;
    }
};

export interface ChangeLanguageState {
    isChangingLanguage: boolean;
    recognizer: Speech.BrowserSpeechRecognizer;
    display: boolean;
    languages: string[];
}

export type ChangeLanguageAction = {
    type: 'Change_Language',
    activity: Activity
} | {
    type: 'Reset_Change_Language'
} | {
    type: 'Changed_Language' | 'Receive_Message'
} | {
    type: 'Save_Setting',
    recognizer: any
} | {
    type: 'Set_Language_Setting',
    display: boolean,
    languages: any[]
};

export const changeLanguage: Reducer<ChangeLanguageState> = (
    state: ChangeLanguageState = {
        isChangingLanguage: false,
        recognizer: null,
        display: false,
        languages: null
    },
    action: ChangeLanguageAction
) => {
    switch (action.type) {
        case 'Change_Language':
            return {
                ...state,
                isChangingLanguage: true
            };
        case 'Reset_Change_Language':
            return {
                ...state,
                isChangingLanguage: false
            };
        case 'Changed_Language':
            return {
                ...state
            };
        case 'Receive_Message':
            return {
                ...state,
                isChangingLanguage: false
            };
        case 'Save_Setting':
            return {
                ...state,
                recognizer: action.recognizer
            };
        case 'Set_Language_Setting':
            return {
                ...state,
                display: action.display,
                languages: action.languages
            };
        default:
            return state;
    }
};

export interface ShellState {
    sendTyping: boolean;
    input: string;
    listeningState: ListeningState;
    lastInputViaSpeech: boolean;
}

export type ShellAction = {
    type: 'Update_Input',
    input: string
    source: 'text' | 'speech'
} | {
    type: 'Listening_Starting'
} | {
    type: 'Listening_Start'
} | {
    type: 'Listening_Stopping'
} | {
    type: 'Listening_Stop'
} | {
    type: 'Stop_Speaking'
} |  {
    type: 'Card_Action_Clicked'
} | {
    type: 'Set_Send_Typing',
    sendTyping: boolean
} | {
    type: 'Send_Message',
    activity: Activity
}| {
    type: 'Speak_SSML',
    ssml: string,
    locale: string
    autoListenAfterSpeak: boolean
};

export const shell: Reducer<ShellState> = (
    state: ShellState = {
        input: '',
        sendTyping: false,
        listeningState: ListeningState.STOPPED,
        lastInputViaSpeech : false
    },
    action: ShellAction
) => {
    switch (action.type) {
        case 'Update_Input':
            return {
                ...state,
                input: action.input,
                lastInputViaSpeech : action.source === 'speech'
            };

        case 'Listening_Start':
            return {
                ...state,
                listeningState: ListeningState.STARTED
            };

        case 'Listening_Stop':
            return {
                ...state,
                listeningState: ListeningState.STOPPED
            };

        case 'Listening_Starting':
            return {
                ...state,
                listeningState: ListeningState.STARTING
            };

        case 'Listening_Stopping':
            return {
                ...state,
                listeningState: ListeningState.STOPPING
            };

        case 'Send_Message':
            return {
                ...state,
                input: ''
            };

        case 'Set_Send_Typing':
            return {
                ...state,
                sendTyping: action.sendTyping
            };

        case 'Card_Action_Clicked':
           return {
                ...state,
                lastInputViaSpeech : false
           };

        default:
            return state;
    }
};

export interface FormatState {
    chatTitle: boolean | string;
    locale: string;
    showUploadButton: boolean;
    strings: Strings;
    carouselMargin: number;
}

export type FormatAction = {
    type: 'Set_Chat_Title',
    chatTitle: boolean | string
} | {
    type: 'Set_Locale',
    locale: string
} | {
    type: 'Set_Measurements',
    carouselMargin: number
} | {
    type: 'Toggle_Upload_Button',
    showUploadButton: boolean
};

export const format: Reducer<FormatState> = (
    state: FormatState = {
        chatTitle: true,
        locale: 'en-us',
        showUploadButton: true,
        strings: defaultStrings,
        carouselMargin: undefined
    },
    action: FormatAction
) => {
    switch (action.type) {
        case 'Set_Chat_Title':
            return {
                ...state,
                chatTitle: typeof action.chatTitle === 'undefined' ? true : action.chatTitle
            };
        case 'Set_Locale':
            return {
                ...state,
                locale: action.locale,
                strings: strings(action.locale)
            };
        case 'Set_Measurements':
            return {
                ...state,
                carouselMargin: action.carouselMargin
            };
        case 'Toggle_Upload_Button':
            return {
                ...state,
                showUploadButton: action.showUploadButton
            };
        default:
            return state;
    }
};

export interface SizeState {
    height: number;
    width: number;
}

export interface SizeAction {
    type: 'Set_Size';
    width: number;
    height: number;
}

export const size: Reducer<SizeState> = (
    state: SizeState = {
        width: undefined,
        height: undefined
    },
    action: SizeAction
) => {
    switch (action.type) {
        case 'Set_Size':
            return {
                ...state,
                width: action.width,
                height: action.height
            };
        default:
            return state;
    }
};

export interface ConnectionState {
    connectionStatus: ConnectionStatus;
    botConnection: IBotConnection;
    selectedActivity: BehaviorSubject<ActivityOrID>;
    user: User;
    bot: User;
}

export type ConnectionAction = {
    type: 'Start_Connection',
    botConnection: IBotConnection,
    user: User,
    bot: User,
    selectedActivity: BehaviorSubject<ActivityOrID>
} | {
    type: 'Connection_Change',
    connectionStatus: ConnectionStatus
};

export const connection: Reducer<ConnectionState> = (
    state: ConnectionState = {
        connectionStatus: ConnectionStatus.Uninitialized,
        botConnection: undefined,
        selectedActivity: undefined,
        user: undefined,
        bot: undefined
    },
    action: ConnectionAction
) => {
    switch (action.type) {
        case 'Start_Connection':
            return {
                ...state,
                botConnection: action.botConnection,
                user: action.user,
                bot: action.bot,
                selectedActivity: action.selectedActivity
            };
        case 'Connection_Change':
            return {
                ...state,
                connectionStatus: action.connectionStatus
            };
        default:
            return state;
    }
};

export interface HistoryState {
    activities: Activity[];
    clientActivityBase: string;
    clientActivityCounter: number;
    selectedActivity: Activity;
    speakerStatus: boolean;
}

export type HistoryAction = {
    type: 'Receive_Message' | 'Send_Message' | 'Show_Typing' | 'Receive_Sent_Message' | 'Push_Menu_Message' | 'Push_Waiting_Message' | 'Push_Qrcode_Message',
    activity: Activity
} | {
    type: 'Send_Message_Try' | 'Send_Message_Fail' | 'Send_Message_Retry',
    clientActivityId: string
} | {
    type: 'Send_Message_Succeed'
    clientActivityId: string
    id: string
} | {
    type: 'Select_Activity',
    selectedActivity: Activity
} | {
    type: 'Take_SuggestedAction',
    message: Message
} | {
    type: 'Clear_Typing',
    id: string
} | {
    type: 'Changed_Language' | 'Sent_Menu_Message' | 'Send_Menu_Message_Fail' | 'Remove_Waiting_Message' | 'Change_Language_Fail' | 'Turn_On_Speaker'
} | {
    type: 'Change_Language',
    activity: Activity,
    language: string
};

const copyArrayWithUpdatedItem = <T>(array: T[], i: number, item: T) => [
    ...array.slice(0, i),
    item,
    ...array.slice(i + 1)
];

export const history: Reducer<HistoryState> = (
    state: HistoryState = {
        activities: [],
        clientActivityBase: Date.now().toString() + Math.random().toString().substr(1) + '.',
        clientActivityCounter: 0,
        selectedActivity: null,
        speakerStatus: false
    },
    action: HistoryAction
) => {
    konsole.log('history action', action);
    switch (action.type) {
        case 'Receive_Sent_Message': {
            if (!action.activity.channelData || !action.activity.channelData.clientActivityId || action.activity.channelData.postBack) {
            // if (action.activity.channelData && action.activity.channelData.postBack) {
                // only postBack messages don't have clientActivityId, and these shouldn't be added to the history
                return state;
            }
            const i = state.activities.findIndex(activity =>
                activity.channelData && activity.channelData.clientActivityId === action.activity.channelData.clientActivityId
            );
            if (i !== -1) {
                const activity = state.activities[i];
                return {
                    ...state,
                    activities: copyArrayWithUpdatedItem(state.activities, i, activity),
                    selectedActivity: state.selectedActivity === activity ? action.activity : state.selectedActivity
                };
            }
            // else fall through and treat this as a new message
        }
        case 'Receive_Message':
            if (state.activities.find(a => a.id === action.activity.id)) { return state; } // don't allow duplicate messages
            return {
                ...state,
                activities: [
                    ...state.activities.filter(activity => activity.type !== 'typing'),
                    action.activity,
                    ...state.activities.filter(activity => activity.from.id !== action.activity.from.id && activity.type === 'typing')
                ]
            };
        case 'Send_Message':
            return {
                ...state,
                activities: [
                    ...state.activities.filter(activity => activity.type !== 'typing'),
                    {
                        ...action.activity,
                        timestamp: (new Date()).toISOString(),
                        channelData: { clientActivityId: state.clientActivityBase + state.clientActivityCounter }
                    },
                    ...state.activities.filter(activity => activity.type === 'typing')
                ],
                clientActivityCounter: state.clientActivityCounter + 1
            };
        case 'Push_Waiting_Message':
            return {
                ...state,
                activities: [
                    ...state.activities.filter(activity => activity.type !== 'typing'),
                    action.activity,
                    ...state.activities.filter(activity => activity.from.id !== action.activity.from.id && activity.type === 'typing')
                ]
            };
        case 'Push_Qrcode_Message':
            return {
                ...state,
                activities: [
                    ...state.activities.filter(activity => activity.type !== 'typing'),
                    action.activity,
                    ...state.activities.filter(activity => activity.from.id !== action.activity.from.id && activity.type === 'typing')
                ]
            };
        case 'Remove_Waiting_Message':
            return {
                ...state,
                activities: [...state.activities.filter(activity => activity.id !== 'waitingString' && activity.id !== 'waitingImage')]
            };
        case 'Change_Language':
        case 'Changed_Language':
            return {
                ...state,
                clientActivityCounter: state.clientActivityCounter + 1
            };
        case 'Change_Language_Fail':
            return {
                ...state,
                clientActivityCounter: state.clientActivityCounter - 1
            };
        case 'Push_Menu_Message':
        case 'Sent_Menu_Message':
            return {
                ...state,
                clientActivityCounter: state.clientActivityCounter + 1
            };
        case 'Send_Menu_Message_Fail':
            return {
                ...state,
                clientActivityCounter: state.clientActivityCounter - 1
            };
        case 'Send_Message_Retry': {
            const activity = state.activities.find(activity =>
                activity.channelData && activity.channelData.clientActivityId === action.clientActivityId
            );
            const newActivity = activity.id === undefined ? activity : { ...activity, id: undefined };
            return {
                ...state,
                activities: [
                    ...state.activities.filter(activityT => activityT.type !== 'typing' && activityT !== activity),
                    newActivity,
                    ...state.activities.filter(activity => activity.type === 'typing')
                ],
                selectedActivity: state.selectedActivity === activity ? newActivity : state.selectedActivity
            };
        }
        case 'Send_Message_Succeed':
        case 'Send_Message_Fail': {
            const i = state.activities.findIndex(activity =>
                activity.channelData && activity.channelData.clientActivityId === action.clientActivityId
            );
            if (i === -1) { return state; }

            const activity = state.activities[i];
            if (activity.id && activity.id !== 'retry') { return state; }

            const newActivity = {
                ...activity,
                id: action.type === 'Send_Message_Succeed' ? action.id : null
            };
            return {
                ...state,
                activities: copyArrayWithUpdatedItem(state.activities, i, newActivity),
                clientActivityCounter: state.clientActivityCounter + 1,
                selectedActivity: state.selectedActivity === activity ? newActivity : state.selectedActivity
            };
        }
        case 'Show_Typing':
            return {
                ...state,
                activities: [
                    ...state.activities.filter(activity => activity.type !== 'typing'),
                    ...state.activities.filter(activity => activity.from.id !== action.activity.from.id && activity.type === 'typing'),
                    action.activity
                ]
            };

        case 'Clear_Typing':
            return {
                ...state,
                activities: state.activities.filter(activity => activity.id !== action.id),
                selectedActivity: state.selectedActivity && state.selectedActivity.id === action.id ? null : state.selectedActivity
            };

        case 'Select_Activity':
            if (action.selectedActivity === state.selectedActivity) { return state; }
            return {
                ...state,
                selectedActivity: action.selectedActivity
            };

        case 'Take_SuggestedAction':
            const i = state.activities.findIndex(activity => activity === action.message);
            const activity = state.activities[i];
            const newActivity = {
                ...activity,
                suggestedActions: undefined
            };
            return {
                ...state,
                activities: copyArrayWithUpdatedItem(state.activities, i, newActivity),
                selectedActivity: state.selectedActivity === activity ? newActivity : state.selectedActivity
            };
        case 'Turn_On_Speaker':
            return {
                ...state,
                speakerStatus: true
            };
        default:
            return state;
    }
};

export interface AdaptiveCardsState {
    hostConfig: HostConfig;
}

export interface AdaptiveCardsAction {
    type: 'Set_AdaptiveCardsHostConfig';
    payload: any;
}

export const adaptiveCards: Reducer<AdaptiveCardsState> = (
    state: AdaptiveCardsState = {
        hostConfig: null
    },
    action: AdaptiveCardsAction
) => {
    switch (action.type) {
        case 'Set_AdaptiveCardsHostConfig':
            return {
                ...state,
                hostConfig: action.payload && (action.payload instanceof HostConfig ? action.payload : new HostConfig(action.payload))
            };

        default:
            return state;
    }
};

export type ChatActions = ChangeLanguageAction | CustomMenuAction | CustomSettingAction | ShellAction | FormatAction | SizeAction | ConnectionAction | HistoryAction | AdaptiveCardsAction;

const nullAction = { type: null } as ChatActions;

export interface ChatState {
    adaptiveCards: AdaptiveCardsState;
    connection: ConnectionState;
    format: FormatState;
    history: HistoryState;
    shell: ShellState;
    size: SizeState;
    changeLanguage: ChangeLanguageState;
    customMenu: CustomMenuState;
    customSetting: CustomSettingState;
}

const speakFromMsg = (msg: Message, fallbackLocale: string) => {
    let speak = msg.speak;

    const localeChangeMessage = languageChangeWords.find(lcw => lcw.message === msg.text);
    if (!speak && msg.textFormat == null || msg.textFormat === 'plain') {
        speak = msg.text;
    }
    if (!speak && msg.channelData && msg.channelData.speechOutput && msg.channelData.speechOutput.speakText) {
        speak = msg.channelData.speechOutput.speakText;
    }
    if (!speak && msg.attachments && msg.attachments.length > 0) {
        for (let i = 0; i < msg.attachments.length; i++) {
            const anymsg = msg as any;
            // if (anymsg.attachments[i].content && anymsg.attachments[i].content.speak) {
            if (anymsg.attachments[i].content && anymsg.attachments[i].content.title) {
                speak = anymsg.attachments[i].content.title;
                break;
            }
        }
    }
    if (speak) {
        const urlStartAt = speak.search(/http[s]{0,1}:\/\/.*/);
        if (urlStartAt >= 0) {
            speak = speak.slice(0, urlStartAt);
        }
    }
    return {
        type : 'Speak_SSML',
        ssml: speak,
        locale: (localeChangeMessage && localeChangeMessage.language) || msg.locale || fallbackLocale,
        autoListenAfterSpeak : (msg.inputHint === 'expectingInput') || (msg.channelData && msg.channelData.botState === 'WaitingForAnswerToQuestion')
    };
};

// Epics - chain actions together with async operations

import { applyMiddleware } from 'redux';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/throttleTime';

import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

const changeLanguageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Change_Language')
    .flatMap(action => {
        const state = store.getState();
        const activity = {
            ...action.activity
        };
        if (state.history.clientActivityCounter === 1) {
            const capabilities = {
                type: 'ClientCapabilities',
                requiresBotState: true,
                supportsTts: true,
                supportsListening: true
                // Todo: consider implementing acknowledgesTts: true
            };
            (activity as any).entities = (activity as any).entities == null ? [capabilities] :  [...(activity as any).entities, capabilities];
        }
        return state.connection.botConnection.postActivity(activity)
        .map(id => ({type: 'Changed_Language'} as HistoryAction))
        .catch(error => Observable.of({ type: 'Change_Language_Fail' } as HistoryAction));
    });

const receiveChangedLanguageMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Receive_Message')
    .map( action => {
        const state = store.getState();
        const i = languageChangeWords.findIndex(word => word.message === action.activity.text);
        if (i > -1) {
            const setLanguage = languageChangeWords[i].language;
            if (state.changeLanguage.recognizer) {
                // const setRecognizerLanguage = ['zh-hant', 'th-th'].indexOf(setLanguage) >= 0 ? languageChangeWords[i].recognizerLanguage : setLanguage;
                const setRecognizerLanguage = languageChangeWords[i].recognizerLanguage;
                const recognizer = state.changeLanguage.recognizer;
                if (recognizer && typeof recognizer.setLanguage === 'function') {
                    recognizer.setLanguage(setRecognizerLanguage);
                }
            }
            // Speech.SpeechRecognizer.setSpeechRecognizer(new Speech.BrowserSpeechRecognizer(setRecognizerLanguage));
            // Speech.SpeechSynthesizer.setSpeechSynthesizer(new Speech.BrowserSpeechSynthesizer());
            return ({ type: 'Set_Locale', locale: setLanguage } as FormatAction );
        }
        return nullAction;
    });
const waitingMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType(
        'Send_Message',
        'Change_Language',
        'Send_Menu_Message'
    )
    .map( action => {
        const state = store.getState();
        let activity = {};
        if (!state.customSetting.waitingMessage || !state.customSetting.waitingMessage.type || !state.customSetting.waitingMessage.content) {
            return nullAction;
        }
        if (state.customSetting.waitingMessage) {
            const waitingMessage = state.customSetting.waitingMessage;
            if (waitingMessage.type && waitingMessage.type === 'message') {
                activity = {
                    id: 'waitingString',
                    type: 'message',
                    text: waitingMessage.content,
                    from: {id: null, name: 'waiting'},
                    locale: state.format.locale,
                    textFormat: 'plain',
                    timestamp: (new Date()).toISOString()
                };
            } else if (waitingMessage.type) {
                activity = {
                    id: 'waitingImage',
                    type: 'message',
                    from: {id: null, name: 'waiting'},
                    locale: state.format.locale,
                    attachments: [{
                        contentType: waitingMessage.type as MediaType,
                        contentUrl: waitingMessage.content
                    }] as Media[]
                };
            }
        }
        return ({type: 'Push_Waiting_Message', activity} as HistoryAction);
        // return nullAction;
    });

const turnOnSpeakerEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Push_Waiting_Message')
    .map( action => {
        return {type: 'Turn_On_Speaker'} as HistoryAction;
    });

const receiveMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType(
        'Receive_Message',
        'Reset_Change_Language'
    )
    .map( action => {
        const state = store.getState();
        if (!state.customSetting.waitingMessage || !state.customSetting.waitingMessage.type || !state.customSetting.waitingMessage.content) {
            return nullAction;
        }
        return ({type: 'Remove_Waiting_Message'} as HistoryAction);
    });
const sendMenuMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Send_Menu_Message')
    .map( action => {
        const state = store.getState();
        const allMessages = state.customMenu.allMessages.find(messages => this.checkLocale(messages.locale, state.format.locale));
        if (!allMessages) { return nullAction; }
        const message = allMessages.messages.find((message: any) => message.sendingMessage === state.customMenu.sendMessage);
        if (message && message.sendingMessage) {
            const activity = {
                id: (new Date()).toISOString(),
                ...action.activity,
                text: message.displayingMessage || message.sendingMessage,
                from: {name: 'send message bot', id: Math.random().toString()}
            };
            return ({ type: 'Push_Menu_Message', activity} as HistoryAction);
        }
        return nullAction;
    });

const pushMenuMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Push_Menu_Message')
    .flatMap( action => {
        const state = store.getState();
        const activity = {
            ...state.customMenu.activity
        };
        if (state.history.clientActivityCounter === 1) {
            const capabilities = {
                type: 'ClientCapabilities',
                requiresBotState: true,
                supportsTts: true,
                supportsListening: true
                // Todo: consider implementing acknowledgesTts: true
            };
            (activity as any).entities = (activity as any).entities == null ? [capabilities] :  [...(activity as any).entities, capabilities];
        }
        return state.connection.botConnection.postActivity(activity)
        .map(id => ({type: 'Sent_Menu_Message'} as HistoryAction))
        .catch(error => Observable.of({ type: 'Send_Menu_Message_Fail' } as HistoryAction));
    });

const sendMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Send_Message')
    .map(action => {
        const state = store.getState();
        const clientActivityId = state.history.clientActivityBase + (state.history.clientActivityCounter - 1);
        return ({ type: 'Send_Message_Try', clientActivityId } as HistoryAction);
    });

const trySendMessageEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Send_Message_Try')
    .flatMap(action => {
        const state = store.getState();
        const clientActivityId = action.clientActivityId;
        const activity = state.history.activities.find(activity => activity.channelData && activity.channelData.clientActivityId === clientActivityId);
        if (!activity) {
            konsole.log('trySendMessage: activity not found');
            return Observable.empty<HistoryAction>();
        }

        if (state.history.clientActivityCounter === 1) {
            const capabilities = {
                type: 'ClientCapabilities',
                requiresBotState: true,
                supportsTts: true,
                supportsListening: true
                // Todo: consider implementing acknowledgesTts: true
            };
            (activity as any).entities = (activity as any).entities == null ? [capabilities] :  [...(activity as any).entities, capabilities];
        }

        return state.connection.botConnection.postActivity(activity)
        .map(id => ({ type: 'Send_Message_Succeed', clientActivityId, id } as HistoryAction))
        .catch(error => Observable.of({ type: 'Send_Message_Fail', clientActivityId } as HistoryAction));
    });

const speakObservable = Observable.bindCallback<string, string, {}, {}>(Speech.SpeechSynthesizer.speak);

const speakSSMLEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Speak_SSML')
    .filter(action => action.ssml )
    .mergeMap(action => {

        let onSpeakingStarted = null;
        let onSpeakingFinished = () => nullAction;
        if (action.autoListenAfterSpeak || store.getState().customSetting.autoListenAfterSpeak) {
            onSpeakingStarted = () => Speech.SpeechRecognizer.warmup() ;
            onSpeakingFinished = () => ({ type: 'Listening_Starting' } as ShellAction);
        }

        const call$ = speakObservable(action.ssml, action.locale, onSpeakingStarted);
        return call$.map(onSpeakingFinished)
            .catch(error => Observable.of(nullAction));
    })
    .merge(action$.ofType('Speak_SSML').map(_ => ({ type: 'Listening_Stopping' } as ShellAction)));

const speakOnMessageReceivedEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Receive_Message')
    // .filter(action => (action.activity as Message) && store.getState().shell.lastInputViaSpeech)
    .filter(action => (action.activity as Message) && store.getState().history.speakerStatus && (store.getState().customSetting.alwaysSpeak || store.getState().shell.lastInputViaSpeech))
    .map(action => speakFromMsg(action.activity as Message, store.getState().format.locale) as ShellAction);

const stopSpeakingEpic: Epic<ChatActions, ChatState> = action$ =>
    action$.ofType(
        'Update_Input',
        'Listening_Starting',
        'Send_Message',
        'Card_Action_Clicked',
        'Stop_Speaking'
    )
    .do(Speech.SpeechSynthesizer.stopSpeaking)
    .map(_ => nullAction);

const stopListeningEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType(
        'Listening_Stopping',
        'Card_Action_Clicked'
    )
    .do(async () => {
        await Speech.SpeechRecognizer.stopRecognizing();

        store.dispatch({ type: 'Listening_Stop' });
    })
    .map(_ => nullAction);

const startListeningEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Listening_Starting')
    .do(async (action: ShellAction) => {
        const { history: { activities }, format: { locale } } = store.getState();
        const lastMessageActivity = [...activities].reverse().find(activity => activity.type === 'message');
        // TODO: Bump DirectLineJS version to support "listenFor" grammars
        const grammars: string[] = lastMessageActivity && (lastMessageActivity as any).listenFor;
        const onIntermediateResult = (srText: string) => { store.dispatch({ type: 'Update_Input', input: srText, source: 'speech' }); };
        const onFinalResult = (srText: string) => {
            srText = srText.replace(/^[.\s]+|[.\s]+$/g, '');
            onIntermediateResult(srText);
            store.dispatch({ type: 'Listening_Stopping' });
            store.dispatch(sendMessage(srText, store.getState().connection.user, locale));
        };
        const onAudioStreamStart = () => { store.dispatch({ type: 'Listening_Start' }); };
        const onRecognitionFailed = () => { store.dispatch({ type: 'Listening_Stopping' }); };

        await Speech.SpeechRecognizer.startRecognizing(
            locale,
            grammars,
            onIntermediateResult,
            onFinalResult,
            onAudioStreamStart,
            onRecognitionFailed
        );
    })
    .map(_ => nullAction);

const listeningSilenceTimeoutEpic: Epic<ChatActions, ChatState> = (action$, store) => {
    const cancelMessages$ = action$.ofType('Update_Input', 'Listening_Stopping');
    return action$.ofType('Listening_Start')
        .mergeMap(action =>
            Observable.of(({ type: 'Listening_Stopping' }) as ShellAction)
            .delay(5000)
            .takeUntil(cancelMessages$));
};

const retrySendMessageEpic: Epic<ChatActions, ChatState> = action$ =>
    action$.ofType('Send_Message_Retry')
    .map(action => ({ type: 'Send_Message_Try', clientActivityId: action.clientActivityId } as HistoryAction));

const updateSelectedActivityEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType(
        'Send_Message_Succeed',
        'Send_Message_Fail',
        'Show_Typing',
        'Clear_Typing'
    )
    .map(action => {
        const state = store.getState();
        if (state.connection.selectedActivity) {
            state.connection.selectedActivity.next({ activity: state.history.selectedActivity });
        }
        return nullAction;
    });

const showTypingEpic: Epic<ChatActions, ChatState> = action$ =>
    action$.ofType('Show_Typing')
    .delay(3000)
    .map(action => ({ type: 'Clear_Typing', id: action.activity.id } as HistoryAction));

const sendTypingEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Update_Input')
    .map(_ => store.getState())
    .filter(state => state.shell.sendTyping)
    .throttleTime(3000)
    .do(_ => konsole.log('sending typing'))
    .flatMap(state =>
        state.connection.botConnection.postActivity({
            type: 'typing',
            from: state.connection.user
        })
        .map(_ => nullAction)
        .catch(error => Observable.of(nullAction))
    );

// Now we put it all together into a store with middleware

import { combineReducers, createStore as reduxCreateStore, Store } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { activityWithSuggestedActions } from './activityWithSuggestedActions';
import { IntervalController } from './IntervalController';

export const createStore = () =>
    reduxCreateStore(
        combineReducers<ChatState>({
            adaptiveCards,
            connection,
            format,
            history,
            shell,
            size,
            changeLanguage,
            customMenu,
            customSetting
        }),
        applyMiddleware(createEpicMiddleware(combineEpics(
            updateSelectedActivityEpic,
            sendMessageEpic,
            trySendMessageEpic,
            retrySendMessageEpic,
            showTypingEpic,
            sendTypingEpic,
            speakSSMLEpic,
            speakOnMessageReceivedEpic,
            startListeningEpic,
            stopListeningEpic,
            stopSpeakingEpic,
            listeningSilenceTimeoutEpic,
            changeLanguageEpic,
            receiveChangedLanguageMessageEpic,
            sendMenuMessageEpic,
            pushMenuMessageEpic,
            receiveMessageEpic,
            waitingMessageEpic,
            turnOnSpeakerEpic
        )))
    );

export type ChatStore = Store<ChatState>;
