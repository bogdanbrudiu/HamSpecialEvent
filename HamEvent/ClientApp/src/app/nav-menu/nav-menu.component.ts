import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { EventsService, HamEvent } from '../events.service';
import { QSOsService } from '../qsos.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { MatAnchor } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { Log } from 'oidc-client';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css'],
    standalone: true,
    imports: [MatToolbar, MatAnchor, RouterLink, LanguageSelectorComponent, TranslateModule]
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

  constructor(private translate: TranslateService, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private router: Router, private titleService: Title) { }
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
      console.log(route);
      var id = route.snapshot.paramMap.get('id')
      var secret = route.snapshot.paramMap.get('secret')
      if (id != null && id !='00000000-0000-0000-0000-000000000000') {
        this.eventId = id;
        console.log(id);
        this.eventsService.getEvent(this.eventId).subscribe(
          (response) => {
            this.event = response;
            if (this.event){ 
              this.titleService.setTitle(this.event.name);
            }
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
        this.titleService.setTitle(this.translate.instant("HamEvents"));
        this.eventId = '';
        this.isLive = false;
        this.event = undefined;
      }
    });
  }
}
