import { Activity } from 'botframework-directlinejs';
import { Store } from 'redux';
import { ChatActions, ChatState } from './Store';

export interface IntervalControllerProps {
    store: Store<ChatState>;
    intervalTime: number;
}

export class IntervalController {

    private store: Store<ChatState>;
    private intervalTime: number;
    private activitiesQueue: Activity[];
    private status: boolean;
    private timer: number;

    constructor(props: IntervalControllerProps) {
        this.store = props.store;
        this.intervalTime = props.intervalTime;
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
        , this.intervalTime * 1000);
    }

    public clearAll() {
        window.clearTimeout(this.timer);
        while (this.activitiesQueue.length > 0) {
            const targetActivity = this.activitiesQueue.shift();
            this.store.dispatch<ChatActions>({type: 'Receive_Message', activity: targetActivity});
        }
        this.status = false;
    }
}
