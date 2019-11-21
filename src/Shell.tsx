import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { InputCompletion } from './InputCompletion';
import { Speech } from './SpeechModule';
import { ChatActions, ListeningState, sendFiles, sendMessage, SpeakingState } from './Store';
import { ChatState } from './Store';
import { Strings } from './Strings';

interface Props {
    inputText: string;
    strings: Strings;
    listeningState: ListeningState;
    speakingState: SpeakingState;
    showUploadButton: boolean;
    inputCompletionActive: boolean;
    onChangeText: (inputText: string) => void;
    sendMessage: (inputText: string) => void;
    sendFiles: (files: FileList) => void;
    stopListening: () => void;
    startListening: () => void;
    stopSpeaking: () => void;
}

export interface ShellFunctions {
    focus: (appendKey?: string) => void;
}

class ShellContainer extends React.Component<Props> implements ShellFunctions {
    private wcConsole: HTMLDivElement;
    private textInput: HTMLInputElement;
    private fileInput: HTMLInputElement;
    private inputCompletion: React.Component;
    private selectedIndex: number = 0;
    private completionsLength: number = 0;

    private sendMessage() {
        if (this.props.inputText.trim().length > 0) {
            this.props.sendMessage(this.props.inputText);
        }
    }

    private handleSendButtonKeyPress(evt: React.KeyboardEvent<HTMLButtonElement>) {
        if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            this.sendMessage();

            if (this.textInput) {
                this.textInput.focus();
            }
        }
    }

    private handleUploadButtonKeyPress(evt: React.KeyboardEvent<HTMLLabelElement>) {
        if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            this.fileInput.click();
        }
    }

    private onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) > -1 && this.completionsLength > 0) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.selectedIndex === 0) {
                    this.selectedIndex = this.completionsLength;
                } else {
                    this.selectedIndex -= 1;
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex += 1;
            } else if (this.selectedIndex > 0) {
                e.preventDefault();
                this.selectedIndex = 0;
            }
            if (this.selectedIndex > this.completionsLength || this.selectedIndex < 0) {
                this.selectedIndex = 0;
            }
            (this.inputCompletion as any).selectChild(this.selectedIndex);
        }
    }

    private onKeyUp(e: React.KeyboardEvent<HTMLElement>) {
        return;
    }

    private onKeyPress(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === 'Enter') {
            if (this.selectedIndex <= 0) {
                e.preventDefault();
                this.sendMessage();
            } else {
                (this.inputCompletion as any).clickSelected();
            }
        }
    }

    private receiveCompletionsLength(length: number) {
        this.completionsLength = length;
        this.selectedIndex = 0;
    }

    private onClickSend() {
        this.sendMessage();
    }

    private onChangeFile() {
        // IE11 quirks: IE11 fire `onChange` event if we programmatically set `this.fileInput.value = null`, it should not
        if (this.fileInput.files.length) {
            this.props.sendFiles(this.fileInput.files);
            this.fileInput.value = null;
        }

        if (this.textInput) {
            this.textInput.focus();
        }
    }

    private onTextInputFocus() {
        if (this.props.listeningState === ListeningState.STARTED) {
            this.props.stopListening();
        }
    }

    private onClickMic() {
        if (this.props.listeningState === ListeningState.STARTED) {
            this.props.stopListening();
        } else if (this.props.listeningState === ListeningState.STOPPED) {
            this.props.startListening();
        }
    }

    private onClickStopSpeak() {
        if (this.props.speakingState === SpeakingState.SPEAKING) {
            this.props.stopSpeaking();
        }
    }

    public focus(appendKey?: string) {
        if (this.textInput) {
            this.textInput.focus();
        }

        if (appendKey) {
            this.props.onChangeText(this.props.inputText + appendKey);
        }
    }

    render() {
        const className = classList(
            'wc-console',
            this.props.inputText.length > 0 && 'has-text',
            this.props.showUploadButton && 'has-upload-button'
        );

        const showMicButton = this.props.listeningState !== ListeningState.STOPPED || (Speech.SpeechRecognizer.speechIsAvailable()  && !this.props.inputText.length);

        const showStopMicButton = !showMicButton && this.props.speakingState === SpeakingState.SPEAKING;

        const sendButtonClassName = classList(
            'wc-send',
            (showMicButton || showStopMicButton) && 'hidden'
        );

        const micButtonClassName = classList(
            'wc-mic',
            !showMicButton && 'hidden',
            this.props.listeningState === ListeningState.STARTED && 'active',
            this.props.listeningState !== ListeningState.STARTED && 'inactive'
        );

        const stopSpeakClassName = classList(
            'wc-stop-speak',
            !showStopMicButton && 'hidden',
            this.props.speakingState === SpeakingState.SPEAKING && 'active'
        );

        const placeholder = this.props.listeningState === ListeningState.STARTED ? this.props.strings.listeningIndicator : this.props.strings.consolePlaceholder;

        return (
            <div className={ className } ref={ div => this.wcConsole = div } >
                {
                    this.props.inputCompletionActive &&
                    <InputCompletion
                        ref={ (target: any) => this.inputCompletion = target && target.getWrappedInstance() }
                        currentInput={ this.props.inputText }
                        passCompletionsLength={(length: number) => this.receiveCompletionsLength(length)}
                        shell={ this.wcConsole }
                    >
                    </InputCompletion>
                }
                {
                    this.props.showUploadButton &&
                        <label
                            className="wc-upload"
                            htmlFor="wc-upload-input"
                            onKeyPress={ evt => this.handleUploadButtonKeyPress(evt) }
                            tabIndex={ 0 }
                        >
                            <svg>
                                <path d="M19.96 4.79m-2 0a2 2 0 0 1 4 0 2 2 0 0 1-4 0zM8.32 4.19L2.5 15.53 22.45 15.53 17.46 8.56 14.42 11.18 8.32 4.19ZM1.04 1L1.04 17 24.96 17 24.96 1 1.04 1ZM1.03 0L24.96 0C25.54 0 26 0.45 26 0.99L26 17.01C26 17.55 25.53 18 24.96 18L1.03 18C0.46 18 0 17.55 0 17.01L0 0.99C0 0.45 0.47 0 1.03 0Z" />
                            </svg>
                        </label>
                }
                {
                    this.props.showUploadButton &&
                        <input
                            id="wc-upload-input"
                            tabIndex={ -1 }
                            type="file"
                            ref={ input => this.fileInput = input }
                            multiple
                            onChange={ () => this.onChangeFile() }
                            aria-label={ this.props.strings.uploadFile }
                            role="button"
                        />
                }
                <div className="wc-textbox">
                    <input
                        type="text"
                        className="wc-shellinput"
                        ref={ input => this.textInput = input }
                        autoFocus
                        value={ this.props.inputText }
                        onChange={ _ => this.props.onChangeText(this.textInput.value) }
                        onKeyDown={ e => this.onKeyDown(e) }
                        onKeyUp={ e => this.onKeyUp(e) }
                        onKeyPress={ e => this.onKeyPress(e) }
                        onFocus={ () => this.onTextInputFocus() }
                        placeholder={ placeholder }
                        aria-label={ this.props.inputText ? null : placeholder }
                        aria-live="polite"
                    />
                </div>
                <button
                    className={ sendButtonClassName }
                    onClick={ () => this.onClickSend() }
                    aria-label={ this.props.strings.send }
                    role="button"
                    onKeyPress={ evt => this.handleSendButtonKeyPress(evt) }
                    tabIndex={ 0 }
                    type="button"
                >
                    <span className="wc-send-icon"></span>
                    <span className="wc-send-text">{ this.props.strings.send || 'Send' }</span>
                </button>
                <button
                    className={ micButtonClassName }
                    onClick={ () => this.onClickMic() }
                    aria-label={ this.props.strings.speak }
                    role="button"
                    tabIndex={ 0 }
                    type="button"
                >
                   <span className="wc-mic-icon"></span>
                   <span className="wc-mic-text">{ this.props.strings.voiceInput || 'Voice Input' }</span>
                </button>
                <button
                    className={ stopSpeakClassName }
                    onClick={ () => this.onClickStopSpeak() }
                    role="button"
                    tabIndex={ 0 }
                    type="button"
                >
                   <span className="wc-stop-speak-icon"></span>
                   <span className="wc-stop-speak-text">{ this.props.strings.stopSpeaking || 'Stop' }</span>
                </button>
            </div>
        );
    }
}

export const Shell = connect(
    (state: ChatState) => ({
        // passed down to ShellContainer
        inputText: state.shell.input,
        showUploadButton: state.format.showUploadButton,
        strings: state.format.strings,
        // only used to create helper functions below
        locale: state.format.locale,
        user: state.connection.user,
        listeningState: state.shell.listeningState,
        speakingState: state.shell.speakingState,
        fetcher: state.inputCompletion.fetcher
    }), {
        // passed down to ShellContainer
        onChangeText: (input: string) => ({ type: 'Update_Input', input, source: 'text' } as ChatActions),
        stopListening:  () => ({ type: 'Listening_Stopping' }),
        startListening:  () => ({ type: 'Listening_Starting' }),
        stopSpeaking: () => ({type: 'Stop_Speaking'}),
        // only used to create helper functions below
        sendMessage,
        sendFiles
    }, (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // from stateProps
        inputText: stateProps.inputText,
        showUploadButton: stateProps.showUploadButton,
        strings: stateProps.strings,
        listeningState: stateProps.listeningState,
        speakingState: stateProps.speakingState,
        inputCompletionActive: !!stateProps.fetcher,
        // from dispatchProps
        onChangeText: dispatchProps.onChangeText,
        // helper functions
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale),
        sendFiles: (files: FileList) => dispatchProps.sendFiles(files, stateProps.user, stateProps.locale),
        startListening: () => dispatchProps.startListening(),
        stopListening: () => dispatchProps.stopListening(),
        stopSpeaking: () => dispatchProps.stopSpeaking()
    }), {
        withRef: true
    }
)(ShellContainer);
