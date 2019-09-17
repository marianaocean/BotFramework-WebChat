import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { fetcherCodeParse } from './helpers/UserSaysFetcher';
import { ChatState, CustomSettingState, FormatState, sendMessage } from './Store';
import { Strings } from './Strings';

interface Props {
    locale: string;
    datasets: any;
    currentInput: string;
    strings: Strings;

    sendMessage: (text: string) => void;
}

class InputCompltionView extends React.Component<Props> {

    private inputCompletionContainer$: HTMLDivElement = null;

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

    componentDidUpdate() {
        if (this.inputCompletionContainer$) {
            const containerHeight = this.inputCompletionContainer$.offsetHeight;
            const marginTop = containerHeight > 300 ? 300 : containerHeight;
            this.inputCompletionContainer$.style.marginTop = ((-1) * (marginTop + 12)) + 'px';
        }
    }

    render() {
        const containerClass = classList('wc-input-completion-container');
        const inputCompletions = this.inputCompletions(this.props.currentInput);
        return inputCompletions.length > 0 && <div ref={ div => this.inputCompletionContainer$ = div } className={ containerClass }>
            { inputCompletions.length <= 30 ? inputCompletions :
            <div className="wc-input-completion-item">
                { this.props.strings.tooManyUserSays || 'Too many matching user says, please input more for auto completion.' }({ inputCompletions.length })
            </div>}
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
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale)
    })
)(InputCompltionView);
