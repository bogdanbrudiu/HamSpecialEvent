import { AdminEventNavigationService } from './admin-event-navigation.service';

describe('AdminEventNavigationService', () => {
  let service: AdminEventNavigationService;

  beforeEach(() => {
    service = new AdminEventNavigationService();
  });

  it('remembers the original key separately for each event', () => {
    service.remember('event-1', 'master-key');
    service.remember('event-2', 'event-key');
    expect(service.getSecret('event-1')).toBe('master-key');
    expect(service.getSecret('event-2')).toBe('event-key');
    expect(service.getSecret('event-3')).toBeUndefined();
  });

  it('forgets only the requested event', () => {
    service.remember('event-1', 'key-1');
    service.remember('event-2', 'key-2');
    service.forget('event-1');
    expect(service.getSecret('event-1')).toBeUndefined();
    expect(service.getSecret('event-2')).toBe('key-2');
  });

  it('does not carry credentials into a new service instance', () => {
    service.remember('event-1', 'key-1');
    expect(new AdminEventNavigationService().getSecret('event-1')).toBeUndefined();
  });
});
