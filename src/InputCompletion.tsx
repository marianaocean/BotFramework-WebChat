import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { fetcherCodeParse } from './helpers/UserSaysFetcher';
import { ChatState, CustomSettingState, FormatState, sendMessage } from './Store';
import { Strings } from './Strings';
import { INPUT_COMPLETION } from './utils/const';

interface Props {
    locale: string;
    datasets: any;
    currentInput: string;
    strings: Strings;

    sendMessage: (text: string) => void;
    passCompletionsLength: (length: number) => void;
}

class InputCompltionView extends React.Component<Props> {

    private inputCompletionBox$: HTMLDivElement = null;
    private inputCompletionContainer$: HTMLDivElement = null;
    private inputCompletionController$: HTMLDivElement = null;
    private selectedChild: HTMLDivElement = null;
    private isContainerDisplay: boolean = true;

    constructor(props: Props) {
        super(props);
    }

    private inputCompletions = (input: string) => {
        if (!input) {
            return [];
        }
        const code = fetcherCodeParse(this.props.locale);
        const data = this.props.datasets && this.props.datasets[code];
        const lowerCaseInput = input.toLocaleLowerCase();
        const result = !!data ? data.filter((text: string) => text.toLowerCase().includes(lowerCaseInput)) : [];
        return this.inputCompletionsElements(result);
    }

    private inputCompletionsElements = (inputCompletions: string[]) => {
        return inputCompletions.map((completion: string, index: number) =>
            <div className="wc-input-completion-item" key={ index } onClick={() => this.sendMessage(completion)}>{ completion }</div>
        );
    }

    private sendMessage = (text: string) => {
        this.props.sendMessage(text);
    }

    private containerToggle = () => {
        this.isContainerDisplay = !this.isContainerDisplay;
        this.forceUpdate();
    }

    public selectChild = (selectedIndex: number) => {
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
            this.selectedChild.scrollIntoView();
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
        const inputCompletions = this.inputCompletions(this.props.currentInput);
        if (inputCompletions.length > 0 && inputCompletions.length < INPUT_COMPLETION.COMPLETIONS_MAXIMUM) {
            this.props.passCompletionsLength(inputCompletions.length);
        } else {
            this.props.passCompletionsLength(0);
        }
        return inputCompletions.length > 0 && <div ref={div => this.inputCompletionBox$ = div}>
            <div className="wc-input-completion-controller" ref={ div => this.inputCompletionController$ = div } onClick={_ => this.containerToggle()}>
                <span className="wc-input-completion-controller-icon">show/hide</span>
            </div>
            <div ref={ div => this.inputCompletionContainer$ = div } className={ containerClass }>
            { inputCompletions.length <= INPUT_COMPLETION.COMPLETIONS_MAXIMUM ? inputCompletions :
                <div className="wc-input-completion-item">
                    { this.props.strings.tooManyUserSays || 'Too many matching user says, please input more for auto completion.' }({ inputCompletions.length })
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
        user: state.connection.user
    }),
    { sendMessage },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        locale: stateProps.format.locale,
        datasets: stateProps.datasets,
        currentInput: ownProps.currentInput,
        strings: stateProps.format.strings,
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale),
        passCompletionsLength: (length: number) => ownProps.passCompletionsLength(length)
    }), {
        withRef: true
    }
)(InputCompltionView);
