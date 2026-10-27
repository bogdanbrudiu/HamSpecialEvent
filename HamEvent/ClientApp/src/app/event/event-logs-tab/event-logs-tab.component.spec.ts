import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventLogsTabComponent } from './event-logs-tab.component';

describe('EventLogsTabComponent', () => {
  let component: EventLogsTabComponent;
  let fixture: ComponentFixture<EventLogsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventLogsTabComponent, TranslateModule.forRoot(), NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(EventLogsTabComponent);
    component = fixture.componentInstance;
    component.logs = [
      {
        callsign1: 'YO1AAA',
        callsign2: 'YO2BBB',
        rst1: '59',
        rst2: '59',
        freq: '14.250',
        mode: 'SSB',
        band: '20m',
        timestamp: '2026-01-01T10:00:00Z'
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders log rows', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('YO1AAA');
    expect(html.textContent).toContain('YO2BBB');
  });
});

