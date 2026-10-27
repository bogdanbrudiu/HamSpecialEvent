import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventRankingsTabComponent } from './event-rankings-tab.component';

describe('EventRankingsTabComponent', () => {
  let component: EventRankingsTabComponent;
  let fixture: ComponentFixture<EventRankingsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventRankingsTabComponent, TranslateModule.forRoot(), NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(EventRankingsTabComponent);
    component = fixture.componentInstance;
    component.top = [
      {
        callsign: 'YO3CCC',
        count: '2',
        mode: 'CW',
        band: '40m',
        points: '4',
        rank: '1'
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders rankings rows', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('YO3CCC');
    expect(html.textContent).toContain('4');
  });
});

