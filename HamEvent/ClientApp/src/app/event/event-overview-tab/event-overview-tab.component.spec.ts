import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventOverviewTabComponent } from './event-overview-tab.component';

describe('EventOverviewTabComponent', () => {
  let component: EventOverviewTabComponent;
  let fixture: ComponentFixture<EventOverviewTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventOverviewTabComponent, TranslateModule.forRoot(), NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(EventOverviewTabComponent);
    component = fixture.componentInstance;
    component.event = {
      id: 'evt-1',
      name: 'Event Name',
      subtitle: '',
      startDate: '2026-01-01',
      endDate: '2026-01-02',
      description: { en: 'Event description' },
      rules: { en: '' },
      email: '',
      hasTop: true,
      diploma: '',
      days: 0,
      first: '',
      last: '',
      count: 2,
      unique: 2,
      excludeCallsigns: '',
      excludedCallsigns: [],
      secretKey: '',
      icon: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders event name and description', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Event Name');
    expect(html.textContent).toContain('Event description');
  });
});
