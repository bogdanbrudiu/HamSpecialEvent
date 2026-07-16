import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventsService, HamEvent } from '../events.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { Participant, QSO, QSOsService } from '../qsos.service';
import { EventLogsTabComponent } from './event-logs-tab/event-logs-tab.component';
import { EventOverviewTabComponent } from './event-overview-tab/event-overview-tab.component';
import { EventRankingsTabComponent } from './event-rankings-tab/event-rankings-tab.component';
import { EventRulesTabComponent } from './event-rules-tab/event-rules-tab.component';
import { EventTab, ResponsiveToolbarComponent } from './responsive-toolbar/responsive-toolbar.component';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    ResponsiveToolbarComponent,
    EventOverviewTabComponent,
    EventRulesTabComponent,
    EventLogsTabComponent,
    EventRankingsTabComponent
  ]
})
export class EventComponent implements OnInit {

  public eventId: string = '';
  public event!: HamEvent;
  public searchInput = '';
  public logs: QSO[] = [];
  public top: Participant[] = [];
  page: number = 0;
  tableSize: number = 20;
  displayedColumns: string[] = ['callsign1', 'callsign2', 'mode', 'band', 'timestamp'];
  displayedColumnsTop: string[] = ['callsign1', 'count', 'mode', 'band', 'points', 'rank'];
  selectedTab: EventTab = 'overview';
  logsLoaded = false;
  rankingsLoaded = false;

  constructor(private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService) { }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventsService.getEvent(this.eventId).subscribe(
        (response) => {
          this.event = response;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
  loadData() {
    this.qsosService.getAllQSOs(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.logs = response.data;
        this.logsLoaded = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadTop() {
    this.qsosService.getTop(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.top = response.data;
        this.rankingsLoaded = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onTabChanged(tab: EventTab) {
    this.selectedTab = tab;
    if (tab === 'logs' && !this.logsLoaded) {
      this.loadData();
    }
    if (tab === 'rankings' && !this.rankingsLoaded) {
      this.loadTop();
    }
  }
}
