/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Register the custom event types used by Nimble components.
 *
 * JavaScript initializer for NimbleBlazor project, see
 * https://docs.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/?view=aspnetcore-6.0#javascript-initializers
 */
export function afterStarted(Blazor) {
    // Used by NimbleCheckbox.razor, NimbleSwitch.razor, NimbleToggleButton.razor
    // Necessary because the control's value property is always just the value 'on', so we need to look
    // at the checked property to correctly get the value.
    Blazor.registerCustomEventType('nimblecheckedchange', {
        browserEventName: 'change',
        createEventArgs: event => {
            return {
                checked: event.target.currentChecked
            };
        }
    });
    // Used by NimbleTabs.razor
    // Necessary because the tab control uses a 'change' event but not a value/currentValue property,
    // and we do want to be notified of activeid changes (via the change event) for 2-way binding support.
    Blazor.registerCustomEventType('nimbletabsactiveidchange', {
        browserEventName: 'change',
        createEventArgs: event => {
            return {
                activeId: event.target.activeid
            };
        }
    });
    // Used by NimbleMenuButton.razor
    Blazor.registerCustomEventType('nimblemenubuttontoggle', {
        browserEventName: 'toggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleMenuButton.razor
    Blazor.registerCustomEventType('nimblemenubuttonbeforetoggle', {
        browserEventName: 'beforetoggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleBanner.razor
    Blazor.registerCustomEventType('nimblebannertoggle', {
        browserEventName: 'toggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbleactionmenubeforetoggle', {
        browserEventName: 'action-menu-beforetoggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState,
                recordIds: event.detail.recordIds,
                columnId: event.detail.columnId
            };
        }
    });
    // Used by NimbleTable.razor
    Blazor.registerCustomEventType('nimbleactionmenutoggle', {
        browserEventName: 'action-menu-toggle',
        createEventArgs: event => {
            return {
                newState: event.detail.newState,
                oldState: event.detail.oldState,
                recordIds: event.detail.recordIds,
                columnId: event.detail.columnId
            };
        }
    });
}

window.NimbleBlazor = {
    Dialog: {
        show: async function (dialogReference) {
            const reason = await dialogReference.show();
            return reason === window.customElements.get('nimble-dialog').UserDismissed;
        },
        close: function (dialogReference) {
            dialogReference.close();
        }
    },
    Drawer: {
        show: async function (drawerReference) {
            const reason = await drawerReference.show();
            return reason === window.customElements.get('nimble-drawer').UserDismissed;
        },
        close: function (drawerReference) {
            drawerReference.close();
        }
    },
    Table: {
        setData: async function (tableReference, data) {
            const dataObject = JSON.parse(data);
            tableReference.setData(dataObject);
        },
        checkValidity: function (tableReference) {
            return tableReference.checkValidity();
        },
        getValidity: function (tableReference) {
            return tableReference.validity;
        }
    }
};
