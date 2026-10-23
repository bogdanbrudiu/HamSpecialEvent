import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';

@Component({
  selector: 'app-event-overview-tab',
  templateUrl: './event-overview-tab.component.html',
  styles: [`
    .item_disabled {
      pointer-events: none;
      cursor: not-allowed;
      color: #ccc;
      opacity: 0.7;
    }
    .item_needs_fix {
      border: 1px dashed rgba(255, 193, 7, 0.85);
      border-radius: 4px;
      background-color: rgba(255, 193, 7, 0.08);
    }
    .needs_fix_icon {
      margin-left: 6px;
      color: #ffb300;
    }
  `],
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDivider, MatExpansionModule, MatButtonModule, TranslateModule, DatePipe]
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
