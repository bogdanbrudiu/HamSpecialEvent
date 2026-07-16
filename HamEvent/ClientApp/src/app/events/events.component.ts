import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { HamEvent, EventsService } from '../events.service';
import { TranslateModule } from '@ngx-translate/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    standalone: true,
    imports: [RouterLinkActive, RouterLink, NgIf, NgFor, NgxPaginationModule, FlexModule, EventCardComponent, DatePipe, TranslateModule]
})
export class EventsComponent {
  searchForm!: FormGroup;
  public Events: HamEvent[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  public loaded = false;

  gridColumns = 3;

  constructor(private router: Router, private eventsService: EventsService) {
    this.loadData()
  }

  loadData() {
    this.eventsService.getAllEvents(this.page, this.tableSize).subscribe(
      (response) => {
        this.Events = response.data;
        this.count = response.count;
        this.loaded = true;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.loadData();
  }
  gotoEvent(event: HamEvent) {
    this.router.navigateByUrl(event.id);
  }
}


