import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { AnchorAppearance } from '../types';
import { bodyFont } from '../../theme-provider/design-tokens';
import { anchorTag } from '..';

const metadata: Meta = {
    title: 'Tests/Anchor',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46/specs/'
        }
    }
};

export default metadata;

const disabledStates = [
    ['', 'https://nimble.ni.dev'],
    ['Disabled', null]
] as const;
type DisabledState = (typeof disabledStates)[number];

const underlineHiddenStates = [
    ['', false],
    ['Underline Hidden', true]
] as const;
type UnderlineHiddenState = (typeof underlineHiddenStates)[number];

const appearanceStates: [string, string | undefined][] = Object.entries(
    AnchorAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

// prettier-ignore
const component = (
    [disabledName, href]: DisabledState,
    [underlineHiddenName, underlineHidden]: UnderlineHiddenState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${anchorTag}
        href=${() => href}
        ?underline-hidden="${() => underlineHidden}"
        appearance="${() => appearance}"
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${underlineHiddenName} ${appearanceName} ${disabledName} Link`}</${anchorTag}>
`;

export const anchorThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        underlineHiddenStates,
        appearanceStates
    ])
);

export const hiddenAnchor: Story = createStory(
    hiddenWrapper(html`<${anchorTag} hidden>Hidden Anchor</${anchorTag}>`)
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(html`<${anchorTag}>Link</${anchorTag}>`)
);

export const textWrapping: Story = createStory(
    // prettier-ignore
    html`
    <p style="width: 300px; border: 1px solid black">
        <style>
            * {
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
        Lorem ipsum dolor sit amet, <${anchorTag} href='#'>
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</${anchorTag}> ut aliquip ex ea commodo consequat.
    </p>
    `
);
