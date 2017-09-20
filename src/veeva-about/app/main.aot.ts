import { platformBrowser } from '@angular/platform-browser';

import { SlideModuleNgFactory } from './slide.module.ngfactory';

platformBrowser().bootstrapModuleFactory(SlideModuleNgFactory);