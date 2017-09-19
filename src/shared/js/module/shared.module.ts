import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [
        NavComponent,
        FooterComponent
    ],
    exports: [
        CommonModule,
        NavComponent,
        FooterComponent
    ]
})
export class SharedModule { }
