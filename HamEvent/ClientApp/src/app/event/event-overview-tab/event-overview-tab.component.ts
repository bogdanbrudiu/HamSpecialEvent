import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';

@Component({
  selector: 'app-event-overview-tab',
  templateUrl: './event-overview-tab.component.html',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDivider, MatExpansionModule, TranslateModule, DatePipe]
})
export class EventOverviewTabComponent {
  @Input() event!: HamEvent;

  constructor(private translate: TranslateService) { }

  get localizedDescription(): string {
    const descriptions = this.event?.description ?? {};
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return descriptions[currentLang] ?? descriptions['en'] ?? '';
  }
}
