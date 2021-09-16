import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    borderColorHover,
    borderWidth,
    contentFontColor,
    contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    fontFamily,
    popupBorderColor,
    popupBoxShadowColor,
    smallDelay
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')} :host {
        box-sizing: border-box;
        color: ${contentFontColor};
        font-family: ${fontFamily};
        height: ${controlHeight};
        position: relative;
        user-select: none;
        min-width: 250px;
        outline: none;
        vertical-align: top;
    }

    .listbox {
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        left: 0;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        z-index: 1;
        padding: 4px;
        box-shadow: 0px 3px 3px ${popupBoxShadowColor};
        border: 1px solid ${popupBorderColor};
        background-color: ${applicationBackgroundColor};
        background-clip: padding-box;
    }

    .listbox[hidden] {
        display: none;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: ${contentFontSize};
        font-family: inherit;
        min-height: 100%;
        width: 100%;
        border-bottom: ${borderWidth} solid ${contentFontColorDisabled};
        background-color: transparent;
        padding-left: 8px;
        padding-bottom: 1px;
    }

    :host([disabled]) .control {
        cursor: default;
    }

    :host(.open:not(:hover)) .control {
        border-bottom: ${borderWidth} solid ${borderColorHover};
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
    }

    :host(:hover) .control {
        border-bottom: 2px solid ${borderColorHover};
        padding-bottom: 0px;
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
    }

    :host([disabled]) .control,
    :host([disabled]) .control:hover {
        border-bottom: ${borderWidth} solid ${contentFontColorDisabled};
        color: ${contentFontColorDisabled};
    }

    :host([open][position='above']) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    :host([open][position='below']) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    :host([open][position='above']) .listbox {
        bottom: ${controlHeight};
    }

    :host([open][position='below']) .listbox {
        top: calc(${controlHeight} + 3px);
    }

    .selected-value {
        flex: 1 1 auto;
        font-family: inherit;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .indicator {
        flex: 0 0 auto;
        margin-inline-start: 1em;
        padding-right: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indicator slot[name='indicator'] svg {
        width: 1em;
        height: 1em;
        fill: ${contentFontColor};
    }

    :host([disabled]) .indicator slot[name='indicator'] svg {
        fill: ${contentFontColorDisabled};
    }

    slot[name='listbox'] {
        display: none;
        width: 100%;
    }

    :host([open]) slot[name='listbox'] {
        display: flex;
        position: absolute;
    }

    .end {
        margin-inline-start: auto;
    }

    ::slotted([role='option']),
    ::slotted(option) {
        flex: 0 0 auto;
    }
`;