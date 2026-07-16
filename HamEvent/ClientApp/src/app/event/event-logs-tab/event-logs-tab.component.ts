import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { QSO } from '../../qsos.service';

@Component({
  selector: 'app-event-logs-tab',
  templateUrl: './event-logs-tab.component.html',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class EventLogsTabComponent {
  @Input() logs: QSO[] = [];
  @Input() displayedColumns: string[] = ['callsign1', 'callsign2', 'mode', 'band', 'timestamp'];
}
