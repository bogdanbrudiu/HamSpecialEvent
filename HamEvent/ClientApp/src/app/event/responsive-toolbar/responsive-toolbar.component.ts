import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';

export interface MenuItem {
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
    imports: [MatToolbar, FlexModule, MatButton, RouterLink, MatIcon, NgFor, NgClass, ExtendedModule, NgIf, TranslateModule]
})
export class ResponsiveToolbarComponent implements OnInit {
  @Input() event!: HamEvent;

  goto(link?: string) {
    if (link) {
      console.log("goto", link);
      this.router.navigate(["event/" + this.event.id + "/" + link]);
    }
  }

  menuItems: MenuItem[] = [
    {
      label: "LiveStream",
      icon: "stream",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true,
      isDisabled: true
    },
    {
      label: "OnAir",
      link: "live",
      icon: "air",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      label: "Awards",
      icon: "emoji_events",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      label: "Stats",
      icon: "bar_chart_4_bars",
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    }
  ];
  constructor(private router: Router) { }
    ngOnInit(): void {
      throw new Error('Method not implemented.');
        // initialize menu with the items that should be disabled or not
    }
}
