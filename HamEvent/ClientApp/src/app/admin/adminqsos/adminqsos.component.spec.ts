import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { EventsService, HamEvent } from '../../events.service';
import { QSOsService } from '../../qsos.service';
import { PdfService } from '../../pdf.service';
import { AdminEventNavigationService } from '../admin-event-navigation.service';
import { AdminQSOsComponent } from './adminqsos.component';

describe('AdminQSOsComponent navigation', () => {
  const eventId = 'a3ab2fa8-aad7-49b4-8337-3e6072ac09cb';
  const eventSecret = 'b0252004-0b4b-461c-b8b3-5e2c52887553';
  const masterKey = 'local-master-key';
  const eventCredential = 'a'.repeat(64);
  let component: AdminQSOsComponent;
  let events: jasmine.SpyObj<EventsService>;
  let qsos: jasmine.SpyObj<QSOsService>;
  let router: jasmine.SpyObj<Router>;
  let params: Subject<ParamMap>;
  let navigation: AdminEventNavigationService;
  let changeDetector: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    events = jasmine.createSpyObj('EventsService', ['getEvent']);
    const event: HamEvent = {
      id: eventId, secretKey: eventCredential, name: 'Test event', subtitle: '',
      startDate: '', endDate: '', description: { en: '' }, rules: { en: '' },
      email: '', hasTop: true, diploma: '', days: 0, first: '', last: '', count: 0,
      unique: 0, excludeCallsigns: '', excludedCallsigns: [], icon: ''
    };
    events.getEvent.and.returnValue(of(event));
    qsos = jasmine.createSpyObj('QSOsService', ['getLive', 'getAllQSOs', 'update', 'deleteAll']);
    qsos.getLive.and.returnValue(of([]));
    qsos.getAllQSOs.and.returnValue(of({ data: [], count: 0 }));
    qsos.update.and.returnValue(of({}));
    qsos.deleteAll.and.returnValue(of({}));
    router = jasmine.createSpyObj('Router', ['navigate']);
    params = new Subject<ParamMap>();
    navigation = new AdminEventNavigationService();
    changeDetector = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    const route = new ActivatedRoute();
    Object.defineProperty(route, 'paramMap', { value: params.asObservable() });
    component = new AdminQSOsComponent(
      new FormBuilder(), router, route,
      events, qsos, jasmine.createSpyObj<PdfService>('PdfService', ['getPdf']),
      jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']),
      jasmine.createSpyObj<MatDialog>('MatDialog', ['open']),
      jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']), navigation, changeDetector
    );
    spyOn(console, 'log');
    component.ngOnInit();
  });

  it('refreshes the toolbar and the QSO list when async requests complete', () => {
    const eventResponse = new Subject<HamEvent>();
    const qsosResponse = new Subject<any>();
    events.getEvent.and.returnValue(eventResponse.asObservable());
    qsos.getAllQSOs.and.returnValue(qsosResponse.asObservable());
    open();
    expect(component.event).toBeUndefined();
    expect(component.loaded).toBeFalse();
    expect(changeDetector.markForCheck).not.toHaveBeenCalled();

    eventResponse.next({ id: eventId, name: 'Test event', secretKey: eventCredential } as HamEvent);
    expect(navigation.getSecret(eventId)).toBe(masterKey);
    expect(changeDetector.markForCheck).toHaveBeenCalledTimes(1);
    qsosResponse.next({ data: [{ callsign1: 'YO1ABC' }], count: 1 });
    expect(component.loaded).toBeTrue();
    expect(component.QSOs.length).toBe(1);
    expect(changeDetector.markForCheck).toHaveBeenCalledTimes(2);
  });

  it('renders admin actions and QSOs after asynchronous responses', async () => {
    const eventResponse = new Subject<HamEvent>();
    const qsosResponse = new Subject<any>();
    events.getEvent.and.returnValue(eventResponse.asObservable());
    qsos.getAllQSOs.and.returnValue(qsosResponse.asObservable());
    TestBed.configureTestingModule({
      imports: [AdminQSOsComponent, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } },
        { provide: EventsService, useValue: events },
        { provide: QSOsService, useValue: qsos },
        { provide: PdfService, useValue: jasmine.createSpyObj('PdfService', ['getPdf']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        { provide: AdminEventNavigationService, useValue: navigation }
      ]
    });
    const fixture = TestBed.createComponent(AdminQSOsComponent);
    fixture.autoDetectChanges();
    open();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-responsive-toolbar')).toBeNull();

    eventResponse.next({ id: eventId, name: 'Test event', secretKey: eventCredential } as HamEvent);
    qsosResponse.next({ data: [{ callsign1: 'YO1ABC', callsign2: 'YO2XYZ', mode: 'SSB', band: '20m', timestamp: '2026-01-01' }], count: 1 });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('app-responsive-toolbar')?.textContent).toContain('Export All');
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();
    expect(fixture.nativeElement.querySelector('table')?.textContent).toContain('YO1ABC');
    fixture.destroy();
  });

  function open(secret = masterKey) {
    params.next(convertToParamMap({ id: eventId, secret }));
  }

  it('authorizes a master key through adminkey and remembers the original key', () => {
    open();
    expect(events.getEvent).toHaveBeenCalledWith(eventId, '', '', masterKey);
    expect(navigation.getSecret(eventId)).toBe(masterKey);
    expect(component.eventSecret).toBe(masterKey);
  });

  it('preserves event-secret access', () => {
    open(eventSecret);
    expect(events.getEvent).toHaveBeenCalledWith(eventId, eventSecret, '', '');
    expect(navigation.getSecret(eventId)).toBe(eventSecret);
  });

  it('does not remember failed authorization or retain stale context', () => {
    navigation.remember(eventId, masterKey);
    events.getEvent.and.returnValue(throwError(() => ({ status: 404 })));
    open('invalid-key');
    expect(navigation.getSecret(eventId)).toBeUndefined();
    expect(component.event).toBeUndefined();
  });

  it('opens the current Rankings tab without exposing the key in public navigation', () => {
    open();
    component.top();
    expect(router.navigate).toHaveBeenCalledWith(['/event', eventId], { queryParams: { tab: 'rankings' } });
    expect(navigation.getSecret(eventId)).toBe(masterKey);
  });

  it('retains the context when opening OnAir and the original key when editing', () => {
    open();
    component.live();
    expect(router.navigate).toHaveBeenCalledWith(['/event', eventId, 'live']);
    component.edit();
    expect(router.navigate).toHaveBeenCalledWith(['admin', eventId, masterKey, 'edit']);
  });

  it('uses the event credential for QSO updates without replacing the master navigation key', () => {
    open();
    const qso = { callsign1: 'A', callsign2: 'B', mode: 'SSB', band: '20m', timestamp: '', rst1: '', rst2: '', freq: '' };
    component.originalQSO = qso;
    component.saveQSO(qso);
    expect(qsos.update).toHaveBeenCalledWith(qso, qso, eventId, eventCredential);
    expect(component.eventSecret).toBe(masterKey);
    expect(navigation.getSecret(eventId)).toBe(masterKey);
  });
});
