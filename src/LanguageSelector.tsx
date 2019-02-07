import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { changeLanguageTo, resetChangeLanguage } from './Store';
import { ChatState } from './Store';
import { Strings } from './Strings';
import { buttonStyleCreator } from './StyleUtil';
import { Theme } from './Theme';

interface Props {
    isChangingLanguage: boolean;
    theme: Theme;
    changeLanguageTo: (language: string) => void;
    resetChangeLanguage: () => void;
    strings: Strings;
}

class LanguageSelector extends React.Component<Props> {

    private changeLanguageTo(language: any) {
        this.props.changeLanguageTo(language);
    }

    private resetChangeLanguage() {
        this.props.resetChangeLanguage();
    }

    render() {
        const className = classList(
            'wc-language-selector'
        );
        const buttonStyle = buttonStyleCreator(this.props.theme);
        return (
            <div className={ className }>
                {
                    this.props.isChangingLanguage ?
                    <div className="buttons-group">
                        <button className="button-disabled" disabled>EN<span className="responsive-hide">GLISH</span></button>
                        <button className="button-disabled" disabled>日<span className="responsive-hide">本語</span></button>
                        <button className="button-disabled" disabled>繁<span className="responsive-hide">體中文</span></button>
                        <button className="button-disabled" disabled>简<span className="responsive-hide">体中文</span></button>
                        <button onClick={ () => this.resetChangeLanguage() } style={buttonStyle}>
                            <span className="responsive-hide">{ this.props.strings.messageRetry }</span>
                            <span className="responsive-show">{ this.props.strings.messageRetry.slice(0, 1) }</span>
                        </button>
                    </div>
                    :
                    <div className="buttons-group">
                        <button onClick={ () => this.changeLanguageTo('english') } style={buttonStyle} >EN<span className="responsive-hide">GLISH</span></button>
                        <button onClick={ () => this.changeLanguageTo('japanese') } style={buttonStyle} >日<span className="responsive-hide">本語</span></button>
                        <button onClick={ () => this.changeLanguageTo('tchinese') } style={buttonStyle} >繁<span className="responsive-hide">體中文</span></button>
                        <button onClick={ () => this.changeLanguageTo('chinese') } style={buttonStyle} >简<span className="responsive-hide">体中文</span></button>
                    </div>
                }
            </div>
        );
    }
}

export const Languages = connect(
    (state: ChatState) => ({
        // only used to create helper functions below
        isChangingLanguage: state.changeLanguage.isChangingLanguage,
        locale: state.format.locale,
        user: state.connection.user,
        strings: state.format.strings,
        theme: state.customSetting.theme
    }), {
        // only used to create helper functions below
        changeLanguageTo,
        resetChangeLanguage
    }, (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // helper functions
        isChangingLanguage: stateProps.isChangingLanguage,
        strings: stateProps.strings,
        theme: stateProps.theme,
        changeLanguageTo: (language: string) => dispatchProps.changeLanguageTo(language, stateProps.user, stateProps.locale),
        resetChangeLanguage: () => dispatchProps.resetChangeLanguage()
    }), {
        withRef: true
    }
)(LanguageSelector);
