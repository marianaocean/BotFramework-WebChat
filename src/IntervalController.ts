import { Activity } from 'botframework-directlinejs';
import { Store } from 'redux';
import { ChatActions, ChatState } from './Store';

export interface IntervalControllerProps {
    store?: Store<ChatState>;
    timeInterval?: number;
}

export class IntervalController {

    private store: Store<ChatState>;
    public timeInterval: number;
    private activitiesQueue: Activity[];
    private status: boolean;
    private timer: number;

    constructor(props: IntervalControllerProps) {
        this.store = props.store || null;
        this.timeInterval = props.timeInterval || 0;
        this.activitiesQueue = [];
        this.status = false;
    }

    public pushActivity(activity: Activity) {
        this.activitiesQueue.push(activity);
        if (!this.status) {
            this.run();
        }
    }

    public isRunning() {
        return this.status;
    }

    private run() {
        this.status = true;
        this.shiftActivity(this.activitiesQueue);
    }

    private shiftActivity(activities: Activity[]) {
        window.clearTimeout(this.timer);
        const targetActivity = activities.shift();
        this.store.dispatch<ChatActions>({type: 'Receive_Message', activity: targetActivity});
        const self = this;
        this.timer = window.setTimeout(
            () => {
                if (activities.length === 0) {
                    self.status = false;
                } else {
                    self.shiftActivity(activities);
                }
            }
        , this.timeInterval * 1000);
    }

    public setStore(store: Store<ChatState>) {
        this.store = store;
    }

    public setTimeInterval(time: number) {
        if (time > 10) {
            this.timeInterval = 10;
        } else if (time < 0) {
            this.timeInterval = 0;
        } else {
            this.timeInterval = time;
        }
    }

    public get available() {
        return !!this.store && this.timeInterval > 0;
    }

    public get configurable() {
        return !!this.store;
    }

}
