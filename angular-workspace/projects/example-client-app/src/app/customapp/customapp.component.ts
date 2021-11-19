import { Component } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { DrawerLocation } from '@ni/nimble-angular';

@Component({
    selector: 'nimble-example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public drawerLocation: DrawerLocation = DrawerLocation.Right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public buttonAppearances = ButtonAppearance;
}
