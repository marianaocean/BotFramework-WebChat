export interface InputCompletionConstsType {
    COMPLETIONS_MAXIMUM: number;
    SEPARATOR: string;
    KEYWORD_SEPARATOR: string;
    INPUT_FILTER_REGEX: RegExp;
    INPUT_FILTER_REGEX_STRICT: RegExp;

    CONTAINER_MAX_HEIGHT: number;
    SELECTED_CLASS_NAME: string;
}

const COMPLETION_SEPARATOR = '|';
const KEYWORD_SEPARATOR = ',';

export const INPUT_COMPLETION: InputCompletionConstsType = {
    // value
    COMPLETIONS_MAXIMUM: 15,
    SEPARATOR: COMPLETION_SEPARATOR,
    KEYWORD_SEPARATOR,
    INPUT_FILTER_REGEX: new RegExp(`( |　|\\${COMPLETION_SEPARATOR}|${KEYWORD_SEPARATOR})`, 'g'),
    INPUT_FILTER_REGEX_STRICT: new RegExp(`(\\${COMPLETION_SEPARATOR}|${KEYWORD_SEPARATOR})`, 'g'),
    // component property
    CONTAINER_MAX_HEIGHT: 300,
    SELECTED_CLASS_NAME: 'selected'
};

export const rewriteConst = (consitant: any, key: any, value: any) => {
    consitant[key] = value;
};
