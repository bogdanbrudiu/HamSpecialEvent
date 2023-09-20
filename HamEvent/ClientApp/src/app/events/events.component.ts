import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HamEvent, EventsService } from '../events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent {
  searchForm!: FormGroup;
  public Events: HamEvent[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  public loaded = false;


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


