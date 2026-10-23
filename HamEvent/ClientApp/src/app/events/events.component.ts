import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HamEvent, EventsService } from '../events.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      NgIf,
      NgFor,
      FlexModule,
      EventCardComponent,
      NgxPaginationModule,
      TranslateModule
    ]
})
export class EventsComponent {
  searchForm!: FormGroup;
  public eventsList: HamEvent[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  public loaded = false;

  gridColumns = 3;

  constructor(private router: Router, private eventsService: EventsService, private cdr: ChangeDetectorRef) {
    this.loadData()
  }

  private requestViewRefresh() {
    queueMicrotask(() => {
      try {
        this.cdr.detectChanges();
      } catch {
        // No-op when component is already destroyed (e.g., test teardown).
      }
    });
  }

  loadData() {
    this.eventsService.getAllEvents(this.page, this.tableSize).subscribe(
      (response) => {
        const data = response?.data ?? response?.Data ?? [];
        this.eventsList = Array.isArray(data) ? data : [];

        const total = response?.count ?? response?.Count;
        this.count = typeof total === 'number' ? total : this.eventsList.length;
        this.loaded = true;
        this.requestViewRefresh();
      },
      () => {
        this.loaded = true;
        this.eventsList = [];
        this.requestViewRefresh();
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


