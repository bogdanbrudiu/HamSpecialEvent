import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    component.event = {
      id: 'evt-1',
      name: 'Current event',
      subtitle: '',
      startDate: '2026-01-01',
      endDate: '2026-01-02',
      description: { en: '' },
      rules: { en: '<p>Current event rules</p>', ro: '<p>Regulile evenimentului curent</p>' },
      email: '',
      hasTop: true,
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
    TestBed.inject(TranslateService).use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the current event rules instead of historic event content', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.event-rules p')?.textContent).toBe('Current event rules');
    expect(html.textContent).not.toContain('YP20KQT');
    expect(html.textContent).not.toContain('December 2023');
  });

  it('updates rules when the selected language changes', () => {
    TestBed.inject(TranslateService).use('ro');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.event-rules').textContent).toBe('Regulile evenimentului curent');
  });

  it('falls back to English when the selected language is missing or blank', () => {
    TestBed.inject(TranslateService).use('de');
    fixture.detectChanges();
    expect(component.localizedRules).toBe('<p>Current event rules</p>');
    component.event.rules['de'] = '   ';
    fixture.detectChanges();
    expect(component.localizedRules).toBe('<p>Current event rules</p>');
  });

  it('updates the displayed rules when the current event changes', () => {
    fixture.componentRef.setInput('event', { ...component.event, rules: { en: 'Different event rules' } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.event-rules').textContent).toBe('Different event rules');
  });

  it('does not show another event rules when no rules are configured', () => {
    component.event = { ...component.event, rules: {} };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.event-rules').textContent).toBe('');
  });

  it('sanitizes unsafe HTML while preserving rule formatting', () => {
    component.event.rules['en'] = '<strong>Valid rule</strong><img src="x" onerror="alert(1)">';
    fixture.detectChanges();
    const rules = fixture.nativeElement.querySelector('.event-rules') as HTMLElement;
    expect(rules.querySelector('strong')?.textContent).toBe('Valid rule');
    expect(rules.querySelector('img')?.hasAttribute('onerror')).toBeFalse();
  });
});

