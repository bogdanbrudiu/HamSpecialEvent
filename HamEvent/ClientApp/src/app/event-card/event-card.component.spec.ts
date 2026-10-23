import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { EventCardComponent } from './event-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HamEvent } from '../events.service';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;
  const mockEvent: HamEvent = {
    id: '1',
    name: 'Test',
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
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [EventCardComponent, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })]
});
    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to event on button click', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();

    expect(navigateSpy).toHaveBeenCalledWith('event/' + mockEvent.id);
  });
});
