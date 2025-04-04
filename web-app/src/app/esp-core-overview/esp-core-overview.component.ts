import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import * as coreList_input from '../../../public/core_list.json';

@Component({
  selector: 'app-esp-core-overview',
  imports: [],
  templateUrl: './esp-core-overview.component.html',
  styleUrl: './esp-core-overview.component.css'
})
export class EspCoreOverviewComponent {
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
