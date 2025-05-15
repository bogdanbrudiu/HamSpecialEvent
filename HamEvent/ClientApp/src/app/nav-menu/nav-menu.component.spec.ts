import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsService } from '../events.service';
import { QSOsService } from '../qsos.service';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

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
        TranslateModule.forRoot()
      ],
      declarations: [NavMenuComponent],
      providers: [
        { provide: EventsService, useValue: eventsServiceSpy },
        { provide: QSOsService, useValue: qsosServiceSpy },
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
    expect(component.siteLanguage).toBe('Română');
    expect(translateService.use).toHaveBeenCalledWith('ro');
  });

  it('should set title and event on navigation', () => {
    const mockEvent = { id: '1', name: 'Test Event' } as any;
    eventsService.getEvent.and.returnValue(of(mockEvent));
    qsosService.getLive.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(eventsService.getEvent).toHaveBeenCalled();
    expect(qsosService.getLive).toHaveBeenCalled();
    expect(component.event).toEqual(mockEvent);
  });
});
