import { Component, Input } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Participant } from '../../qsos.service';

@Component({
  selector: 'app-event-rankings-tab',
  templateUrl: './event-rankings-tab.component.html',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, TranslateModule]
})
export class EventRankingsTabComponent {
  @Input() top: Participant[] = [];
  @Input() displayedColumnsTop: string[] = ['callsign1', 'count', 'mode', 'band', 'points', 'rank'];
}
