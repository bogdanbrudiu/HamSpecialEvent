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
      this.eventsService.getEvent(this.eventId).subscribe(
        (response) => {
          this.event = response;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    });

  
  }
  onSubmit() {
    if (this.event !== undefined) { 
      this.event.secretKey = this.eventSecret;
      this.eventsService.updateEvent(this.event).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate([this.eventId, this.eventSecret]);
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
  diploma: string;
}
