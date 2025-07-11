import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { ChildrenOutletContexts, ActivatedRoute } from '@angular/router';
// import { AppRoutingModule } from './app.routes';

import { EspCoreOverviewComponent } from "./esp-core-overview/esp-core-overview.component";
import { Esp8266BoardOverviewComponent } from "./esp8266-board-overview/esp8266-board-overview.component";
import { Esp32BoardOverviewComponent } from "./esp32-board-overview/esp32-board-overview.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
 // ngOnInit() {
  //   // Initialize any necessary data or state here
  //   // For example, you can set the initial active link based on the current route
  //   const currentUrl = this.router.url;
  //   console.log('Current URL on init: ', currentUrl);
  //   console.log();
  //   if (currentUrl === '/') {
  //     console.log('Current URL is root: ', currentUrl);
  //     this.activeLink = 'Info';
  //     this.title = 'ESP Board Overview';
  //   } else if (currentUrl.startsWith('/esp8266')) {
  //     console.log('Current URL is root: ', currentUrl);
  //     this.activeLink = 'ESP8266';
  //     this.title = 'ESP8266 Board Overview';
  //   } else if (currentUrl.startsWith('/esp32')) {
  //     console.log('Current URL is root: ', currentUrl);
  //     this.activeLink = 'ESP32';
  //     this.title = 'ESP32 Board Overview';
  //   }
  // }

  // onActivate(event: object) {
  //   // This method can be used to handle any actions when a route is activated
  //   //console.log('Activated route:', event);
  //   if (event instanceof EspCoreOverviewComponent) {
  //     console.log('Activated route: EspCoreOverviewComponent');
  //     this.activeLink = 'Info';
  //     this.title = 'ESP Board Overview';
  //   } else if (event instanceof Esp8266BoardOverviewComponent) {
  //     console.log('Activated route: Esp8266BoardOverviewComponent');
  //     this.activeLink = 'ESP8266';
  //     this.title = 'ESP8266 Board Overview';
  //   }
  //   else if (event instanceof Esp32BoardOverviewComponent) {
  //     console.log('Activated route: Esp32BoardOverviewComponent');
  //     this.activeLink = 'ESP32';
  //     this.title = 'ESP32 Board Overview';
  //   }
  // }
}
