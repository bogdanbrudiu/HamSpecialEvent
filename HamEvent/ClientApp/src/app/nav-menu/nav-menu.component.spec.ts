import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsService } from '../events.service';
import { QSOsService } from '../qsos.service';
import { Title } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let eventsService: jasmine.SpyObj<EventsService>;
  let qsosService: jasmine.SpyObj<QSOsService>;

  beforeEach(async () => {
    const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getEvent']);
    const qsosServiceSpy = jasmine.createSpyObj('QSOsService', ['getLive']);

    await TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
          defaultLanguage: 'en'
        }),
        NavMenuComponent
    ],
    providers: [
        { provide: EventsService, useValue: eventsServiceSpy },
        { provide: QSOsService, useValue: qsosServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1', secret: '' }) }, outlet: 'primary', firstChild: null } },
        Title,
        TranslateService
    ]
}).compileComponents();

    eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    qsosService = TestBed.inject(QSOsService) as jasmine.SpyObj<QSOsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isExpanded', () => {
    component.isExpanded = false;
    component.toggle();
    expect(component.isExpanded).toBeTrue();
    component.toggle();
    expect(component.isExpanded).toBeFalse();
  });

  it('should collapse the menu', () => {
    component.isExpanded = true;
    component.collapse();
    expect(component.isExpanded).toBeFalse();
  });

  it('should change site language', () => {
    const translateService = TestBed.inject(TranslateService);
    spyOn(translateService, 'use');
    component.changeSiteLanguage('ro');
    expect(component.siteLanguage).toBe('ro');
    expect(translateService.use).toHaveBeenCalledWith('ro');
  });

  it('should set title and event on navigation', () => {
    const router = TestBed.inject(Router);
    const routerEvents = router.events as Subject<NavigationEnd>;
    const mockEvent = { id: '1', name: 'Test Event' } as any;
    eventsService.getEvent.and.returnValue(of(mockEvent));
    qsosService.getLive.and.returnValue(of([]));

    component.ngOnInit();
    routerEvents.next(new NavigationEnd(1, '/event/1', '/event/1'));
    fixture.detectChanges();

    expect(eventsService.getEvent).toHaveBeenCalled();
    expect(qsosService.getLive).toHaveBeenCalled();
    expect(component.event).toEqual(mockEvent);
  });

  it('should have router links for home and recovery', () => {
    const links = fixture.debugElement.queryAll(By.css('a[mat-button]'));
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links[0].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/');
    expect(links[1].nativeElement.getAttribute('ng-reflect-router-link')).toBe('/recover');
  });

  it('should navigate when nav buttons are clicked', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const links = fixture.debugElement.queryAll(By.css('a[mat-button]'));

    links[0].nativeElement.click();
    links[1].nativeElement.click();

    expect(navigateSpy).toHaveBeenCalled();
  });
});
