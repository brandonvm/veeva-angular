import { NgModule } from '@angular/core';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './../../shared/js/module/shared.module';

// Components
import { SlideComponent } from './slide.component';

@NgModule({
    imports: [ 
        BrowserModule,
        SharedModule
    ],
    declarations: [ SlideComponent ],
    bootstrap:    [ SlideComponent ]
})
export class SlideModule { }