import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Event, RouterEvent, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [MatTabsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  // links = ['Info', 'ESP8266', 'ESP32'];
  links: TabLink[] = [
    { name: 'Info', path: '/' },
    { name: 'ESP8266', path: '/esp8266' },
    { name: 'ESP32', path: '/esp32' }
  ]
  activeLink: TabLink = this.links[0];

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof RouterEvent) {
        if (event.url === '/' && this.activeLink.path !== '/') {
          this.activeLink = this.links[0];
        }
        else if (event.url === '/esp8266' && this.activeLink.path !== '/esp8266') {
          this.activeLink = this.links[1];
        }
        else if (event.url === '/esp32' && this.activeLink.path !== '/esp32') {
          this.activeLink = this.links[2];
        }
      }
    });
  }
  onTabchanged(link: TabLink) {
    this.activeLink = link;
    if (this.router.url !== link.path) {
      this.router.navigateByUrl(link.path);
    }
  }
}

export interface TabLink {
  name: string;
  path: string;
}
