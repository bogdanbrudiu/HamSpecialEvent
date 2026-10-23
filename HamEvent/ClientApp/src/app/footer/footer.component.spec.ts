import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService, TranslateFakeLoader } from '@ngx-translate/core';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
          defaultLanguage: 'en'
        })
      ]
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { Copyright: '2024-{{year}}, QSO Banat Club, Timisoara, Romania' }, true);
    translate.use('en');

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the translated copyright with current year', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const year = new Date().getFullYear().toString();
    expect(compiled.querySelector('.footer-left')?.textContent).toContain(year);
    expect(compiled.querySelector('.footer-left')?.textContent).toContain('QSO Banat Club');
  });

  it('should render external links with targets', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('.footer-right a'));
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('http://yo2kqt.ro');
    expect(links[1].getAttribute('href')).toBe('https://github.com/bogdanbrudiu/HamSpecialEvent');
    expect(links.every(l => l.getAttribute('target') === '_blank')).toBeTrue();
  });
});
