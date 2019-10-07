import { Reducer } from 'redux';

export interface ExternalContentProps {
    targetId: string;
    contentActions: ContentActions;
}

export interface ExternalContentState {
    active: boolean;
    targetId: string;
    contentActions: ContentActions;
}

export interface ContentActions {
    init: () => void;
    sentMessage: () => void;
}

export interface ExternalContentAction {
    type: 'External_Content_Initialize';
    props: ExternalContentProps;
}

export const externalContent: Reducer<ExternalContentState> = (
    state: ExternalContentState = {
        active: false,
        contentActions: null,
        targetId: null
    },
    action: ExternalContentAction
) => {
    switch (action.type) {
        case 'External_Content_Initialize':
            if (!!action.props.contentActions && !!action.props.contentActions.init && typeof action.props.contentActions.init === 'function') {
                action.props.contentActions.init();
            }
            return {
                ...state,
                active: true,
                ...action.props
            };
        default:
            return state;
    }
};
