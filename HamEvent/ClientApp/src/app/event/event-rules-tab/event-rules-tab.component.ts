import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-rules-tab',
  templateUrl: './event-rules-tab.component.html',
  standalone: true,
  imports: [MatExpansionModule, TranslateModule]
})
export class EventRulesTabComponent {
}
