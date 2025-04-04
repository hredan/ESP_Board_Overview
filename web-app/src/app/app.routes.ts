import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardOverviewComponent } from './board-overview/board-overview.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { EspCoreOverviewComponent } from './esp-core-overview/esp-core-overview.component';

export const routes: Routes = [
    { path: 'info', component: EspCoreOverviewComponent },
    { path: 'esp8266', component: BoardOverviewComponent },
    { path: '',   redirectTo: '/esp8266', pathMatch: 'full' }, // redirect to `trend`
    { path: '**', component: PageNotFoundComponent },
];