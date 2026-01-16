/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StatsComponent } from './stats.component';
import { QSOsService } from '../../qsos.service';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let qsosServiceSpy: jasmine.SpyObj<QSOsService>;

  beforeEach(async () => {
    qsosServiceSpy = jasmine.createSpyObj('QSOsService', ['getStats']);
    qsosServiceSpy.getStats.and.returnValue(of({
      totalQsos: 5,
      bandModeTotals: [{ band: '20m', mode: 'SSB', count: 3 }],
      foxBandTotals: [{ fox: 'A', band: '20m', count: 3, total: 3 }],
      foxDailyTotals: [{ fox: 'A', day: '2024-01-01', count: 3 }]
    }));

    await TestBed.configureTestingModule({
      imports: [
        StatsComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
          defaultLanguage: 'en'
        })
      ],
      providers: [{ provide: QSOsService, useValue: qsosServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    component.eventId = 'event-1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render stats data', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('TotalQSOs');
    expect(text).toContain('5');
    expect(qsosServiceSpy.getStats).toHaveBeenCalledWith('event-1');
  });
});
