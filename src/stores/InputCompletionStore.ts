import { Reducer } from 'redux';
import { Epic } from 'redux-observable';
import { UserSaysFetcher } from '../helpers/UserSaysFetcher';
import { ChatActions, ChatState, nullAction } from '../Store';

export interface InputCompletionState {
    fetcher: UserSaysFetcher;
    datasets: any;
}

export type InputCompletionAction = {
    type: 'Fetch_Data'
} | {
    type: 'Set_Fetcher',
    fetcher: UserSaysFetcher
} | {
    type: 'Set_Data',
    code: string,
    data: string[]
};

export const inputCompletion: Reducer<InputCompletionState> = (
    state: InputCompletionState = {
        fetcher: null,
        datasets: null
    },
    action: InputCompletionAction
) => {
    switch (action.type) {
        case 'Fetch_Data':
            return state;
        case 'Set_Fetcher':
            return {
                ...state,
                fetcher: action.fetcher
            };
        case 'Set_Data':
            const datasets = state.datasets || {};
            datasets[action.code] = action.data;
            return {
                ...state,
                datasets
            };
        default:
            return state;
    }
};

export const fetchInputCompletionDataEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType('Set_Locale')
    .map(action => {
        const state = store.getState();
        if (state.inputCompletion.fetcher) {
            state.inputCompletion.fetcher.fetchData(action.locale);
        }
        return nullAction;
    });
