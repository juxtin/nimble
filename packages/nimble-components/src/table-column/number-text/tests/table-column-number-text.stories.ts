import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnNumberTextTag } from '..';
import {
    SharedTableArgs,
    columnOperationBehavior,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';
import { NumberTextAlignment, NumberTextFormat } from '../types';

const simpleData = [
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        age: 45.2358734623,
        favoriteNumber: Math.PI
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 42.918275125,
        favoriteNumber: 28729375089724643
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 13.5689,
        favoriteNumber: 1000
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        age: 1.238957645,
        favoriteNumber: 0
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 14.1,
        favoriteNumber: -0.00000064532623
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Number Text',
    decorators: [withActions],
    tags: ['autodocs'],
    parameters: {
        actions: {
            handles: sharedTableActions
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface NumberTextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    format: keyof typeof NumberTextFormat;
    alignment: keyof typeof NumberTextAlignment;
    decimalDigits: number;
    decimalMaximumDigits: number;
    checkValidity: () => void;
    validity: () => void;
}

const numberTextColumnDescription = `The \`nimble-table-column-number-text\` column is used to display number fields as text in the \`nimble-table\`. Numbers are formatted in a locale-specific way
based on the value of the \`lang\` token, which can be set via the [\`nimble-theme-provider\`](?path=/docs/tokens-theme-provider--docs).

${columnOperationBehavior}`;

const formatDescription = `Configures the way that the numeric value is formatted to render within the column.

<details>
    <summary>Format Options</summary>

    <ul>
        <li>\`default\`: Integers are shown with no trailing zeros, the value is limited to 6 digits, and exponential notation is used for numbers that are large (\`>= 1e6\`) or small (\`< 1e-3\`) in magnitude.
        </li>
        <li>\`decimal\`: Values as are formatted as decimal values, with a number of digits after the separator dictated by \`decimal-digits\` or \`decimal-maximum-digits\`, and never displaying exponential notation. Setting \`decimal-digits\` to \`0\`
        will display the value as an integer without a decimal separator.
        </li>
    </ul>
</details>
`;

const validityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:
-   \`invalidDecimalDigits\`: \`true\` when \`format\` is configured to \`decimal\` and \`decimal-digits\` is set to a number less than 0 or greater than 20.
-   \`invalidDecimalMaximumDigits\`: \`true\` when \`format\` is configured to \`decimal\` and \`decimal-maximum-digits\` is set to a number less than 0 or greater than 20.
-   \`decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits\`: \`true\` when \`format\` is configured to \`decimal\` and both \`decimal-digits\` and \`decimal-maximum-digits\` are set.
`;

const alignmentDescription = `Configures the alignment of the value within the column.

To improve the ability for users to visually scan values, applications should select \`right\` if it is known that the decimal separators of all values in the column will align in the given the format.

<details>
    <summary>Default Alignment</summary>

    The default alignment of the value depends on the column's configuration.
    <ul>
        <li>\`default\` format: Values are left-aligned.
        </li>
        <li>\`decimal\` format: Values are left-aligned if \`decimal-maximum-digits\` is set, otherwise right-aligned.
        </li>
    </ul>
</details>
`;

export const numberTextColumn: StoryObj<NumberTextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: numberTextColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<NumberTextColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag} field-name="firstName">
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="lastName">
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnNumberTextTag} field-name="age" format="${x => NumberTextFormat[x.format]}" alignment="${x => NumberTextAlignment[x.alignment]}" decimal-digits="${x => x.decimalDigits}" decimal-maximum-digits="${x => x.decimalMaximumDigits}">
                Age
            </${tableColumnNumberTextTag}>
            <${tableColumnNumberTextTag} field-name="favoriteNumber" format="${x => NumberTextFormat[x.format]}" alignment="${x => NumberTextAlignment[x.alignment]}" decimal-digits="${x => x.decimalDigits}" decimal-maximum-digits="${x => x.decimalMaximumDigits}">
                Favorite Number
            </${tableColumnNumberTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number`.',
            control: { type: 'none' }
        },
        format: {
            description: formatDescription,
            options: Object.keys(NumberTextFormat),
            control: { type: 'radio' }
        },
        alignment: {
            description: alignmentDescription,
            options: Object.keys(NumberTextAlignment),
            control: { type: 'radio' }
        },
        decimalDigits: {
            name: 'decimal-digits',
            description:
                "The number of decimal places to format values to when the column's `format` is configured to be `decimal`. If neither `decimal-digits` or `decimal-maximum-digits` are set, a default value of `2` is used. `decimal-digits` and `decimal-maximum-digits` cannot both be set at the same time. The value must be in the range 0 - 20 (inclusive).",
            options: [undefined, 0, 1, 2, 3],
            control: { type: 'select' }
        },
        decimalMaximumDigits: {
            name: 'decimal-maximum-digits',
            description:
                "The maximum number of decimal places to format values to when the column's `format` is configured to be `decimal`. This differs from `decimal-digits` in that trailing zeros are omitted. `decimal-digits` and `decimal-maximum-digits` cannot both be set at the same time. The value must be in the range 0 - 20 (inclusive).",
            options: [undefined, 0, 1, 2, 3, 20],
            control: { type: 'select' }
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'Returns `true` if the column configuration is valid, otherwise `false`.'
        },
        validity: {
            description: validityDescription
        }
    },
    args: {
        fieldName: undefined,
        format: 'default',
        alignment: 'default',
        decimalDigits: 2,
        decimalMaximumDigits: undefined
    }
};
