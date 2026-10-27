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

  it('marks Participate Now as a disabled dummy action with the existing repair indicator', () => {
    const button = fixture.nativeElement.querySelector('mat-card-actions button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    expect(button.classList.contains('item_disabled')).toBeTrue();
    expect(button.classList.contains('item_needs_fix')).toBeTrue();
    expect(button.title).toBe('Needs repair before announcement');
    expect(button.querySelector('mat-icon.needs_fix_icon')?.textContent?.trim()).toBe('priority_high');
  });
});
