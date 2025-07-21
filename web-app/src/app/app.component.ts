import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
}
