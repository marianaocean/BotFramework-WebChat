export interface InputCompletionConstsType {
    COMPLETIONS_MAXIMUM: number;
    CONTAINER_MAX_HEIGHT: number;
    SELECTED_CLASS_NAME: string;
}

export const INPUT_COMPLETION: InputCompletionConstsType = {
    // value
    COMPLETIONS_MAXIMUM: 30,

    // component property
    CONTAINER_MAX_HEIGHT: 300,
    SELECTED_CLASS_NAME: 'selected'
};

export const rewriteConst = (consitant: any, key: any, value: any) => {
    consitant[key] = value;
};
