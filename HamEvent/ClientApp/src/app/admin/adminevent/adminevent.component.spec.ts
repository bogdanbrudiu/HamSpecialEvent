import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject, throwError } from 'rxjs';

import { AdminEventComponent } from './adminevent.component';
import { EventsService } from '../../events.service';
import { VerificationService } from '../../verification.service';
import { AdminEventNavigationService } from '../admin-event-navigation.service';

describe('AdminEventComponent', () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const adminKey = 'local-test-master-key';
  const createdId = 'a3ab2fa8-aad7-49b4-8337-3e6072ac09cb';
  const eventSecret = 'b0252004-0b4b-461c-b8b3-5e2c52887553';
  let component: AdminEventComponent;
  let eventsService: jasmine.SpyObj<EventsService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let navigation: AdminEventNavigationService;
  let routes: ActivatedRoute;

  beforeEach(() => {
    eventsService = jasmine.createSpyObj('EventsService', ['getEvent', 'updateEvent']);
    eventsService.updateEvent.and.returnValue(of({
      hamEvent: { id: createdId },
      secretKey: eventSecret
    }));
    verificationService = jasmine.createSpyObj('VerificationService', ['SendVerificationEmail', 'VerifyEmail']);
    verificationService.SendVerificationEmail.and.returnValue(of(null));
    verificationService.VerifyEmail.and.returnValue(of('Email verified.'));
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    routes = {
      paramMap: of(convertToParamMap({ id: emptyGuid, secret: adminKey }))
    } as ActivatedRoute;
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake((key: string) => key);
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges']);

    navigation = new AdminEventNavigationService();
    component = new AdminEventComponent(router, eventsService, verificationService, routes, translate, cdr, snackBar, 'https://events.example.test/app/', navigation);
    component.ngOnInit();
    component.event!.name = 'Regression event';
    component.event!.email = 'local@example.test';
  });

  it('waits for email verification before saving a new event', () => {
    component.onSubmit();

    expect(verificationService.SendVerificationEmail).toHaveBeenCalledWith('local@example.test');
    expect(component.codeGenerated).toBeTrue();
    expect(component.event!.secretKey).toBe(emptyGuid);
    expect(eventsService.updateEvent).not.toHaveBeenCalled();
  });

  it('creates a new event with the empty-GUID marker after email verification', () => {
    component.onSubmit();
    component.emailValidationCode = 'local-validation-token';
    component.onSubmit();

    expect(verificationService.VerifyEmail).toHaveBeenCalledWith('local-validation-token', 'local@example.test');
    expect(eventsService.updateEvent).toHaveBeenCalledTimes(1);
    expect(eventsService.updateEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: emptyGuid, secretKey: emptyGuid }), adminKey
    );
    expect(router.navigate).toHaveBeenCalledWith(['/admin', adminKey]);
    expect(snackBar.open).toHaveBeenCalledWith('Event created successfully.', '', { duration: 6000 });
  });

  it('preserves the creation marker when retrying a failed save after email verification', () => {
    component.codeGenerated = true;
    eventsService.updateEvent.and.returnValues(
      throwError(() => ({ status: 500 })),
      of({ hamEvent: { id: createdId }, secretKey: eventSecret })
    );

    component.onSubmit();
    expect(component.saveError).toContain('500');
    component.onSubmit();

    expect(verificationService.VerifyEmail).toHaveBeenCalledTimes(1);
    expect(eventsService.updateEvent).toHaveBeenCalledTimes(2);
    expect(component.event!.secretKey).toBe(emptyGuid);
    expect(component.saveError).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/admin', adminKey]);
  });

  for (const secret of [adminKey, eventSecret]) {
    it(`preserves the route secret when saving an existing event with ${secret === adminKey ? 'the master key' : 'an event secret'}`, () => {
      component.eventId = createdId;
      component.event!.id = createdId;
      component.eventSecret = secret;
      component.initialEmail = component.event!.email;

      component.onSubmit();

      expect(eventsService.updateEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({ id: createdId, secretKey: secret }), secret === adminKey ? adminKey : ''
      );
      expect(verificationService.SendVerificationEmail).not.toHaveBeenCalled();
      expect(verificationService.VerifyEmail).not.toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('Event updated successfully.', '', { duration: 6000 });
      if (secret === adminKey) {
        expect(router.navigate).toHaveBeenCalledWith(['/admin', adminKey]);
      } else {
        expect(router.navigate).not.toHaveBeenCalled();
        expect(component.saveSuccess).toBe('Event updated successfully.');
      }
    });
  }

  it('does not show upload instructions for an unsaved event', () => {
    expect(component.uploadUrl).toBe('');
    expect(navigation.getSecret(emptyGuid)).toBeUndefined();
  });

  for (const secret of [adminKey, eventSecret]) {
    it(`remembers the original editor key after successful authorization: ${secret}`, () => {
      eventsService.getEvent.and.returnValue(of({ ...component.event!, id: createdId }));
      Object.defineProperty(routes, 'paramMap', { value: of(convertToParamMap({ id: createdId, secret })) });
      component.ngOnInit();
      expect(navigation.getSecret(createdId)).toBe(secret);
    });
  }

  it('clears stale navigation context when editor authorization fails', () => {
    navigation.remember(createdId, adminKey);
    eventsService.getEvent.and.returnValue(throwError(() => ({ status: 404 })));
    Object.defineProperty(routes, 'paramMap', { value: of(convertToParamMap({ id: createdId, secret: 'invalid' })) });
    component.ngOnInit();
    expect(navigation.getSecret(createdId)).toBeUndefined();
    expect(component.event).toBeUndefined();
  });

  it('uses the actual base URL and event credential instead of the master key', () => {
    component.event!.id = createdId;
    component.event!.secretKey = 'a'.repeat(64);
    const expected = `https://events.example.test/app/api/hamevent/${createdId}/${'a'.repeat(64)}/upload`;

    expect(component.uploadUrl).toBe(expected);
    expect(component.powerShellUploadUrl).toBe(`'${expected}'`);
    expect(component.shellUploadUrl).toBe(`'${expected}'`);
    expect(component.uploadUrl).not.toContain(adminKey);

    component.initialEmail = component.event!.email;
    component.onSubmit();
    expect(component.event!.secretKey).toBe('a'.repeat(64));
    expect(component.uploadUrl).toBe(expected);
  });

  it('uses the event link secret in upload examples', () => {
    component.event!.id = createdId;
    component.eventSecret = eventSecret;
    expect(component.uploadUrl).toBe(`https://events.example.test/app/api/hamevent/${createdId}/${eventSecret}/upload`);
  });

  it('does not display success or navigate when saving fails', () => {
    component.initialEmail = component.event!.email;
    eventsService.updateEvent.and.returnValue(throwError(() => ({ status: 500 })));
    component.onSubmit();
    expect(component.saveError).toContain('500');
    expect(component.saveSuccess).toBe('');
    expect(component.busy).toBeFalse();
    expect(snackBar.open).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('prevents duplicate saves while a request is pending', () => {
    const pending = new Subject<any>();
    eventsService.updateEvent.and.returnValue(pending);
    component.initialEmail = component.event!.email;
    component.onSubmit();
    component.onSubmit();
    expect(component.busy).toBeTrue();
    expect(eventsService.updateEvent).toHaveBeenCalledTimes(1);
    pending.next({ hamEvent: { id: createdId }, secretKey: eventSecret });
    pending.complete();
    expect(component.busy).toBeFalse();
  });

  it('returns SuperAdmin to the admin list on cancel', () => {
    component.cancelEdit();
    expect(router.navigate).toHaveBeenCalledWith(['/admin', adminKey]);
  });

  it('returns event-secret users to public events without requesting master access', () => {
    component.eventSecret = eventSecret;
    component.cancelEdit();
    expect(router.navigate).toHaveBeenCalledWith(['/events']);
  });
});
