import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { ChatState, CustomSettingState, FormatState } from './Store';

interface Props {
    customSetting: CustomSettingState;
    format: FormatState;
    toggleAlwaysSpeak: () => void;
    toggleAutoListenAfterSpeak: () => void;
    toggleConfig: () => void;
}

class Configs extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    // tslint:disable:variable-name
    private _toggleAlwaysSpeak = this.toggleAlwaysSpeak.bind(this);
    private _toggleAutoListenAfterSpeak = this.toggleAutoListenAfterSpeak.bind(this);
    private _toggleConfig = this.toggleConfig.bind(this);
    // tslint:enable:variable-name

    private toggleAlwaysSpeak() {
        this.props.toggleAlwaysSpeak();
    }

    private toggleAutoListenAfterSpeak() {
        this.props.toggleAutoListenAfterSpeak();
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
                        { this.props.format && this.props.format.strings.alwaysSpeak || 'always speak' }
                    </label>
                </p>
                <p>
                    <input id="autoListenAfterSpeakCheckbox" type="checkbox" onChange={ this._toggleAutoListenAfterSpeak } checked={ !!this.props.customSetting.autoListenAfterSpeak }/>
                    <label htmlFor="autoListenAfterSpeakCheckbox">
                        { this.props.format && this.props.format.strings.autoListenAfterSpeak || 'auto listen after speak' }
                    </label>
                </p>
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
        format: state.format
    }),
    {
        toggleAlwaysSpeak: () => ({type: 'Toggle_Always_Speak'}),
        toggleAutoListenAfterSpeak: () => ({type: 'Toggle_Auto_Listen_After_Speak'}),
        toggleConfig: () => ({type: 'Toggle_Config'})
    },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        customSetting: stateProps.customSetting,
        format: stateProps.format,
        toggleAlwaysSpeak: () => dispatchProps.toggleAlwaysSpeak(),
        toggleAutoListenAfterSpeak: () => dispatchProps.toggleAutoListenAfterSpeak(),
        toggleConfig: () => dispatchProps.toggleConfig()
    })
)(Configs);
