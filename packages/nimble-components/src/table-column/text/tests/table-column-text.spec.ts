import { html, ref } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '../../../table';
import { TableColumnText, tableColumnTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { themeProviderTag } from '../../../theme-provider';

interface SimpleTableRecord extends TableRecord {
    field?: string | null;
    anotherField?: string | null;
}

class ElementReferences {
    public table!: Table;
    public column!: TableColumnText;
}

// prettier-ignore
async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<${themeProviderTag} lang="en-US">
                <${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnTextTag} ${ref('column')} field-name="field" group-index="0">
                        Column 1
                    </${tableColumnTextTag}>
                    <${tableColumnTextTag} field-name="anotherField">
                        Squeeze Column 1
                    </${tableColumnTextTag}>
                </${tableTag}>
            </${themeProviderTag}>`,
        { source }
    );
}

describe('TableColumnText', () => {
    let table: Table<SimpleTableRecord>;
    let column: TableColumnText;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        const elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        column = elementReferences.column;
        pageObject = new TablePageObject<SimpleTableRecord>(table);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(tableColumnTextTag).toBe('nimble-table-column-text');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-text')
        ).toBeInstanceOf(TableColumnText);
    });

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        expect(column.checkValidity()).toBeTrue();
    });

    const noValueData = [
        { name: 'field not present', data: [{ unused: 'foo' }] },
        { name: 'value is null', data: [{ field: null }] },
        { name: 'value is undefined', data: [{ field: undefined }] },
        {
            name: 'value is not a string',
            data: [{ field: 10 as unknown as string }]
        }
    ] as const;
    parameterizeSpec(noValueData, (spec, name, value) => {
        spec(`displays empty string when ${name}`, async () => {
            await table.setData(value.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });
    });

    it('changing fieldName updates display', async () => {
        await table.setData([{ field: 'foo', anotherField: 'bar' }]);
        await connect();
        await waitForUpdatesAsync();

        column.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bar');
    });

    it('changing data from value to null displays blank', async () => {
        await table.setData([{ field: 'foo' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        await table.setData(updatedData);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
    });

    it('changing data from null to value displays value', async () => {
        await table.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

        await table.setData([{ field: 'foo' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        column.fieldName = undefined;
        await table.setData([{ field: 'foo' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
    });

    it('sets title when cell text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await table.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
    });

    it('does not set title when cell text is fully visible', async () => {
        const cellContents = 'short value';
        await table.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    it('removes title on mouseout of cell', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await table.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    it('sets title when group header text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await table.setData([{ field: cellContents }]);
        table.style.width = '200px';
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe(cellContents);
    });

    it('does not set title when group header text is fully visible', async () => {
        const cellContents = 'foo';
        await table.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    it('removes title on mouseout of group header', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await table.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    describe('various string values render as expected', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                await connect();

                await table.setData([{ field: name }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(name);
            });
        });
    });

    describe('various string values render in group header as expected', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                await connect();

                await table.setData([{ field: name }]);
                await waitForUpdatesAsync();

                expect(
                    pageObject.getRenderedGroupHeaderTextContent(0)
                ).toContain(name);
            });
        });
    });

    describe('placeholder', () => {
        const testCases = [
            {
                name: 'value is not specified',
                data: [{}],
                groupValue: 'No value'
            },
            {
                name: 'value is undefined',
                data: [{ field: undefined }],
                groupValue: 'No value'
            },
            {
                name: 'value is null',
                data: [{ field: null }],
                groupValue: 'No value'
            },
            {
                name: 'value is incorrect type',
                data: [{ field: 100 as unknown as string }],
                groupValue: ''
            },
            {
                name: 'value is an empty string',
                data: [{ field: '' }],
                groupValue: 'Empty'
            }
        ];

        parameterizeSpec(testCases, (spec, name, value) => {
            spec(`group row renders expected value when ${name}`, async () => {
                await table.setData(value.data);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                    value.groupValue
                );
            });
        });
    });
});
