import { Store } from 'redux';
import { ChatActions, ChatState } from '../Store';

export interface UserSaysFetcherProps {
    secret: string;
    store?: Store<ChatState>;
}

class UserSaysFetcher {
    private fetchTasks: string[];
    private secret: string;
    private store: Store<ChatState>;
    private isFetching: boolean;
    private fetchDelay: number;
    // private fetchEndPoint: string = 'https://input-completion.obotai.com/input_completion';
    private fetchEndPoint: string = 'http://192.168.33.10:8002/input_completion';
    constructor(props: UserSaysFetcherProps) {
        this.fetchTasks = [];
        this.secret = props.secret;
        this.store = props.store;
        this.isFetching = false;
    }

    fetchData(language: string) {
        window.clearTimeout(this.fetchDelay);
        this.fetchDelay = window.setTimeout(
            () => {
                const fetchCode = fetcherCodeParse(language);
                if (this.fetchTasks.indexOf(fetchCode) === -1) {
                    this.fetchTasks.push(fetchCode);
                    if (!this.isFetching) {
                        this.fetch();
                    }
                }
            }, 300
        );
    }

    fetch() {
        this.isFetching = true;
        const fetchCode = this.fetchTasks.shift();
        if (this.hasDataCheck(fetchCode)) {
            if (this.fetchTasks.length > 0) {
                this.fetch();
            } else {
                this.isFetching = false;
            }
            return;
        }
        const req = new XMLHttpRequest();
        req.onload = async e => {
            try {
                const response = await JSON.parse(req.response);
                this.store.dispatch<ChatActions>({type: 'Set_Data', code: fetchCode, data: response.user_says});
                if (this.fetchTasks.length > 0) {
                    this.fetch();
                } else {
                    this.isFetching = false;
                }
            } catch (err) {
                console.error('Input completion in this channel is not effective, please contact with us.');
            }
        };
        req.open('GET', `${this.fetchEndPoint}/${fetchCode}/`, true);
        req.setRequestHeader('X-SECRET-KEY', this.secret);
        req.send();
    }

    hasDataCheck(code: string) {
        const state = this.store.getState();
        if (state.inputCompletion.datasets && state.inputCompletion.datasets[code]) {
            return true;
        } else {
            return false;
        }
    }
}

const fetcherCodeParse = (code: string) => {
    switch (code) {
        case 'ja-JP':
            return 'ja';
        case 'zh-hant':
            return 'zh-tw';
        case 'zh':
            return 'zh-cn';
        case 'en-US':
            return 'en';
        case 'ko-kr':
            return 'ko';
        case 'ru-ru':
            return 'ru';
        case 'th-th':
            return 'th';
        default:
            return code;
    }
};

export {
    UserSaysFetcher,
    fetcherCodeParse
};
