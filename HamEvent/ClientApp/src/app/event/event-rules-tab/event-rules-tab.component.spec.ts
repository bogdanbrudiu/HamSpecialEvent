import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventRulesTabComponent } from './event-rules-tab.component';

describe('EventRulesTabComponent', () => {
  let component: EventRulesTabComponent;
  let fixture: ComponentFixture<EventRulesTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventRulesTabComponent, TranslateModule.forRoot(), NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(EventRulesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders contest rules section', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Contest rules');
  });
});

