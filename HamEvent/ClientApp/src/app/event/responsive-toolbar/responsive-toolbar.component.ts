import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';

export type EventTab = 'overview' | 'rules' | 'logs' | 'rankings';
export type ToolbarItemId = EventTab | 'livestream' | 'onair' | 'stats' | 'awards';

export interface MenuItem {
  id: ToolbarItemId;
  label: string;
  icon: string;
  showOnMobile: boolean;
  showOnTablet: boolean;
  showOnDesktop: boolean;
  isDisabled?: boolean;
  link?: string;
}

@Component({
  selector: "app-responsive-toolbar",
  templateUrl: "./responsive-toolbar.component.html",
  styleUrls: ["./responsive-toolbar.component.css"],
  standalone: true,
  imports: [MatToolbar, FlexModule, MatButton, RouterLink, MatIcon, NgFor, NgClass, NgIf, ExtendedModule, TranslateModule]
})
export class ResponsiveToolbarComponent {
  @Input() event!: HamEvent;
  @Input() enableTabSelection = false;
  @Input() selectedTab: EventTab = 'overview';
  @Output() tabChanged = new EventEmitter<EventTab>();

  private readonly tabIds: EventTab[] = ['overview', 'rules', 'logs', 'rankings'];

  menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: "Overview",
      icon: "event_note",
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      id: 'rules',
      label: "Rules",
      icon: "rule",
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      id: 'logs',
      label: "Logs",
      icon: "notes",
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      id: 'rankings',
      label: "Rankings",
      icon: "star",
      showOnMobile: true,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      id: 'livestream',
      label: "LiveStream",
      icon: "stream",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true,
      isDisabled: true
    },
    {
      id: 'onair',
      label: "OnAir",
      link: "live",
      icon: "air",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      id: 'awards',
      label: "Awards",
      icon: "emoji_events",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      id: 'stats',
      label: "Stats",
      icon: "bar_chart_4_bars",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    }
  ];

  isTabItem(item: MenuItem): item is MenuItem & { id: EventTab } {
    return this.tabIds.includes(item.id as EventTab);
  }

  selectTab(tabId: EventTab) {
    this.selectedTab = tabId;
    this.tabChanged.emit(tabId);
  }

  onMenuItemClick(item: MenuItem) {
    if (item.isDisabled) {
      return;
    }

    if (this.enableTabSelection && this.isTabItem(item)) {
      this.selectTab(item.id);
      return;
    }

    if (item.link) {
      this.router.navigate(["event/" + this.event.id + "/" + item.link]);
    }
  }

  constructor(private router: Router) { }
}
