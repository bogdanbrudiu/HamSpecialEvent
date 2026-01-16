import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveToolbarComponent } from './responsive-toolbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HamEvent } from '../../events.service';

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
});
