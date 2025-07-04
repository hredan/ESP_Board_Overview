import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { EspCoreOverviewComponent } from './esp-core-overview/esp-core-overview.component';
import { Esp8266BoardOverviewComponent } from './esp8266-board-overview/esp8266-board-overview.component';
import { Esp32BoardOverviewComponent } from './esp32-board-overview/esp32-board-overview.component';

export const routes: Routes = [
    { 
        path: '',
        component: EspCoreOverviewComponent
    },
    {
        path: 'esp8266',
        component: Esp8266BoardOverviewComponent
    },
    {
        path: 'esp32',
        component: Esp32BoardOverviewComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },
];