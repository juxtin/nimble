import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { AnchorAppearance } from '../types';
import { bodyFont } from '../../theme-provider/design-tokens';
import { anchorTag } from '..';

const hrefDescription = `
To disable the control, remove the \`href\` attribute.

In addition to \`href\`, all other attributes of \`<a>\` are also supported, e.g. \`ping\`, \`target\`, \`type\`, etc.
`;

interface AnchorArgs {
    label: string;
    href: string;
    underlineHidden: boolean;
    appearance: keyof typeof AnchorAppearance;
}

const metadata: Meta<AnchorArgs> = {
    title: 'Anchor',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#link), an anchor/link widget provides an interactive reference to a resource. The target resource can be either external or local, i.e., either outside or within the current page or application.'
            }
        },
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            * {
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
        Click on the <${anchorTag}
            href=${x => (x.href !== '' ? x.href : null)}
            ?underline-hidden=${x => x.underlineHidden}
            appearance=${x => x.appearance}
        >${x => x.label}</${anchorTag}> to navigate.
    `),
    argTypes: {
        href: {
            description: hrefDescription
        },
        underlineHidden: {
            name: 'underline-hidden',
            description:
                'Causes the underline to be hidden except on hover. Set this for anchors that are not part of blocks of text.'
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Set to `prominent` to make the anchor appear in a different color than normal text.'
        }
    },
    args: {
        label: 'link',
        href: 'https://nimble.ni.dev',
        underlineHidden: false,
        appearance: 'default'
    }
};

export default metadata;

export const anchor: StoryObj<AnchorArgs> = {};
