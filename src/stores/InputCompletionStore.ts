import { Reducer } from 'redux';
import { Epic } from 'redux-observable';
import { UserSaysFetcher } from '../helpers/UserSaysFetcher';
import { ChatActions, ChatState, nullAction } from '../Store';

export enum InputCompletionMatchMode {
    TEXT_ONLY,
    KEYWORD_BASE,
    SMART,
    HIGHLY_MATCH
}

export interface InputComlpetionSettingsProps {
    mode: InputCompletionMatchMode;
}

export interface InputCompletionState {
    fetcher: UserSaysFetcher;
    datasets: any;
    settings: InputComlpetionSettingsProps;
    active: boolean;
}

export type InputCompletionAction = {
    type: 'Fetch_Data' | 'Toggle_Input_Completion_Status'
} | {
    type: 'Input_Completion_Initialize',
    fetcher: UserSaysFetcher,
    active: boolean
} | {
    type: 'Set_Data',
    code: string,
    data: string[]
};

export const inputCompletion: Reducer<InputCompletionState> = (
    state: InputCompletionState = {
        fetcher: null,
        datasets: null,
        settings: { mode: InputCompletionMatchMode.HIGHLY_MATCH },
        active: true
    },
    action: InputCompletionAction
) => {
    switch (action.type) {
        case 'Fetch_Data':
            return state;
        case 'Input_Completion_Initialize':
            return {
                ...state,
                fetcher: action.fetcher,
                active: action.active
            };
        case 'Set_Data':
            const datasets = state.datasets || {};
            datasets[action.code] = action.data;
            return {
                ...state,
                datasets
            };
        case 'Toggle_Input_Completion_Status':
            return {
                ...state,
                active: !state.active
            };
        default:
            return state;
    }
};

export const fetchInputCompletionDataEpic: Epic<ChatActions, ChatState> = (action$, store) =>
    action$.ofType(
        'Set_Locale',
        'Toggle_Input_Completion_Status'
    )
    .map(action => {
        const state = store.getState();
        if (state.inputCompletion.fetcher && !!state.inputCompletion.active) {
            state.inputCompletion.fetcher.fetchData(action.locale || state.format.locale);
        }
        return nullAction;
    });
