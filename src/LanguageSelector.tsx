import * as React from 'react';
import { connect } from 'react-redux';

import { classList } from './Chat';
import { changeLanguageTo, resetChangeLanguage } from './Store';
import { ChatState, checkLocale, LANGUAGE_COUNT } from './Store';
import { Strings } from './Strings';

interface Props {
    isChangingLanguage: boolean;
    locale: string;
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
        const generateButtonClass = (locale: string) => classList(
            'wc-language-selector-button',
            checkLocale(this.props.locale, locale) && 'active'
        );
        const buttonSetList = [
            {
                locale: 'ja',
                activeButton: (i: number) => <button className={ generateButtonClass('ja') } onClick={ () => this.changeLanguageTo('japanese') } key={i}>日<span className="responsive-hide">本語</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>日<span className="responsive-hide">本語</span></button>
            },
            {
                locale: 'en',
                activeButton: (i: number) => <button className={ generateButtonClass('en') } onClick={ () => this.changeLanguageTo('english') } key={i} >EN<span className="responsive-hide">GLISH</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>EN<span className="responsive-hide">GLISH</span></button>
            },
            {
                locale: 'zh-hant',
                activeButton: (i: number) => <button className={ generateButtonClass('zh-hant') } onClick={ () => this.changeLanguageTo('tchinese') } key={i} >繁<span className="responsive-hide">體中文</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>繁<span className="responsive-hide">體中文</span></button>
            },
            {
                locale: 'zh-hans',
                activeButton: (i: number) => <button className={ generateButtonClass('zh-hans') } onClick={ () => this.changeLanguageTo('chinese') } key={i} >简<span className="responsive-hide">体中文</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>简<span className="responsive-hide">体中文</span></button>
            },
            {
                locale: 'ko',
                activeButton: (i: number) => <button className={ generateButtonClass('ko') } onClick={ () => this.changeLanguageTo('korean') } key={i} >韓<span className="responsive-hide">国語</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>韓<span className="responsive-hide">国語</span></button>
            },
            {
                locale: 'ru',
                activeButton: (i: number) => <button className={ generateButtonClass('ru') } onClick={ () => this.changeLanguageTo('russian') } key={i} >Ru<span className="responsive-hide">ssian</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>Ru<span className="responsive-hide">ssian</span></button>
            },
            {
                locale: 'th',
                activeButton: (i: number) => <button className={ generateButtonClass('th') } onClick={ () => this.changeLanguageTo('thai') } key={i} >Th<span className="responsive-hide">ai</span></button>,
                disabledButton: (i: number) => <button className="button-disabled" disabled key={i + LANGUAGE_COUNT}>Th<span className="responsive-hide">ai</span></button>
            }
        ];
        const displayActiveButtons: any[] = [];
        const displayDisabeldButtons: any[] = [];
        this.props.languages.forEach((lg: string, index: number) => {
            const buttonObject = buttonSetList.find(
                (bs: any) => checkLocale(bs.locale, lg)
            );
            if (buttonObject) {
                displayActiveButtons.push(buttonObject.activeButton(index));
                displayDisabeldButtons.push(buttonObject.disabledButton(index));
            }
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
                        <button onClick={ () => this.resetChangeLanguage() }>
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
        languages: state.changeLanguage.languages
    }), {
        // only used to create helper functions below
        changeLanguageTo,
        resetChangeLanguage
    }, (stateProps: any, dispatchProps: any, ownProps: any): Props => ({
        // helper functions
        isChangingLanguage: stateProps.isChangingLanguage,
        locale: stateProps.locale,
        strings: stateProps.strings,
        languages: stateProps.languages,
        changeLanguageTo: (language: string) => dispatchProps.changeLanguageTo(language, stateProps.user, stateProps.locale),
        resetChangeLanguage: () => dispatchProps.resetChangeLanguage()
    }), {
        withRef: true
    }
)(LanguageSelector);