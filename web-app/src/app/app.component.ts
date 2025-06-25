import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { ChildrenOutletContexts } from '@angular/router';
// import { AppRoutingModule } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'ESP-Board Overview';
  private contexts = inject(ChildrenOutletContexts);
}
