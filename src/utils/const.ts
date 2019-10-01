export interface InputCompletionConstsType {
    COMPLETIONS_MAXIMUM: number;
    KEYWORD_SEPARATOR: string;
    MINIMUM_KEYWORD_LENGTH: number;
    INPUT_FILTER_REGEX: RegExp;
    INPUT_FILTER_REGEX_STRICT: RegExp;

    CONTAINER_MAX_HEIGHT: number;
    SELECTED_CLASS_NAME: string;
}

const KEYWORD_SEPARATOR = ',';

export const INPUT_COMPLETION: InputCompletionConstsType = {
    // value
    COMPLETIONS_MAXIMUM: 20,
    KEYWORD_SEPARATOR,
    MINIMUM_KEYWORD_LENGTH: 2,
    INPUT_FILTER_REGEX: new RegExp(`( |　|${KEYWORD_SEPARATOR})`, 'g'),
    INPUT_FILTER_REGEX_STRICT: new RegExp(`${KEYWORD_SEPARATOR}`, 'g'),
    // component property
    CONTAINER_MAX_HEIGHT: 300,
    SELECTED_CLASS_NAME: 'selected'
};

export const rewriteConst = (consitant: any, key: any, value: any) => {
    consitant[key] = value;
};
