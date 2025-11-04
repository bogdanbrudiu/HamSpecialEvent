import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HamEvent } from '../events.service';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'trim'
})
export class TrimPipe implements PipeTransform {
  transform(value: string): string {
    return value.trim();
  }
}

@Component({
    selector: 'app-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.css'],
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardImage, MatCardContent, MatCardActions, MatButton, MatCardFooter, MatIcon, MatTooltip, DatePipe, TranslateModule, TrimPipe]
})
export class EventCardComponent {
  @Input() event!: HamEvent;
  constructor(private router: Router) { }

  gotoEvent(event: HamEvent) {
    this.router.navigateByUrl("event/" + event.id);
  }

  getTooltipText() {
    //Days: { { event.days } },&#13;&#10; From: { { event.startDate | date: 'shortDate' } },&#013;&#010; To: { { event.endDate | date: 'medium' } }
    return `Days: ${this.event.days}
    Start: ${this.event.startDate.toLocaleString()}
    End: ${this.event.endDate.toLocaleString()}
    Count: ${this.event.count}`;
  }
}
