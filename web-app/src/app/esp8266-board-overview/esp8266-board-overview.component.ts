import { Component } from '@angular/core';
import { BoardOverviewComponent, BoardInfo } from '../board-overview/board-overview.component';
import board_data from '../../../data/esp8266.json';

@Component({
  selector: 'app-esp8266-board-overview',
  imports: [BoardOverviewComponent],
  templateUrl: './esp8266-board-overview.component.html',
  styleUrl: './esp8266-board-overview.component.css'
})
export class Esp8266BoardOverviewComponent {
  boardsData: BoardInfo[] = board_data as BoardInfo[];
}
