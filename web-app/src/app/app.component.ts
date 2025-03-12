import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import * as coreList_input from '../../public/core_list.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'ESP-Board Overview';
  coreList: Core[] = coreList_input;
  ngOnInit() {
    console.log(this.coreList);
  }
}

export interface Core {
  core: string;
  installed_version: string;
  latest_version: string;
  core_name: string;
}
