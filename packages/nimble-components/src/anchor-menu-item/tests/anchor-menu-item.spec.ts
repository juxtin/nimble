/* eslint-disable max-classes-per-file */
import { customElement, html, ref } from '@microsoft/fast-element';
import { MenuItem as FoundationMenuItem } from '@microsoft/fast-foundation';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { AnchorMenuItem } from '..';
import type { IconCheck } from '../../icons/check';
import type { IconXmark } from '../../icons/xmark';
import type { Menu } from '../../menu';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';

@customElement('foundation-menu-item')
export class TestMenuItem extends FoundationMenuItem {}

describe('Anchor Menu Item', () => {
    describe('standalone', () => {
        class Model {
            public xmarkIcon!: IconXmark;
            public checkIcon!: IconCheck;
        }

        async function setup(source: Model): Promise<Fixture<AnchorMenuItem>> {
            return fixture<AnchorMenuItem>(
                html`<nimble-anchor-menu-item href="#">
                    <nimble-xmark-icon
                        ${ref('xmarkIcon')}
                        slot="start"
                    ></nimble-xmark-icon>
                    <nimble-check-icon
                        ${ref('checkIcon')}
                        slot="end"
                    ></nimble-check-icon>
                </nimble-anchor-menu-item>`,
                { source }
            );
        }

        let model: Model;
        let element: AnchorMenuItem;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            model = new Model();
            ({ element, connect, disconnect } = await setup(model));
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(
                document.createElement('nimble-anchor-menu-item')
            ).toBeInstanceOf(AnchorMenuItem);
        });

        it('should set the role to menuitem', async () => {
            await connect();
            expect(element.getAttribute('role')).toBe('menuitem');
        });

        it('should set aria-disabled when disabled is set', async () => {
            await connect();
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(element.ariaDisabled).toBe('true');
        });

        const attributeNames = [
            { name: 'download' },
            { name: 'href' },
            { name: 'hreflang' },
            { name: 'ping' },
            { name: 'referrerpolicy' },
            { name: 'rel' },
            { name: 'target' },
            { name: 'type' }
        ] as const;
        describe('should reflect value to the internal control', () => {
            parameterizeSpec(attributeNames, (spec, name) => {
                spec(`for attribute ${name}`, async () => {
                    await connect();

                    element.setAttribute(name, 'foo');
                    await waitForUpdatesAsync();

                    expect(element.anchor.getAttribute(name)).toBe('foo');
                });
            });
        });

        it('should expose slotted content through properties', async () => {
            await connect();
            expect(element.start.assignedElements()[0]).toBe(model.xmarkIcon);
            expect(element.end.assignedElements()[0]).toBe(model.checkIcon);
        });

        it('should set start slot visible and end slot not visible', async () => {
            await connect();
            expect(
                getComputedStyle(element.start).display === 'none'
                    || getComputedStyle(element.startContainer).display === 'none'
            ).toBeFalse();
            expect(
                getComputedStyle(element.end).display === 'none'
                    || getComputedStyle(element.endContainer).display === 'none'
            ).toBeTrue();
        });
    });

    describe('in a menu', () => {
        class Model {
            public item2!: AnchorMenuItem;
            public item3!: AnchorMenuItem;
            public item4dot2!: AnchorMenuItem;
        }

        async function setup(source: Model): Promise<Fixture<Menu>> {
            return fixture<Menu>(
                html`
                    <nimble-menu>
                        <nimble-menu-item>
                            <nimble-icon-xmark slot="start"></nimble-icon-xmark>
                            Item 1
                        </nimble-menu-item>
                        <nimble-anchor-menu-item ${ref('item2')} href="a"
                            >Item 2</nimble-anchor-menu-item
                        >
                        <nimble-anchor-menu-item ${ref('item3')} href="b"
                            >Item 3</nimble-anchor-menu-item
                        >
                        <nimble-menu-item>
                            <nimble-menu>
                                <nimble-menu-item>Item 4.1</nimble-menu-item>
                                <nimble-anchor-menu-item
                                    ${ref('item4dot2')}
                                    href="c"
                                    >Item 4.2</nimble-anchor-menu-item
                                >
                                <nimble-anchor-menu-item href="d"
                                    >Item 4.3</nimble-anchor-menu-item
                                >
                            </nimble-menu>
                            Item 4
                        </nimble-menu-item>
                    </nimble-menu>
                `,
                { source }
            );
        }

        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let model: Model;

        beforeEach(async () => {
            model = new Model();
            ({ connect, disconnect } = await setup(model));
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should have startColumnCount set by the menu', async () => {
            await connect();
            await waitForUpdatesAsync();
            expect(model.item2.startColumnCount).toBe(1);
            expect(model.item3.startColumnCount).toBe(1);
            expect(model.item4dot2.startColumnCount).toBe(0);
        });
    });
});
