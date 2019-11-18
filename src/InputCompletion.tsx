import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { Completion, fetcherCodeParse } from './helpers/UserSaysFetcher';
import { ChatState, checkLocale, CustomSettingState, FormatState, sendMessage, shell, SizeState } from './Store';
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
    shell: HTMLDivElement;
    size: SizeState;

    sendMessage: (text: string) => void;
    passCompletionsLength: (length: number) => void;
}

interface FilteredResultProps {
    completions: Completion[];
    keywordMatched: boolean;
}

interface HighlyMatchedKeywordLocationProps {
    startAt: number;
    endAt: number;
}

class InputCompltionView extends React.Component<Props> {

    private inputCompletions: Completion[] = null;
    private inputCompletionBox$: HTMLDivElement = null;
    private inputCompletionContainer$: HTMLDivElement = null;
    private inputCompletionController$: HTMLDivElement = null;
    private selectedChild: HTMLDivElement = null;
    private isContainerDisplay: boolean = true;
    private tempCompletions: Completion[] = null;
    private tempKeyword: string = null;
    private tempInput: string = null;
    private completionTimeout: number = null;
    private distanceToBottom: number = 0;

    constructor(props: Props) {
        super(props);
    }

    private inputChanged = (input: string) => {
        if (!input && !this.tempInput || this.tempInput && this.tempInput === input) {
            return;
        }
        this.tempInput = input;
        window.clearTimeout(this.completionTimeout);
        if (!!input && input.length > 0) {
            const self = this;
            this.completionTimeout = window.setTimeout(
                () => self.updateInputCompletions(input), 200
            );
        } else {
            this.updateInputCompletions('');
        }
    }

    private updateInputCompletions = (input: string) => {
        this.inputCompletions = this.getInputCompletions(input);
        if (this.inputCompletions.length > 0 && this.inputCompletions.length <= INPUT_COMPLETION.COMPLETIONS_MAXIMUM) {
            this.props.passCompletionsLength(this.inputCompletions.length);
        } else {
            this.props.passCompletionsLength(0);
        }
        this.isContainerDisplay = true;
        this.forceUpdate();
    }

    private getInputCompletions = (input: string) => {
        const strict = checkLocale(this.props.locale, 'en');
        const searchedInput = strict ? input : input.replace(strict ? INPUT_COMPLETION.INPUT_FILTER_REGEX_STRICT : INPUT_COMPLETION.INPUT_FILTER_REGEX, '');
        if (!searchedInput || searchedInput.length < 1) {
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

    private filterCompletions = (data: Completion[], fullInput: string, addition: string, strict: boolean) => {
        const resultCompletions: Completion[] = [];
        let resultKeywordMatched = false;
        const matchPattern = !!addition && !!this.tempKeyword;
        data.some((completionItem: Completion) => {
            const [matched, keywordMatched] = matchPattern ? this.matchWithKeyword(completionItem, addition, strict) : this.matchWithoutKeyword(completionItem, fullInput, strict);
            if (matched) {
                resultCompletions.push(completionItem);
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

    private matchWithKeyword = (completionItem: Completion, addition: string, strict: boolean) => {
        const keywords = completionItem.keywords.toLowerCase();
        const userSay = completionItem.text.toLowerCase();
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

    private matchWithoutKeyword = (completionItem: Completion, input: string, strict: boolean) => {
        const keywords = completionItem.keywords.toLowerCase();
        const userSay = completionItem.text.toLowerCase();
        if (keywords && keywords.length > 0 && this.searchKeyword(keywords, input, strict)) {
            return [true, true];
        }
        if (userSay && userSay.length > 0 && userSay.indexOf(input) !== -1) {
            return [true, false];
        }
        return [false, false];
    }

    private highlyFilterCompletions = (data: Completion[], input: string, strict: boolean) => {
        return data.filter((completionItem: Completion) =>
            this.highlyMatch(completionItem, input.toLowerCase(), strict)
        );
    }

    private highlyMatch = (completionItem: Completion, input: string, strict: boolean) => {
        if (!strict) {
            const keywords = completionItem.keywords.toLowerCase();
            const userSay = completionItem.text.toLowerCase();
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

                    const minKeywordLength = INPUT_COMPLETION.MINIMUM_KEYWORD_LENGTH >= 2 || !strict ? INPUT_COMPLETION.MINIMUM_KEYWORD_LENGTH : 2;
                    if (matchedKeyword.length >= minKeywordLength) {
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
        } else {
            const keywords = completionItem.keywords.toLowerCase().split(INPUT_COMPLETION.KEYWORD_SEPARATOR);
            const userSay = completionItem.text.toLowerCase();
            const lowerInput = input.toLowerCase().split(' ');

            const matchedKeywords: string[] = [];
            const notMatchedKeywords: string[] = [];
            lowerInput.forEach((word: string) => {
                if (keywords.indexOf(word) !== -1) {
                    matchedKeywords.push(word);
                } else {
                    notMatchedKeywords.push(word);
                }
            });
            return !notMatchedKeywords.some((word: string) => userSay.indexOf(word) === -1);
        }
    }

    private resetTemp = () => {
        this.tempCompletions = null;
        this.tempKeyword = null;
        this.tempInput = null;
    }

    private inputCompletionsElements = (inputCompletions: Completion[]) => {
        return inputCompletions.map((completion: Completion, index: number) => {
            const userSay = completion.text;
            return <div className="wc-input-completion-item" key={ index } onClick={() => this.sendMessage(userSay)}>{ userSay }</div>;
        });
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

    componentWillUpdate(nextProps: any) {
        if (nextProps && this.props && this.props.shell && nextProps.size.width !== this.props.size.width) {
            const shellStyle = window.getComputedStyle(this.props.shell);
            this.distanceToBottom = parseFloat(shellStyle.paddingTop) + parseFloat(shellStyle.borderTopWidth) - 1;
        }
        this.inputChanged(nextProps.currentInput);
    }

    componentDidUpdate() {
        if (this.inputCompletionContainer$) {
            const containerHeight = this.inputCompletionContainer$.offsetHeight;
            const controllerHeight = this.inputCompletionController$.offsetHeight;
            const marginTop = containerHeight > INPUT_COMPLETION.CONTAINER_MAX_HEIGHT ? INPUT_COMPLETION.CONTAINER_MAX_HEIGHT : containerHeight;
            this.inputCompletionBox$.style.marginTop = ((-1) * (marginTop + controllerHeight + this.distanceToBottom)) + 'px';
            const distanceToTop = this.inputCompletionContainer$.getBoundingClientRect().top;
            if (distanceToTop < 0) {
                const afterHeight = this.inputCompletionContainer$.clientHeight + distanceToTop;
                this.inputCompletionContainer$.style.height = afterHeight + 'px';
                this.inputCompletionBox$.style.marginTop = ((-1) * (afterHeight + controllerHeight + this.distanceToBottom)) + 'px';
            }
        }
    }

    render() {
        const controllerClass = classList('wc-input-completion-controller', !this.isContainerDisplay && 'container-hide');
        const containerClass = classList('wc-input-completion-container', !this.isContainerDisplay && 'hide');
        return this.props.active && this.inputCompletions && this.inputCompletions.length > 0 && <div ref={div => this.inputCompletionBox$ = div}>
            <div className={ controllerClass } ref={ div => this.inputCompletionController$ = div } onClick={_ => this.containerToggle()}>
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
        settings: state.inputCompletion.settings,
        size: state.size
    }),
    { sendMessage },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        locale: stateProps.format.locale,
        datasets: stateProps.datasets,
        active: stateProps.active,
        currentInput: ownProps.currentInput,
        strings: stateProps.format.strings,
        settings: stateProps.settings,
        shell: ownProps.shell,
        size: stateProps.size,
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale),
        passCompletionsLength: (length: number) => ownProps.passCompletionsLength(length)
    }), {
        withRef: true
    }
)(InputCompltionView);
