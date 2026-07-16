import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventsService } from '../events.service';
import { QSOsService } from '../qsos.service';

import { EventComponent } from './event.component';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let eventsService: jasmine.SpyObj<EventsService>;
  let qsosService: jasmine.SpyObj<QSOsService>;

  beforeEach(() => {
    eventsService = jasmine.createSpyObj<EventsService>('EventsService', ['getEvent']);
    qsosService = jasmine.createSpyObj<QSOsService>('QSOsService', ['getAllQSOs', 'getTop']);

    eventsService.getEvent.and.returnValue(of({
      id: 'evt-1',
      name: 'Event Name',
      subtitle: '',
      startDate: '',
      endDate: '',
      description: { en: '' },
      rules: { en: '' },
      email: '',
      hasTop: true,
      diploma: '',
      days: 0,
      first: '',
      last: '',
      count: 10,
      unique: 5,
      excludeCallsigns: '',
      excludedCallsigns: [],
      secretKey: '',
      icon: ''
    }));
    qsosService.getAllQSOs.and.returnValue(of({ data: [{ callsign1: 'A', callsign2: 'B', mode: 'SSB', band: '20m', timestamp: '2026-01-01' }] }));
    qsosService.getTop.and.returnValue(of({ data: [{ callsign: 'YO1ABC', count: '1', mode: 'SSB', band: '20m', points: '1', rank: '1' }] }));

    TestBed.configureTestingModule({
      imports: [EventComponent, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: EventsService, useValue: eventsService },
        { provide: QSOsService, useValue: qsosService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'evt-1' }))
          }
        }
      ]
    });
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads event from route id on init', () => {
    expect(eventsService.getEvent).toHaveBeenCalledWith('evt-1');
    expect(component.event?.id).toBe('evt-1');
  });

  it('loads logs once when logs tab is selected', () => {
    component.onTabChanged('logs');
    component.onTabChanged('logs');

    expect(qsosService.getAllQSOs).toHaveBeenCalledTimes(1);
    expect(component.logsLoaded).toBeTrue();
    expect(component.logs.length).toBe(1);
  });

  it('loads rankings once when rankings tab is selected', () => {
    component.onTabChanged('rankings');
    component.onTabChanged('rankings');

    expect(qsosService.getTop).toHaveBeenCalledTimes(1);
    expect(component.rankingsLoaded).toBeTrue();
    expect(component.top.length).toBe(1);
  });

  it('switches rendered tab content when selectedTab changes', () => {
    component.selectedTab = 'rules';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-event-rules-tab')).not.toBeNull();

    component.selectedTab = 'overview';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-event-overview-tab')).not.toBeNull();
  });
});
