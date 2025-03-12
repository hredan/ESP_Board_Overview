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
  coreList: Core[] = [];
  ngOnInit() {
    this.coreList = (coreList_input as any).default;
    console.log(this.coreList.length);
    console.log(this.coreList[1].core);
  }
}

export interface Core {
  core: string;
  installed_version: string;
  latest_version: string;
  core_name: string;
}
