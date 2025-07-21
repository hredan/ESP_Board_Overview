import { Component } from '@angular/core';
import { BoardOverviewComponent, BoardInfo } from '../board-overview/board-overview.component';
import board_data from '../../../data/esp32.json';
import { NavigationComponent } from '../navigation/navigation.component';
@Component({
  selector: 'app-esp32-board-overview',
  imports: [BoardOverviewComponent, NavigationComponent],
  templateUrl: './esp32-board-overview.component.html',
  styleUrl: './esp32-board-overview.component.css'
})
export class Esp32BoardOverviewComponent {
  boardsData: BoardInfo[] = board_data as BoardInfo[];
}
