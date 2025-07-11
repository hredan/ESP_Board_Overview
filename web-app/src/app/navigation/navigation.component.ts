import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-navigation',
  imports: [MatTabsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  links = ['Info', 'ESP8266', 'ESP32'];
  //activeLinkInput = input.required<string>();
  activeLinkInput = input<string>('Info'); // Default to 'Info' if not provided
  activeLink: string = this.activeLinkInput(); 
  private router = inject(Router);

  onTabChange(event: number) {
    // Handle tab change if needed
    const index = event;
    this.activeLink = this.links[index];
    const tab = this.links[index];
    const activeRouterUrl = this.router.url;
    if (tab === 'Info' && activeRouterUrl !== '/') {
      this.router.navigate(['/']);
    }
    else if (tab === 'ESP8266' && activeRouterUrl !== '/esp8266') {
      this.router.navigate(['/esp8266']);
    }
    else if (tab === 'ESP32' && activeRouterUrl !== '/esp32') {
      this.router.navigate(['/esp32']);
    }
  }
}
