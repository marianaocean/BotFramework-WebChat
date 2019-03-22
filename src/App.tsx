import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chat, ChatProps } from './Chat';
import * as konsole from './Konsole';

export type AppProps = ChatProps;
export interface ToggleProps {
    draggable: boolean;
    targetElement: HTMLDivElement;
}

export const App = (props: AppProps, container: HTMLElement, toggleProps: ToggleProps) => {
    botDiv = container;
    konsole.log('BotChat.App props', props);
    if (toggleProps && toggleProps.targetElement) {
        const toggleDiv: HTMLDivElement = toggleProps.targetElement;
        let nodeCheck = false;
        try {
            nodeCheck = document.body.contains(toggleDiv);
        } catch (error) {
            nodeCheck = false;
        }
        if (nodeCheck) {
            Array.prototype.forEach.call(toggleDiv.getElementsByTagName('div'), (thisDiv: HTMLDivElement) => {
                thisDiv.addEventListener(
                    'click',
                    () => {
                        thisDiv.classList.toggle('active');
                    }
                );
            });
            container.style.transition = 'opacity .5s';
            toggleDiv.addEventListener('click', () => {
                const computedStyle = window.getComputedStyle(botDiv, null);
                if (computedStyle.visibility === 'hidden' || computedStyle.visibility === '') {
                    botDiv.style.visibility = 'visible';
                    botDiv.style.opacity = '1';
                } else {
                    botDiv.style.visibility = 'hidden';
                    botDiv.style.opacity = '0';
                }
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (isMobile) {
                    if (botDiv.style.visibility === 'visible') {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = null;
                    }
                }
            });
        }
    }
    ReactDOM.render(React.createElement(AppContainer, props), container);
    const header = document.getElementsByClassName('wc-header');
    if (header && toggleProps && toggleProps.draggable) {
        header[0].setAttribute('style', 'cursor: default');
        header[0].setAttribute('draggable', 'true');
        header[0].addEventListener(
            'mousedown',
            (event: MouseEvent) => {
                tempX = event.clientX;
                tempY = event.clientY;
                const computedStyle = window.getComputedStyle(botDiv, null);
                botDiv.style.top = computedStyle.top;
                botDiv.style.right = computedStyle.right;
            }
        );
        header[0].addEventListener(
            'dragstart',
            (event: DragEvent) => {
                event.dataTransfer.effectAllowed = 'all';
            }
        );
        header[0].addEventListener(
            'drag',
            (event: DragEvent) => {
                if (event.clientX > 0 && event.clientY > 0) {
                    const diffX = event.clientX - tempX;
                    const diffY = event.clientY - tempY;
                    tempX = event.clientX;
                    tempY = event.clientY;
                    const top = parseFloat(getValueFromString(botDiv.style.top));
                    const right = parseFloat(getValueFromString(botDiv.style.right));
                    botDiv.style.top = (top + diffY) + 'px';
                    botDiv.style.right = (right - diffX) + 'px';
                }
            }
        );
        botDiv.addEventListener(
            'dragover', (event: DragEvent) => {
                event.preventDefault();
            }
        );
    }
};

const AppContainer = (props: AppProps) =>
    <div className="wc-app">
        <Chat { ...props } />
    </div>;

export let tempX: number = 0;
export let tempY: number = 0;
export let botDiv: HTMLElement = null;
export let headerDiv: HTMLElement = null;

export const getValueFromString = (str: string) => {
    if (str) {
        const result = str.match(/^[0-9.-]+/);
        if (result) {
            return result[0];
        }
    }
    return null;
};
