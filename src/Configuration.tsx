import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { ChatState, CustomSettingState, FormatState } from './Store';
import { InputCompletionState } from './stores/InputCompletionStore';

interface Props {
    customSetting: CustomSettingState;
    format: FormatState;
    inputCompletion: InputCompletionState;
    toggleAlwaysSpeak: () => void;
    toggleAutoListenAfterSpeak: () => void;
    toggleInputCompletionStatus: () => void;
    toggleConfig: () => void;
    changeIntervalTime: (scale: number) => void;
}

class Configs extends React.Component<Props> {

    private intervalTimeChangingTimer: number = 0;

    constructor(props: Props) {
        super(props);
    }

    // tslint:disable:variable-name
    private _toggleAlwaysSpeak = this.toggleAlwaysSpeak.bind(this);
    private _toggleAutoListenAfterSpeak = this.toggleAutoListenAfterSpeak.bind(this);
    private _toggleInputCompletionStatus = this.toggleInputCompletionStatus.bind(this);
    private _toggleConfig = this.toggleConfig.bind(this);
    private _upIntervalTime = this.upIntervalTime.bind(this);
    private _downIntervalTime = this.downIntervalTime.bind(this);
    // tslint:enable:variable-name

    private toggleAlwaysSpeak() {
        this.props.toggleAlwaysSpeak();
    }

    private toggleAutoListenAfterSpeak() {
        this.props.toggleAutoListenAfterSpeak();
    }

    private toggleInputCompletionStatus() {
        this.props.toggleInputCompletionStatus();
    }

    private upIntervalTime(e: React.MouseEvent<HTMLButtonElement>) {
        this.changeIntervalTime(1, e.type);
    }

    private downIntervalTime(e: React.MouseEvent<HTMLButtonElement>) {
        this.changeIntervalTime(-1, e.type);
    }

    private changeIntervalTime(scale: number, e: string) {
        switch (e) {
            case 'mousedown':
                this.intervalTimeChangingTimer = window.setInterval(() => this.props.changeIntervalTime(scale), 150);
                break;
            case 'mouseup':
                this.props.changeIntervalTime(scale);
            case 'mouseleave':
                window.clearInterval(this.intervalTimeChangingTimer);
                break;
            default:
                break;
        }
    }

    private toggleConfig() {
        this.props.toggleConfig();
    }

    render() {
        const configsClassNames = classList(
            'wc-configs',
            !(this.props.customSetting && this.props.customSetting.showConfig) && 'wc-configs-hide'
        );
        return (
        <div className={ configsClassNames }>
            <div className="wc-configs-header">
                <span className="wc-configs-title">{ this.props.format && this.props.format.strings.config || 'Configs' }</span>
            </div>
            <div className="wc-configs-body">
                <p>
                    <input id="alwaysSpeakCheckbox" type="checkbox" onChange={ this._toggleAlwaysSpeak } checked={ !!this.props.customSetting.alwaysSpeak }/>
                    <label htmlFor="alwaysSpeakCheckbox">
                        { this.props.format && this.props.format.strings.alwaysSpeak || 'Always speak' }
                    </label>
                </p>
                <p>
                    <input id="autoListenAfterSpeakCheckbox" type="checkbox" onChange={ this._toggleAutoListenAfterSpeak } checked={ !!this.props.customSetting.autoListenAfterSpeak }/>
                    <label htmlFor="autoListenAfterSpeakCheckbox">
                        { this.props.format && this.props.format.strings.autoListenAfterSpeak || 'Auto listen after speak' }
                    </label>
                </p>
                {
                    false && this.props.customSetting.intervalController.configurable &&
                    (
                        <p>
                            <label id="timeIntervalTitle">{ this.props.format && this.props.format.strings.timeInterval || 'Time interval (s)' }</label>
                            <button className="wc-configs-interval-time-minus" onMouseDown={ this._downIntervalTime } onMouseUp={ this._downIntervalTime } onMouseLeave={ this._downIntervalTime }>-</button>
                            <label id="timeIntervalValue">{ this.props.customSetting.intervalController.timeInterval }</label>
                            <button className="wc-configs-interval-time-plus" onMouseDown={ this._upIntervalTime } onMouseUp={ this._upIntervalTime } onMouseLeave={ this._upIntervalTime }>+</button>
                        </p>
                    )
                }
                {
                    !!this.props.inputCompletion.fetcher &&
                    <p>
                        <input id="toggleInputCompletion" type="checkbox" onChange={ this._toggleInputCompletionStatus } checked={ !!this.props.inputCompletion.active }/>
                        <label htmlFor="toggleInputCompletion">
                            { this.props.format && this.props.format.strings.inputCompletion || 'Input completion' }
                        </label>
                    </p>
                }
            </div>
            <div className="wc-configs-footer">
                <button className="wc-configs-footer-button" onClick={ this._toggleConfig }>
                    { this.props.format && this.props.format.strings.close || 'close' }
                </button>
            </div>
        </div>
        );
    }
}

export const Configuration = connect(
    (state: ChatState) => ({
        customSetting: state.customSetting,
        format: state.format,
        inputCompletion: state.inputCompletion
    }),
    {
        toggleAlwaysSpeak: () => ({type: 'Toggle_Always_Speak'}),
        toggleAutoListenAfterSpeak: () => ({type: 'Toggle_Auto_Listen_After_Speak'}),
        toggleInputCompletionStatus: () => ({type: 'Toggle_Input_Completion_Status'}),
        toggleConfig: () => ({type: 'Toggle_Config'}),
        changeIntervalTime: (scale: number) => ({type: 'Set_Interval_Time', scale})
    },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        customSetting: stateProps.customSetting,
        format: stateProps.format,
        inputCompletion: stateProps.inputCompletion,
        toggleAlwaysSpeak: () => dispatchProps.toggleAlwaysSpeak(),
        toggleAutoListenAfterSpeak: () => dispatchProps.toggleAutoListenAfterSpeak(),
        toggleInputCompletionStatus: () => dispatchProps.toggleInputCompletionStatus(),
        toggleConfig: () => dispatchProps.toggleConfig(),
        changeIntervalTime: (scale: number) => dispatchProps.changeIntervalTime(scale)
    })
)(Configs);
