import { Component } from '@angular/core';
import { BoardOverviewComponent, BoardInfo } from '../board-overview/board-overview.component';
import board_data from '../../../data/esp32.json';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-esp32-board-overview',
  imports: [BoardOverviewComponent],
  templateUrl: './esp32-board-overview.component.html',
  styleUrl: './esp32-board-overview.component.css'
})
export class Esp32BoardOverviewComponent {
  boardsData: BoardInfo[] = board_data as BoardInfo[];
  constructor(private titleService: Title) {
    this.titleService.setTitle('ESP32 Board Overview');
  }
}
