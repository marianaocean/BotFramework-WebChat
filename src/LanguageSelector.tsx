import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { changeLanguageTo, resetChangeLanguage } from './Store';
import { ChatState, checkLocale, LANGUAGE_COUNT } from './Store';
import { Strings } from './Strings';
import { buttonStyleCreator } from './StyleUtil';
import { Theme } from './Theme';

interface Props {
    isChangingLanguage: boolean;
    theme: Theme;
    languages: string[];
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
        const buttonSetList = [
            {
                locale: 'ja',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('japanese') } style={buttonStyle} key={i}>日<span className="responsive-hide">本語</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>日<span className="responsive-hide">本語</span></button>
            },
            {
                locale: 'en',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('english') } style={buttonStyle} key={i} >EN<span className="responsive-hide">GLISH</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>EN<span className="responsive-hide">GLISH</span></button>
            },
            {
                locale: 'zh-hant',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('tchinese') } style={buttonStyle} key={i} >繁<span className="responsive-hide">體中文</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>繁<span className="responsive-hide">體中文</span></button>
            },
            {
                locale: 'zh-hans',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('chinese') } style={buttonStyle} key={i} >简<span className="responsive-hide">体中文</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>简<span className="responsive-hide">体中文</span></button>
            },
            {
                locale: 'ko',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('korean') } style={buttonStyle} key={i} >韓<span className="responsive-hide">国語</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>韓<span className="responsive-hide">国語</span></button>
            },
            {
                locale: 'ru',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('russian') } style={buttonStyle} key={i} >Ru<span className="responsive-hide">ssian</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>Ru<span className="responsive-hide">ssian</span></button>
            },
            {
                locale: 'th',
                activeButton: (i: number) => <button onClick={ () => this.changeLanguageTo('thai') } style={buttonStyle} key={i} >Th<span className="responsive-hide">ai</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>Th<span className="responsive-hide">ai</span></button>
            }
        ];
        const displayActiveButtons: any[] = [];
        const displayDisabeldButtons: any[] = [];
        this.props.languages.forEach((lg: string, index: number) => {
            const buttonObject = buttonSetList.find(
                (bs: any) => checkLocale(bs.locale, lg)
            );
            displayActiveButtons.push(buttonObject.activeButton(index));
            displayDisabeldButtons.push(buttonObject.disabledButton(index));
        });
        return (
            <div className={ className }>
                {
                    <div className="buttons-group">
                    {
                        this.props.isChangingLanguage ? displayDisabeldButtons : displayActiveButtons
                    }
                    {
                        this.props.isChangingLanguage &&
                        <button onClick={ () => this.resetChangeLanguage() } style={buttonStyle}>
                            <span className="responsive-hide">{ this.props.strings.messageRetry }</span>
                            <span className="responsive-show">{ this.props.strings.messageRetry.slice(0, 1) }</span>
                        </button>
                    }
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
        theme: state.customSetting.theme,
        languages: state.changeLanguage.languages
    }), {
        // only used to create helper functions below
        changeLanguageTo,
        resetChangeLanguage
    }, (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // helper functions
        isChangingLanguage: stateProps.isChangingLanguage,
        strings: stateProps.strings,
        theme: stateProps.theme,
        languages: stateProps.languages,
        changeLanguageTo: (language: string) => dispatchProps.changeLanguageTo(language, stateProps.user, stateProps.locale),
        resetChangeLanguage: () => dispatchProps.resetChangeLanguage()
    }), {
        withRef: true
    }
)(LanguageSelector);
