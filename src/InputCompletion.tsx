import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { fetcherCodeParse } from './helpers/UserSaysFetcher';
import { ChatState, checkLocale, CustomSettingState, FormatState, sendMessage } from './Store';
import { InputComlpetionSettingsProps, InputCompletionMatchMode } from './stores/InputCompletionStore';
import { Strings } from './Strings';
import { INPUT_COMPLETION } from './utils/const';

interface Props {
    locale: string;
    datasets: any;
    currentInput: string;
    strings: Strings;
    active: boolean;
    settings: InputComlpetionSettingsProps;

    sendMessage: (text: string) => void;
    passCompletionsLength: (length: number) => void;
}

interface FilteredResultProps {
    completions: string[];
    keywordMatched: boolean;
}

interface HighlyMatchedKeywordLocationProps {
    startAt: number;
    endAt: number;
}

class InputCompltionView extends React.Component<Props> {

    private inputCompletions: string[] = null;
    private inputCompletionBox$: HTMLDivElement = null;
    private inputCompletionContainer$: HTMLDivElement = null;
    private inputCompletionController$: HTMLDivElement = null;
    private selectedChild: HTMLDivElement = null;
    private isContainerDisplay: boolean = true;
    private tempCompletions: string[] = null;
    private tempKeyword: string = null;
    private tempInput: string = null;
    private completionTimeout: number = null;
    private loading: boolean = false;

    constructor(props: Props) {
        super(props);
    }

    private inputChanged = (input: string) => {
        if (!input && !this.tempInput || this.tempInput && this.tempInput === input) {
            return;
        }
        this.tempInput = input;
        const self = this;
        window.clearTimeout(this.completionTimeout);
        this.completionTimeout = window.setTimeout(
            () => self.updateInputCompletions(input), 200
        );
    }
    private updateInputCompletions = (input: string) => {
        this.inputCompletions = this.getInputCompletions(input);
        if (this.inputCompletions.length > 0 && this.inputCompletions.length <= INPUT_COMPLETION.COMPLETIONS_MAXIMUM) {
            this.props.passCompletionsLength(this.inputCompletions.length);
        } else {
            this.props.passCompletionsLength(0);
        }
        this.forceUpdate();
    }

    private getInputCompletions = (input: string) => {
        const strict = checkLocale(this.props.locale, 'en');
        const searchedInput = strict ? input : input.replace(strict ? INPUT_COMPLETION.INPUT_FILTER_REGEX_STRICT : INPUT_COMPLETION.INPUT_FILTER_REGEX, '');
        if (!searchedInput || searchedInput.length <= 1) {
            this.resetTemp();
            return [];
        }
        const code = fetcherCodeParse(this.props.locale);
        const data = this.props.datasets && this.props.datasets[code];
        if (!data) {
            this.resetTemp();
            return [];
        }
        const lowerCaseInput = searchedInput.toLocaleLowerCase();
        switch (this.props.settings.mode) {
            case InputCompletionMatchMode.KEYWORD_BASE:
                const tempKeywordIndex = lowerCaseInput.indexOf(this.tempKeyword);
                let addition: string = null;
                let isPartChanged: boolean = false;
                if (tempKeywordIndex !== -1) {
                    addition = lowerCaseInput.slice(tempKeywordIndex + this.tempKeyword.length);
                } else if (!strict && !!this.tempKeyword) {
                    let notChangedPart: string = null;
                    [isPartChanged, notChangedPart] = this.checkInputPartChanged(this.tempKeyword, lowerCaseInput);
                    if (isPartChanged && this.tempKeyword.indexOf(notChangedPart) !== -1) {
                        this.tempKeyword = notChangedPart;
                        addition = lowerCaseInput.slice(notChangedPart.length);
                    } else if (!isPartChanged) {
                        this.resetTemp();
                    }
                }
                const result = this.filterCompletions(this.tempCompletions || data, lowerCaseInput, addition, strict);
                if (result.keywordMatched && lowerCaseInput.length >= 2) {
                    this.tempKeyword = lowerCaseInput;
                    if (result.completions.length > 0) {
                        this.tempCompletions = result.completions;
                    }
                }
                return result.completions;
            case InputCompletionMatchMode.HIGHLY_MATCH:
                return this.highlyFilterCompletions(data, lowerCaseInput, strict);
            default:
                return [];
        }
    }

    private checkInputPartChanged: (before: string, after: string) => [boolean, string] = (before: string, after: string) => {
        let i = 0;
        while (i < before.length && i < after.length) {
            if (after[i] !== before[i]) {
                if (i <= 2) {
                    return [false, ''];
                }
                return [true, after.slice(0, i)];
            }
            i++;
        }
        return [true, ''];
    }

    private filterCompletions = (data: string[], fullInput: string, addition: string, strict: boolean) => {
        const resultCompletions: string[] = [];
        let resultKeywordMatched = false;
        const matchPattern = !!addition && !!this.tempKeyword;
        data.some((text: string) => {
            const [matched, keywordMatched] = matchPattern ? this.matchWithKeyword(text.toLowerCase(), addition, strict) : this.matchWithoutKeyword(text.toLowerCase(), fullInput, strict);
            if (matched) {
                resultCompletions.push(text);
            }
            if (!resultKeywordMatched && keywordMatched) {
                resultKeywordMatched = true;
            }
            return false;
        });
        return {
            completions: resultCompletions,
            keywordMatched: resultKeywordMatched
        } as FilteredResultProps;
    }

    private matchWithKeyword = (text: string, addition: string, strict: boolean) => {
        const [keywords, userSay] = this.separatedText(text, INPUT_COMPLETION.SEPARATOR);
        const keywordsExists = keywords && keywords.length > 0;
        const userSayExists = userSay && userSay.length > 0;
        if (!userSayExists) {
            return [false, false];
        }
        if (keywordsExists) {
            if (this.searchKeyword(keywords, this.tempKeyword + addition, strict)) {
                return [true, true];
            }
            if (this.searchKeyword(keywords, this.tempKeyword, strict)) {
                if (this.searchKeyword(keywords, addition, strict) || userSay.indexOf(addition) !== -1) {
                    return [true, false];
                }
            }
        }
        if (userSay.indexOf(this.tempKeyword + addition) !== -1) {
            return [true, false];
        }
        return [false, false];
    }

    private searchKeyword = (keywords: string, checkedWord: string, strict: boolean) => {
        return !strict ? keywords.indexOf(checkedWord) !== -1 : keywords.split(INPUT_COMPLETION.KEYWORD_SEPARATOR).some(word => word.toLowerCase() === checkedWord);
    }

    private matchWithoutKeyword = (text: string, input: string, strict: boolean) => {
        const [keywords, userSay] = this.separatedText(text, INPUT_COMPLETION.SEPARATOR);
        if (keywords && keywords.length > 0 && this.searchKeyword(keywords, input, strict)) {
            return [true, true];
        }
        if (userSay && userSay.length > 0 && userSay.indexOf(input) !== -1) {
            return [true, false];
        }
        return [false, false];
    }

    private highlyFilterCompletions = (data: string[], input: string, strict: boolean) => {
        return data.filter((text: string) =>
            this.highlyMatch(text, input, strict)
        );
    }

    private highlyMatch = (text: string, input: string, strict: boolean) => {
        const [keywords, userSay] = this.separatedText(text, INPUT_COMPLETION.SEPARATOR);
        const matchedKeywordLocations: HighlyMatchedKeywordLocationProps[] = [];
        for (let i = 0; i < input.length ; i ++) {
            let matchedKeyword = '';
            if (keywords.indexOf(input[i]) !== -1) {
                matchedKeyword = input[i];
                if (i < input.length - 1) {
                    const checkedWord = matchedKeyword + input[i + 1];
                    if (keywords.indexOf(checkedWord) !== -1) {
                        matchedKeyword = checkedWord;
                        let j = i + 2;
                        while (j < input.length && this.searchKeyword(keywords, matchedKeyword + input[j], strict)) {
                            matchedKeyword += input[j];
                            j ++;
                        }
                    }
                }
                // if (matchedKeyword.length >= 2) {
                if (!strict || matchedKeyword.length >= 2) {
                    matchedKeywordLocations.push({startAt: i, endAt: i + matchedKeyword.length - 1});
                    i += matchedKeyword.length - 1;
                }
            } else {
                if (userSay.indexOf(input[i]) === -1) {
                    return false;
                }
            }
        }
        const userSayCheckList: string[] = [];
        let remained: string = input;
        matchedKeywordLocations.reverse().forEach((keywordLocation: HighlyMatchedKeywordLocationProps) => {
            const last = remained.slice(keywordLocation.endAt + 1);
            if (last.length > 0) {
                userSayCheckList.push(last);
            }
            remained = remained.slice(0, keywordLocation.startAt);
        });
        if (remained.length > 0) {
            userSayCheckList.push(remained);
        }
        return !userSayCheckList.some((checkedWord: string) => {
            return userSay.indexOf(checkedWord) === -1;
        });
    }

    private separatedText = (text: string, separator: string) => {
        const separatorIndex = text.indexOf(separator);
        let keywords: string = null;
        let userSay: string = null;
        if (separatorIndex > -1) {
            keywords = text.slice(0, separatorIndex);
            userSay = text.slice(separatorIndex + 1);
        }
        return [keywords, userSay];
    }

    private resetTemp = () => {
        this.tempCompletions = null;
        this.tempKeyword = null;
    }

    private inputCompletionsElements = (inputCompletions: string[]) => {
        return inputCompletions.map((completion: string, index: number) => {
            const realCompletion = this.getRealCompletion(completion);
            return <div className="wc-input-completion-item" key={ index } onClick={() => this.sendMessage(realCompletion)}>{ realCompletion }</div>;
        });
    }

    private getRealCompletion(completion: string) {
        const separatorIndex = completion.indexOf(INPUT_COMPLETION.SEPARATOR);
        if (separatorIndex !== -1) {
            return completion.slice(separatorIndex + 1);
        }
    }

    private sendMessage = (text: string) => {
        this.props.sendMessage(text);
    }

    private containerToggle = () => {
        this.isContainerDisplay = !this.isContainerDisplay;
        this.forceUpdate();
    }

    public selectChild = (selectedIndex: number) => {
        if (!this.inputCompletionContainer$) {
            return;
        }
        const length = this.inputCompletionContainer$.children.length;
        if (selectedIndex <= length && selectedIndex > 0) {
            if (this.selectedChild === this.inputCompletionContainer$.children[selectedIndex - 1]) {
                return;
            } else {
                if (!!this.selectedChild) {
                    this.selectedChild.classList.remove(INPUT_COMPLETION.SELECTED_CLASS_NAME);
                }
                this.selectedChild = this.inputCompletionContainer$.children[selectedIndex - 1] as HTMLDivElement;
            }
            this.selectedChild.classList.add(INPUT_COMPLETION.SELECTED_CLASS_NAME);
            if (!this.isContainerDisplay) {
                this.containerToggle();
            }
            if (this.selectedChild.offsetTop + this.selectedChild.offsetHeight > this.inputCompletionContainer$.scrollTop) {
                this.selectedChild.scrollIntoView(false);
            } else if (this.selectedChild.offsetTop + this.inputCompletionContainer$.clientHeight < this.inputCompletionContainer$.scrollTop) {
                this.selectedChild.scrollIntoView();
            }
        } else if (selectedIndex === 0 && !!this.selectedChild) {
            this.selectedChild.classList.remove(INPUT_COMPLETION.SELECTED_CLASS_NAME);
            this.selectedChild = null;
        }
    }

    public clickSelected = () => {
        if (!!this.selectedChild) {
            this.selectedChild.click();
        }
    }

    componentDidUpdate() {
        if (this.inputCompletionContainer$) {
            const containerHeight = this.inputCompletionContainer$.offsetHeight;
            const controllerHeight = this.inputCompletionController$.offsetHeight;
            const marginTop = containerHeight > INPUT_COMPLETION.CONTAINER_MAX_HEIGHT ? INPUT_COMPLETION.CONTAINER_MAX_HEIGHT : containerHeight;
            this.inputCompletionBox$.style.marginTop = ((-1) * (marginTop + controllerHeight + 12)) + 'px';
        }
    }

    render() {
        const containerClass = classList('wc-input-completion-container', !this.isContainerDisplay && 'hide');
        this.inputChanged(this.props.currentInput);
        return this.props.active && this.inputCompletions && this.inputCompletions.length > 0 && <div ref={div => this.inputCompletionBox$ = div}>
            <div className="wc-input-completion-controller" ref={ div => this.inputCompletionController$ = div } onClick={_ => this.containerToggle()}>
                <span className="wc-input-completion-controller-icon"></span>
            </div>
            <div ref={ div => this.inputCompletionContainer$ = div } className={ containerClass }>
            { this.inputCompletions.length <= INPUT_COMPLETION.COMPLETIONS_MAXIMUM ? this.inputCompletionsElements(this.inputCompletions) :
                <div className="wc-input-completion-item">
                    { this.props.strings.tooManyUserSays || 'Too many matching user says, please input more for auto completion.' }({ this.inputCompletions.length })
                </div>
            }
            </div>
        </div>;
    }
}

export const InputCompletion = connect(
    (state: ChatState) => ({
        format: state.format,
        datasets: state.inputCompletion.datasets,
        active: state.inputCompletion.active,
        user: state.connection.user,
        settings: state.inputCompletion.settings
    }),
    { sendMessage },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        locale: stateProps.format.locale,
        datasets: stateProps.datasets,
        active: stateProps.active,
        currentInput: ownProps.currentInput,
        strings: stateProps.format.strings,
        settings: stateProps.settings,
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale),
        passCompletionsLength: (length: number) => ownProps.passCompletionsLength(length)
    }), {
        withRef: true
    }
)(InputCompltionView);
