// src/app/admin/admin-home.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, HamEvent } from '../events.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
})
export class AdminHomeComponent implements OnInit {

  events: HamEvent[] = [];
  public adminSecret: string = '';

  loaded = false;
  page = 1;
  tableSize = 10;
  count = 0;
  displayedColumns: string[] = ['name', 'startDate', 'description', 'email', 'days', 'count'];

  constructor(private eventsService: EventsService, private router: Router, private routes: ActivatedRoute, private translate: TranslateService) { }

  private pickLocalized(value: { [lang: string]: string } | any): string {
    if (!value) return '';
    const lang = this.translate.currentLang || 'en';
    return value[lang] || value['en'] || Object.values(value)[0] || '';
  }

  getDescription(event: HamEvent) {
    return this.pickLocalized((event as any).description);
  }
  ngOnInit() {
    this.loadEvents();
    this.routes.paramMap.subscribe(params => {
      this.adminSecret = params.get('secret')!;
    });
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
    this.router.navigate(['admin', event.id, this.adminSecret, 'edit']);
    //this.router.navigate(['admin', event.id, 'edit']);
  }

  gotoQSOs(event: HamEvent) {
    this.router.navigate(['admin', event.id, this.adminSecret, 'qsos']);
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
