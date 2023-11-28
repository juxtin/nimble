/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/15.2.10/packages/forms/src/directives/radio_control_value_accessor.ts
 * with the following modifications:
 * - Changed throwNameError() to throw Error instead of RuntimeError. This makes the file compile with Angular version 12.
 * - Removed now-unused import for RuntimeErrorCode and RuntimeError
 * - Updated import of ControlValueAccessor, NgControl, and NG_VALUE_ACCESSOR to pull from package export
 * - Remove all configuration from RadioControlValueAccessor's `@Directive` decorator
 * - Remove use of internal CALL_SET_DISABLED_STATE injection token, and inline default value
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef, Injectable, Injector, Input, NgModule, OnDestroy, OnInit, Renderer2} from '@angular/core';

import {BuiltInControlValueAccessor} from './control_value_accessor';
import {ControlValueAccessor, NgControl, SetDisabledStateOption} from '@angular/forms';

/* [Nimble] Do not register as a value accessor provider
export const RADIO_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioControlValueAccessor),
  multi: true
};
*/

function throwNameError() {
  /* [Nimble] RuntimeErrorCode is not exported from @angular/forms in version 12; falling back to version 12 behavior
  throw new RuntimeError(RuntimeErrorCode.NAME_AND_FORM_CONTROL_NAME_MUST_MATCH, `
  */
  throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}

/**
 * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
 * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
 * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
 * `forwardRef` logic.
 */
@NgModule()
export class RadioControlRegistryModule {
}

/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
@Injectable({providedIn: RadioControlRegistryModule})
export class RadioControlRegistry {
  private _accessors: any[] = [];

  /**
   * @description
   * Adds a control to the internal registry. For internal use only.
   */
  add(control: NgControl, accessor: RadioControlValueAccessor) {
    this._accessors.push([control, accessor]);
  }

  /**
   * @description
   * Removes a control from the internal registry. For internal use only.
   */
  remove(accessor: RadioControlValueAccessor) {
    for (let i = this._accessors.length - 1; i >= 0; --i) {
      if (this._accessors[i][1] === accessor) {
        this._accessors.splice(i, 1);
        return;
      }
    }
  }

  /**
   * @description
   * Selects a radio button. For internal use only.
   */
  select(accessor: RadioControlValueAccessor) {
    this._accessors.forEach((c) => {
      if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
        c[1].fireUncheck(accessor.value);
      }
    });
  }

  private _isSameGroup(
      controlPair: [NgControl, RadioControlValueAccessor],
      accessor: RadioControlValueAccessor): boolean {
    if (!controlPair[0].control) return false;
    // @ts-expect-error: [Nimble] Use of internal NgControl member _parent
    return controlPair[0]._parent === accessor._control._parent &&
        controlPair[1].name === accessor.name;
  }
}

/**
 * @description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
/* [Nimble] Remove all configuration from @Directive decorator
@Directive({
  selector:
      'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
  host: {'(change)': 'onChange()', '(blur)': 'onTouched()'},
  providers: [RADIO_VALUE_ACCESSOR]
})
*/
@Directive()
export class RadioControlValueAccessor extends BuiltInControlValueAccessor implements
    ControlValueAccessor, OnDestroy, OnInit {
  /** @internal */
  // TODO(issue/24571): remove '!'.
  _state!: boolean;
  /** @internal */
  // TODO(issue/24571): remove '!'.
  _control!: NgControl;
  /** @internal */
  // TODO(issue/24571): remove '!'.
  _fn!: Function;

  private setDisabledStateFired = false;

  /**
   * The registered callback function called when a change event occurs on the input element.
   * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
   * to override the `onChange` function (which expects 1 argument) in the parent
   * `BaseControlValueAccessor` class.
   * @nodoc
   */
  override onChange = () => {};

  /**
   * @description
   * Tracks the name of the radio input element.
   */
  // TODO(issue/24571): remove '!'.
  @Input() name!: string;

  /**
   * @description
   * Tracks the name of the `FormControl` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   */
  // TODO(issue/24571): remove '!'.
  @Input() formControlName!: string;

  /**
   * @description
   * Tracks the value of the radio input element
   */
  @Input() value: any;

  // [Nimble]: Can't override default behavior by injection token, because it is not exported. Inlining value of setDisabledStateDefault.
  private callSetDisabledState: SetDisabledStateOption = 'always';
      //inject(CALL_SET_DISABLED_STATE, {optional: true}) ?? setDisabledStateDefault;

  constructor(
      renderer: Renderer2, elementRef: ElementRef, private _registry: RadioControlRegistry,
      private _injector: Injector) {
    super(renderer, elementRef);
  }

  /** @nodoc */
  ngOnInit(): void {
    this._control = this._injector.get(NgControl);
    this._checkName();
    this._registry.add(this._control, this);
  }

  /** @nodoc */
  ngOnDestroy(): void {
    this._registry.remove(this);
  }

  /**
   * Sets the "checked" property value on the radio input element.
   * @nodoc
   */
  writeValue(value: any): void {
    this._state = value === this.value;
    this.setProperty('checked', this._state);
  }

  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  override registerOnChange(fn: (_: any) => {}): void {
    this._fn = fn;
    this.onChange = () => {
      fn(this.value);
      this._registry.select(this);
    };
  }

  /** @nodoc */
  override setDisabledState(isDisabled: boolean): void {
    /**
     * `setDisabledState` is supposed to be called whenever the disabled state of a control changes,
     * including upon control creation. However, a longstanding bug caused the method to not fire
     * when an *enabled* control was attached. This bug was fixed in v15 in #47576.
     *
     * This had a side effect: previously, it was possible to instantiate a reactive form control
     * with `[attr.disabled]=true`, even though the the corresponding control was enabled in the
     * model. This resulted in a mismatch between the model and the DOM. Now, because
     * `setDisabledState` is always called, the value in the DOM will be immediately overwritten
     * with the "correct" enabled value.
     *
     * However, the fix also created an exceptional case: radio buttons. Because Reactive Forms
     * models the entire group of radio buttons as a single `FormControl`, there is no way to
     * control the disabled state for individual radios, so they can no longer be configured as
     * disabled. Thus, we keep the old behavior for radio buttons, so that `[attr.disabled]`
     * continues to work. Specifically, we drop the first call to `setDisabledState` if `disabled`
     * is `false`, and we are not in legacy mode.
     */
    if (this.setDisabledStateFired || isDisabled ||
        this.callSetDisabledState === 'whenDisabledForLegacyCode') {
      this.setProperty('disabled', isDisabled);
    }
    this.setDisabledStateFired = true;
  }

  /**
   * Sets the "value" on the radio input element and unchecks it.
   *
   * @param value
   */
  fireUncheck(value: any): void {
    this.writeValue(value);
  }

  private _checkName(): void {
    if (this.name && this.formControlName && this.name !== this.formControlName &&
        // @ts-expect-error: [Nimble] ngDevMode is not defined
        (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwNameError();
    }
    if (!this.name && this.formControlName) this.name = this.formControlName;
  }
}