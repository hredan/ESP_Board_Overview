import { Routes } from '@angular/router';
import { BoardOverviewComponent } from './board-overview/board-overview.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

export const routes: Routes = [
    { path: 'esp8266', component: BoardOverviewComponent },
    { path: '',   redirectTo: '/esp8266', pathMatch: 'full' }, // redirect to `trend`
    { path: '**', component: PageNotFoundComponent },
];
