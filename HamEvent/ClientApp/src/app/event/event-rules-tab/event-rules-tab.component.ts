import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';

@Component({
  selector: 'app-event-rules-tab',
  templateUrl: './event-rules-tab.component.html',
  standalone: true,
  imports: [MatExpansionModule, TranslateModule]
})
export class EventRulesTabComponent {
  @Input() event!: HamEvent;

  constructor(private translate: TranslateService) { }

  get localizedRules(): string {
    const rules = this.event?.rules ?? {};
    const language = this.translate.currentLang || this.translate.defaultLang || 'en';
    return rules[language]?.trim() ? rules[language] : rules['en'] ?? '';
  }
}
