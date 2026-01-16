import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventComponent } from './event.component';
import { EventsService } from '../events.service';
import { QSOsService } from '../qsos.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async () => {
    const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getEvent']);
    const qsosServiceSpy = jasmine.createSpyObj('QSOsService', ['getAllQSOs', 'getTop', 'getLive']);

    eventsServiceSpy.getEvent.and.returnValue(of({
      id: 'test-id',
      name: 'Test Event',
      subtitle: '',
      startDate: new Date(),
      endDate: new Date(),
      description: { en: 'desc' },
      rules: { en: 'rules' },
      email: '',
      hasTop: false,
      diploma: '',
      days: 0,
      first: '',
      last: '',
      count: 0,
      unique: 0,
      excludeCallsigns: '',
      excludedCallsigns: [],
      secretKey: '',
      icon: ''
    }));

    await TestBed.configureTestingModule({
    imports: [EventComponent, RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, NoopAnimationsModule, TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
          defaultLanguage: 'en'
        })],
    providers: [
        { provide: EventsService, useValue: eventsServiceSpy },
        { provide: QSOsService, useValue: qsosServiceSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: 'test-id' })) } },
        TranslateService
    ]
}).compileComponents();
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
