import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { changeLanguageTo, resetChangeLanguage } from './Store';
import { ChatState } from './Store';
import { Strings } from './Strings';

interface Props {
    isChangingLanguage: boolean;
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
            'wc-language-selector',
            'wc-console'
        );
        return (
            <div className={ className }>
                <div>
                    {
                        this.props.isChangingLanguage ?
                        <div>
                            <button className="button-disabled" disabled>ENGLISH</button>
                            <button className="button-disabled" disabled>日本語</button>
                            <button className="button-disabled" disabled>繁體中文</button>
                            <button className="button-disabled" disabled>简体中文</button>
                            <button onClick={ () => this.resetChangeLanguage() }>
                                { this.props.strings.messageRetry }
                            </button>
                        </div>
                        :
                        <div>
                            <button onClick={ () => this.changeLanguageTo('english') }>ENGLISH</button>
                            <button onClick={ () => this.changeLanguageTo('japanese') }>日本語</button>
                            <button onClick={ () => this.changeLanguageTo('tchinese') }>繁體中文</button>
                            <button onClick={ () => this.changeLanguageTo('chinese') }>简体中文</button>
                        </div>
                    }
                </div>
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
        strings: state.format.strings
    }), {
        // only used to create helper functions below
        changeLanguageTo,
        resetChangeLanguage
    }, (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // helper functions
        isChangingLanguage: stateProps.isChangingLanguage,
        strings: stateProps.strings,
        changeLanguageTo: (language: string) => dispatchProps.changeLanguageTo(language, stateProps.user, stateProps.locale),
        resetChangeLanguage: () => dispatchProps.resetChangeLanguage()
    }), {
        withRef: true
    }
)(LanguageSelector);
