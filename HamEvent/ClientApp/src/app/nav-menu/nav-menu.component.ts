import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { EventsService, HamEvent } from '../events.service';
import { QSOsService } from '../qsos.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent {
  isExpanded = false;

  siteLanguage = 'English';
  languageList = [
    { code: 'en', label: 'English' },
    { code: 'ro', label: 'Română' },
  ];
  public eventId: string = '';
  public event: HamEvent | undefined;
  public isLive: boolean = false;

  constructor(private translate: TranslateService, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private router: Router) { }
  changeSiteLanguage(localeCode: string): void {
    const selectedLanguage = this.languageList
      .find((language) => language.code === localeCode)
      ?.label.toString();
    if (selectedLanguage) {
      this.siteLanguage = selectedLanguage;
      this.translate.use(localeCode);
    }
    const currentLanguage = this.translate.currentLang;
    console.log('currentLanguage', currentLanguage);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  private rootRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  ngOnInit() {
    this.router.events.pipe(
      // identify navigation end
      filter((event) => event instanceof NavigationEnd),
      // now query the activated route
      map(() => this.rootRoute(this.routes)),
      filter((route: ActivatedRoute) => route.outlet === 'primary'),
    ).subscribe((route: ActivatedRoute) => {
      var id = route.snapshot.paramMap.get('id')
      if (id != null) {
        this.eventId = id;
        this.eventsService.getEvent(this.eventId).subscribe(
          (response) => {
            this.event = response;
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
        this.qsosService.getLive(this.eventId).subscribe(
          (response) => {
            this.isLive = response != null && (<Array<any>>response).length>0;
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        this.eventId = '';
        this.isLive = false;
        this.event = undefined;
      }
    });
  }
}
