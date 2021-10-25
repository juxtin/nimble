import { settings16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'settings' icon
 */
export class SettingsIcon extends Icon {
    public constructor() {
        super(settings16X16);
    }
}

registerIcon('settings-icon', SettingsIcon);