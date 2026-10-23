import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { EventsComponent } from './events.component';
import { EventsService } from '../events.service';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getAllEvents']);
    eventsServiceSpy.getAllEvents.and.returnValue(of({
      data: [
        {
          id: 'e1',
          name: 'Event One',
          subtitle: '',
          startDate: '2026-01-01T00:00:00Z',
          endDate: '2026-01-02T00:00:00Z',
          description: { en: 'desc' },
          rules: { en: 'rules' },
          email: 'test@example.com',
          hasTop: true,
          diploma: '',
          days: 2,
          first: '',
          last: '',
          count: 10,
          unique: 5,
          excludeCallsigns: '',
          excludedCallsigns: [],
          secretKey: '',
          icon: ''
        }
      ],
      count: 1
    }));

    await TestBed.configureTestingModule({
      imports: [
        EventsComponent,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [{ provide: EventsService, useValue: eventsServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render event cards when data is loaded', () => {
    expect(component.loaded).toBeTrue();
    expect(component.eventsList.length).toBeGreaterThan(0);
    const cards = fixture.debugElement.queryAll(By.css('app-event-card'));
    expect(cards.length).toBe(1);

    const goToButtons = fixture.debugElement.queryAll(By.css('button[mat-button]'));
    expect(goToButtons.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain('Event One');
  });
});
