import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TableColumnText } from '@ni/nimble-components/dist/esm/table-column/text';
import { NimbleTableColumnBaseDirective } from '../base/nimble-table-column-base.directive';
import { NumberValueOrAttribute, toNullableNumberProperty } from '../../utilities/template-value-helpers';

export type { TableColumnText };

/**
 * Directive to provide Angular integration for the table column element for text.
 */
@Directive({
    selector: 'nimble-table-column-text'
})
export class NimbleTableColumnTextDirective extends NimbleTableColumnBaseDirective<TableColumnText> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get fractionalWidth(): number | null | undefined {
        return this.elementRef.nativeElement.fractionalWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('fractional-width') public set fractionalWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', toNullableNumberProperty(value));
    }

    public get minPixelWidth(): number | null | undefined {
        return this.elementRef.nativeElement.minPixelWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('min-pixel-width') public set minPixelWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', toNullableNumberProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnText>) {
        super(renderer, elementRef);
    }
}
