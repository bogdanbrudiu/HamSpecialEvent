import {  HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component,  OnInit, Inject, Input, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../events.service';

@Component({
  selector: 'event-editor',
  templateUrl: './adminevent.component.html'
})
export class AdminEventComponent implements OnInit {
  public eventId: string = '';
  public eventSecret: string = '';
  public event: HamEvent | undefined;

  constructor(private router: Router, private eventsService: EventsService, private routes: ActivatedRoute) { }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventSecret = params.get('secret')!;
      if (this.eventId === this.eventSecret && this.eventId === "00000000-0000-0000-0000-000000000000") {
        var date = new Date();
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
          date.getUTCDate(), date.getUTCHours(),
          date.getUTCMinutes(), date.getUTCSeconds());

        
        this.event = {
            id: '00000000-0000-0000-0000-000000000000',
            secretKey: '00000000-0000-0000-0000-000000000000',
            name: '',
            startDate: new Date(now_utc).toISOString(),
            endDate: new Date(now_utc).toISOString(),
            description: '',
            email: '',
            hasTop: true,
            diploma: '',
            excludeCallsigns: ''
        }
      } else {
        this.eventsService.getEvent(this.eventId, this.eventSecret).subscribe(
          (response) => {
            this.event = response;
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });

  
  }
  onSubmit() {
    if (this.event !== undefined) { 
      this.event.secretKey = this.eventSecret;
      this.eventsService.updateEvent(this.event).subscribe(
        (response) => {
          console.log(response);
          if (this.event && this.event.id === "00000000-0000-0000-0000-000000000000") {
            this.router.navigate(['/', response.hamEvent.id, response.secretKey]);
          } else {
            this.router.navigate(['/', this.eventId, this.eventSecret]);
          }
        },
        error => {
          console.log(error); 
        }
      )
    }
  }
}
interface HamEvent {
  id: string;
  secretKey: string;
  name: string;
  description: string;
  email: string;
  diploma: string;
  hasTop: boolean;
  startDate: string;
  endDate: string;
  excludeCallsigns: string;
}
