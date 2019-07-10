import * as React from 'react';
import { connect } from 'react-redux';
import { classList } from './Chat';
import { ALL_ALLOWED_LANGUAGES_MAP, ChangeLanguageState, ChatState, checkLocale, CustomSettingState } from './Store';

interface Props {
    customSetting: CustomSettingState;
    changeLanguage: ChangeLanguageState;
    toggleAlwaysSpeak: () => void;
    toggleAutoListenAfterSpeak: () => void;
    toggleConfig: () => void;
    changeUsingLanguages: (language: string, add: boolean) => void;
    // toggleAutoListenAfterSpeak: () => void;
}

class Configs extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    // tslint:disable:variable-name
    private _toggleAlwaysSpeak = this.toggleAlwaysSpeak.bind(this);
    private _toggleAutoListenAfterSpeak = this.toggleAutoListenAfterSpeak.bind(this);
    private _toggleConfig = this.toggleConfig.bind(this);
    private _handleLangaugesConfigChange = this.handleLanguagesConfigChange.bind(this);
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

    private handleLanguagesConfigChange(evt: React.FormEvent<HTMLInputElement>) {
        const targetElement = evt.target as HTMLInputElement;
        this.props.changeUsingLanguages(targetElement.value, targetElement.checked);
    }

    private createLanguageCheckbox(languageInstance: any, index: number) {
        return (
            <li key={ index }>
                <label key={ index }>
                <input type="checkbox" key={ index } value={ languageInstance.locale } checked={ languageInstance.using } onChange={ this._handleLangaugesConfigChange }/>
                    { languageInstance.text }
                </label>
            </li>
        );
    }

    render() {
        const activeLanguages = this.props.changeLanguage.languages instanceof Array && ALL_ALLOWED_LANGUAGES_MAP.map((allowedLanguage: any) => ({
                locale: allowedLanguage.locale,
                text: allowedLanguage.text,
                using: this.props.changeLanguage.languages.some(language => checkLocale(language, allowedLanguage.locale))
            })
        );
        const configsClassNames = classList(
            'wc-configs',
            !(this.props.customSetting && this.props.customSetting.showConfig) && 'wc-configs-hide'
        );
        const languagesCheckboxes = activeLanguages && activeLanguages.map((languageInstance: any, index: number) => {
            return this.createLanguageCheckbox(languageInstance, index);
        });
        return (
        <div className={ configsClassNames }>
            <div className="wc-configs-header">
                <span className="wc-configs-title">設定</span>
            </div>
            <div className="wc-configs-body">
                <p>
                    <label htmlFor="alwaysSpeakCheckbox">
                        常時読み上げ:
                    </label>
                    <input id="alwaysSpeakCheckbox" type="checkbox" onChange={ this._toggleAlwaysSpeak } checked={ !!this.props.customSetting.alwaysSpeak }/>
                </p>
                <p>
                    <label htmlFor="autoListenAfterSpeakCheckbox">
                        読み上げ後自動音声入力:
                    </label>
                    <input id="autoListenAfterSpeakCheckbox" type="checkbox" onChange={ this._toggleAutoListenAfterSpeak } checked={ !!this.props.customSetting.autoListenAfterSpeak }/>
                </p>
                {
                    !!languagesCheckboxes && <div>言語: <ul className="wc-configs-languages-field">{ languagesCheckboxes }</ul></div>
                }
            </div>
            <div className="wc-configs-footer">
                <button className="wc-configs-footer-button" onClick={ this._toggleConfig }>
                    閉じる
                </button>
            </div>
        </div>
        );
    }
}

export const Configuration = connect(
    (state: ChatState) => ({
        customSetting: state.customSetting,
        changeLanguage: state.changeLanguage
    }),
    {
        toggleAlwaysSpeak: () => ({type: 'Toggle_Always_Speak'}),
        toggleAutoListenAfterSpeak: () => ({type: 'Toggle_Auto_Listen_After_Speak'}),
        toggleConfig: () => ({type: 'Toggle_Config'}),
        changeUsingLanguages: (language: string, add: boolean) => ({type: 'Change_Using_Languages', language, add})
    },
    (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        customSetting: stateProps.customSetting,
        changeLanguage: stateProps.changeLanguage,
        toggleAlwaysSpeak: () => dispatchProps.toggleAlwaysSpeak(),
        toggleAutoListenAfterSpeak: () => dispatchProps.toggleAutoListenAfterSpeak(),
        toggleConfig: () => dispatchProps.toggleConfig(),
        changeUsingLanguages: (language: string, add: boolean) => dispatchProps.changeUsingLanguages(language, add)
    })
)(Configs);
