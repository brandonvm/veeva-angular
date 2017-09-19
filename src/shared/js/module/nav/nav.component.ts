import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-nav',
    templateUrl: '../shared/js/module/nav/nav.component.html'
})
export class NavComponent {

    @Input() title:string;

    constructor() { }

}