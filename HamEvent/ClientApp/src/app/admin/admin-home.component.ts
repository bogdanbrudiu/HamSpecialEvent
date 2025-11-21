// src/app/admin/admin-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService, HamEvent } from '../events.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
})
export class AdminHomeComponent implements OnInit {

  events: HamEvent[] = [];
  loaded = false;
  page = 1;
  tableSize = 10;
  count = 0;
  displayedColumns: string[] = ['name', 'startDate', 'description', 'email', 'days', 'count'];

  constructor(private eventsService: EventsService, private router: Router) { }
  ngOnInit() {
    this.loadEvents();
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.tableSize);
  }

  loadEvents() {
    this.loaded = false;
    this.eventsService.getAllEvents(this.page, this.tableSize).subscribe(
      (response) => {
        this.events = response.data;
        this.count = response.count;
        this.loaded = true;
      },
      (error) => {
        this.loaded = true;
        console.log(error);
      }
    );
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadEvents();
  }

  gotoEvent(event: HamEvent) {
    //this.router.navigate(['admin', event.id, event.secretKey, 'edit']);
    this.router.navigate(['admin', event.id, 'edit']);
  }

  gotoQSOs(event: HamEvent) {
    this.router.navigate(['admin', event.id, 'qsos']);
  }

  //ngOnInit() {
  //  this.eventsService.getAllEvents(1, 10).subscribe(
  //    (response) => {
  //      this.events = response.data;
  //      this.loaded = true;
  //      console.log(response);
  //  //  next: (data) => {
  //  //    this.events = data;
  //  //    this.loaded = true;
  //    },
  //    (error) => {
  //      this.loaded = true;
  //      console.log(error);
  //    }
  //  );
  //}

  createEvent() {
    this.router.navigate(['admin', '00000000-0000-0000-0000-000000000000', 'edit']);
  }
}
