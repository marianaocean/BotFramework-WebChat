import { Attachment } from 'botframework-directlinejs';
import * as React from 'react';
import { AttachmentView } from './Attachment';
import { IDoCardAction } from './Chat';
import { HScroll } from './HScroll';
import * as konsole from './Konsole';
import { FormatState, SizeState } from './Store';

export interface CarouselProps {
    attachments: Attachment[];
    disabled: boolean;
    format: FormatState;
    onCardAction: IDoCardAction;
    onImageLoad: () => void;
    size: SizeState;
    showIcon: boolean;
}

export class Carousel extends React.PureComponent<CarouselProps, {}> {
    private root: HTMLDivElement;
    private hscroll: HScroll;

    constructor(props: CarouselProps) {
        super(props);
    }

    private updateContentWidth() {
        // after the attachments have been rendered, we can now measure their actual width
        let width = this.props.size.width - this.props.format.carouselMargin;

        if (this.props.showIcon) {
            width -= 40;
        }

        // important: remove any hard styling so that we can measure the natural width
        this.root.style.width = '';

        // now measure the natural offsetWidth
        if (this.root.offsetWidth > width) {
            // the content width is bigger than the space allotted, so we'll clip it to force scrolling
            this.root.style.width = width.toString() + 'px';
            // since we're scrolling, we need to show scroll buttons
            this.hscroll.updateScrollButtons();
        }
    }

    componentDidMount() {
        this.updateContentWidth();
    }

    componentDidUpdate() {
        this.updateContentWidth();
    }

    render() {
        return (
            <div className="wc-carousel" ref={ div => this.root = div }>
                <HScroll ref={ hscroll => this.hscroll = hscroll }
                    prevSvgPathData="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                    nextSvgPathData="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                    scrollUnit="item"
                >
                    <CarouselAttachments { ...this.props as CarouselAttachmentProps } />
                </HScroll>
            </div >
        );
    }
}

export interface CarouselAttachmentProps {
    attachments: Attachment[];
    disabled: boolean;
    format: FormatState;
    onCardAction: IDoCardAction;
    onImageLoad: () => void;
}

class CarouselAttachments extends React.PureComponent<CarouselAttachmentProps, {}> {
    render() {
        konsole.log('rendering CarouselAttachments');

        const { attachments, ...props } = this.props;

        return (
            <ul>
                {
                    this.props.attachments.map((attachment, index) =>
                        <li
                            className="wc-carousel-item"
                            key={ index }
                        >
                            <AttachmentView
                                attachment={ attachment }
                                disabled={ props.disabled }
                                format={ props.format }
                                onCardAction={ props.onCardAction }
                                onImageLoad={ props.onImageLoad }
                            />
                        </li>
                    )
                }
            </ul>
        );
    }
}
