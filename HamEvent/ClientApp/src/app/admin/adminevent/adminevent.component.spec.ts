import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { AdminEventComponent } from './adminevent.component';
import { EventsService } from '../../events.service';
import { VerificationService } from '../../verification.service';

describe('AdminEventComponent', () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const adminKey = 'local-test-master-key';
  const createdId = 'a3ab2fa8-aad7-49b4-8337-3e6072ac09cb';
  const eventSecret = 'b0252004-0b4b-461c-b8b3-5e2c52887553';
  let component: AdminEventComponent;
  let eventsService: jasmine.SpyObj<EventsService>;
  let verificationService: jasmine.SpyObj<VerificationService>;
  let router: jasmine.SpyObj<Router>;

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
    const routes = {
      paramMap: of(convertToParamMap({ id: emptyGuid, secret: adminKey }))
    } as ActivatedRoute;
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake((key: string) => key);
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges']);

    component = new AdminEventComponent(router, eventsService, verificationService, routes, translate, cdr);
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
    expect(router.navigate).toHaveBeenCalledWith(['/admin', createdId, eventSecret, 'edit']);
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
    expect(router.navigate).toHaveBeenCalledWith(['/admin', createdId, eventSecret, 'edit']);
  });

  for (const secret of [adminKey, eventSecret]) {
    it(`preserves the route secret when saving an existing event with ${secret === adminKey ? 'the master key' : 'an event secret'}`, () => {
      component.eventId = createdId;
      component.event!.id = createdId;
      component.eventSecret = secret;
      component.initialEmail = component.event!.email;

      component.onSubmit();

      expect(eventsService.updateEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({ id: createdId, secretKey: secret }), secret
      );
      expect(verificationService.SendVerificationEmail).not.toHaveBeenCalled();
      expect(verificationService.VerifyEmail).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/admin', createdId, secret, 'edit']);
    });
  }
});
