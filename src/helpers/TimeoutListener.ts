import { Activity } from 'botframework-directlinejs';
import { Store } from 'redux';
import { ChatActions, ChatState } from '../Store';

export enum TimeoutAlertMode {
    ONLY_MESSAGE = 0,
    CONFIRM_TO_RELOAD = 1,
    FORCE_RELOAD = 2
}

class TimeoutListener {
    private static offlineTimer: number = 0;
    private static reloadAlertTimer: number = 0;
    private static timeout: number = 15000;
    private static mode: TimeoutAlertMode = TimeoutAlertMode.ONLY_MESSAGE;
    private static isCounting: boolean = false;

    public static countDown(store: Store<ChatState>) {
        if (this.isCounting) {
            return;
        }
        this.isCounting = true;
        this.offlineTimer = window.setTimeout(
            () => this.setToTimeout(store), this.timeout
        );
    }

    public static setToTimeout(store: Store<ChatState>) {
        const state = store.getState();
        const activities = state.history.activities;
        if (this.timeoutCheck(activities) || this.isLastActivityFromUser(activities, state)) {
            const activity: Activity = {
                id: 'TimeoutAlert',
                type: 'message',
                text: state.format.strings.longtimeNoResponse || 'Bot is not responding. Please change the text and try send it again or reload the page.',
                from: {id: null, name: 'TimeoutAlert'},
                locale: state.format.locale,
                textFormat: 'plain',
                timestamp: (new Date()).toISOString()
            };
            store.dispatch({type: 'Remove_Waiting_Message'});
            store.dispatch({type: 'Timeout_Alert', activity});
            if (this.mode === TimeoutAlertMode.ONLY_MESSAGE) {
                this.isCounting = false;
                return;
            }
            const self = this;
            window.clearTimeout(this.reloadAlertTimer);
            this.reloadAlertTimer = window.setTimeout(
                () => {
                    const state = store.getState();
                    const nowActivities = state.history.activities;
                    if (this.timeoutCheck(nowActivities, true)) {
                        if (self.mode === TimeoutAlertMode.CONFIRM_TO_RELOAD &&
                            window.confirm(state.format.strings.confirmToReload || 'It seems that internet connection has been lost. Please reload the page!') || self.mode === TimeoutAlertMode.FORCE_RELOAD) {
                            location.reload();
                        }
                        self.isCounting = false;
                    }
                }, this.timeout
            );
        }
    }

    private static timeoutCheck(activities: Activity[], strict = false) {
        return activities.some((activity: Activity) => !activity.from.id && !!activity.from.name && (strict || activity.from.name !== 'offlineAlert'));
    }

    private static isLastActivityFromUser(activities: Activity[], state: ChatState) {
        return !state.customSetting.waitingMessage && activities.length > 0 && activities[activities.length - 1].from.id === state.connection.user.id;
    }

    public static initialize(mode: TimeoutAlertMode) {
        this.mode = mode;
    }

    public static countDownReset() {
        window.clearTimeout(this.offlineTimer);
        window.clearTimeout(this.reloadAlertTimer);
        this.isCounting = false;
    }

}

export { TimeoutListener };
