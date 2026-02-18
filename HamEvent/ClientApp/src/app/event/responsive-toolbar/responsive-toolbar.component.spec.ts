import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveToolbarComponent } from './responsive-toolbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ResponsiveToolbarComponent', () => {
  let component: ResponsiveToolbarComponent;
  let fixture: ComponentFixture<ResponsiveToolbarComponent>;
  const mockEvent: HamEvent = {
    id: '1',
    name: 'Test',
    subtitle: '',
    startDate: '',
    endDate: '',
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
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ResponsiveToolbarComponent, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })]
});
    fixture = TestBed.createComponent(ResponsiveToolbarComponent);
    component = fixture.componentInstance;
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all toolbar buttons with expected states', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBeGreaterThanOrEqual(component.menuItems.length + 1); // includes back button

    const liveStreamButton = buttons.find(b => b.nativeElement.textContent.includes('LiveStream'));
    expect(liveStreamButton?.nativeElement.disabled).toBeTrue();

    const onAirButton = buttons.find(b => b.nativeElement.textContent.includes('OnAir'));
    expect(onAirButton).toBeTruthy();
  });

  it('should navigate when a menu item with link is clicked', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const onAirButton = fixture.debugElement.queryAll(By.css('button'))
      .find(b => b.nativeElement.textContent.includes('OnAir'));

    onAirButton?.nativeElement.click();

    expect(navigateSpy).toHaveBeenCalledWith(['event/' + mockEvent.id + '/live']);
  });
});
