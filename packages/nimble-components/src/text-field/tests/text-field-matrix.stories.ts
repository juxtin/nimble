import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createStory,
    createFixedThemeStory,
    createMatrixThemeStory
} from '../../utilities/tests/storybook';
import { TextFieldAppearance, TextFieldType } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    ReadOnlyState,
    readOnlyStates,
    backgroundStates,
    errorStates,
    ErrorState
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import { textFieldTag } from '..';
import { buttonTag } from '../../button';
import { iconPencilTag } from '../../icons/pencil';
import { iconTagTag } from '../../icons/tag';
import { iconXmarkTag } from '../../icons/xmark';

const metadata: Meta = {
    title: 'Tests/Text Field',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        }
    }
};

export default metadata;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

const valueStates = [
    ['No Value', null, 'placeholder'],
    ['Value', 'Hello', 'placeholder']
] as const;
type ValueState = (typeof valueStates)[number];

const typeStates = [
    ['Text', TextFieldType.text],
    ['Password', TextFieldType.password]
] as const;
type TypeState = (typeof typeStates)[number];

const actionButtonStates = [
    ['', false],
    ['w/ Buttons', true]
] as const;
type ActionButtonState = (typeof actionButtonStates)[number];

const leftIconStates = [
    ['', false],
    ['w/ Icon', true]
] as const;
type LeftIconState = (typeof leftIconStates)[number];

const appearanceStates = Object.entries(TextFieldAppearance).map(
    ([key, value]) => [pascalCase(key), value]
);
type AppearanceState = (typeof appearanceStates)[number];

const fullBleedStates = [
    ['', false],
    ['Full Bleed', true]
] as const;
type FullBleedState = (typeof fullBleedStates)[number];

// prettier-ignore
const component = (
    [_readOnlyName, readonly]: ReadOnlyState,
    [_disabledName, disabled]: DisabledState,
    [_showActionButtonsName, showActionButtons]: ActionButtonState,
    [showLeftIconName, showLeftIcon]: LeftIconState,
    [errorName, errorVisible, errorText]: ErrorState,
    [typeName, type]: TypeState,
    [appearanceName, appearance]: AppearanceState,
    [fullBleedName, fullBleed]: FullBleedState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <${textFieldTag}
        style="width: 350px; padding: 8px;"
        ?full-bleed="${() => fullBleed}"
        ?disabled="${() => disabled}"
        type="${() => type}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readonly}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
    >
        ${when(() => showLeftIcon, html`<${iconTagTag} slot="start"></${iconTagTag}>`)}

        ${/* Only include states in label that are not expanded on page */ ''}
        ${() => showLeftIconName}
        ${() => errorName}
        ${() => typeName}
        ${() => appearanceName}
        ${() => fullBleedName}
        ${() => valueName}

        ${when(() => showActionButtons, html`
            <${buttonTag} slot="actions" appearance="outline" content-hidden>
                <${iconPencilTag} slot="start"></${iconPencilTag}>
                Edit
            </${buttonTag}>
            <${buttonTag} slot="actions" appearance="outline" content-hidden>
                <${iconXmarkTag} slot="start"></${iconXmarkTag}>
                Clear
            </${buttonTag}>`)}
    </${textFieldTag}>
`;

export const lightThemeEditableEnabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableEnabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableDisabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableDisabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyEnabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyEnabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyDisabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyDisabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const darkThemeEditableEnabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableEnabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableDisabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableDisabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyEnabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyEnabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyDisabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyDisabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const colorThemeEditableEnabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableEnabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableDisabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableDisabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyEnabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyEnabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyDisabledWithoutButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyDisabledWithButtons: Story = createFixedThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const hiddenTextField: Story = createStory(
    hiddenWrapper(
        html`<${textFieldTag} hidden>Hidden text field</${textFieldTag}>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${textFieldTag} value="${loremIpsum}">
                Text field
            </${textFieldTag}>
        `
    )
);

export const heightTest: Story = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${textFieldTag} style="border: 1px dashed; width: 200px">
                With Label
            </${textFieldTag}>
            <${textFieldTag} style="border: 1px dashed; width: 200px">
            </${textFieldTag}>
        </div>
    `
);
