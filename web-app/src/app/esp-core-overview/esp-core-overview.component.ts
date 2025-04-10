import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import * as coreList_input from '../../../public/core_list.json';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-esp-core-overview',
  imports: [MatTableModule, RouterLinkActive, RouterLink],
  templateUrl: './esp-core-overview.component.html',
  styleUrl: './esp-core-overview.component.css'
})
export class EspCoreOverviewComponent {
  coreList: Core[] = (coreList_input as any).default;
  displayedColumns: string[] = ['core_name', 'core', 'installed_version', 'link'];
  dataSource = this.coreList;

  ngOnInit() {
    if (this.coreList.length == 2 && this.coreList[0].core_name == "esp32" && this.coreList[1].core_name == "esp8266") {
      this.coreList[0].link = "/esp32";
      this.coreList[1].link = "/esp8266";
      console.log("add links");
    }
    else {
      console.log("no links");
    }
  }
}

export interface Core {
  core: string;
  installed_version: string;
  latest_version: string;
  core_name: string;
  link: string;
}
