import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Slide Module
import { SlideModule } from './slide.module';

const platform = platformBrowserDynamic();

platform.bootstrapModule(SlideModule);

            