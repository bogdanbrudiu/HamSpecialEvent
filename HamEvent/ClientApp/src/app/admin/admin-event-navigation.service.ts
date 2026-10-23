import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminEventNavigationService {
  private readonly secrets = new Map<string, string>();

  remember(eventId: string, secret: string): void {
    if (eventId && secret) {
      this.secrets.set(eventId, secret);
    }
  }

  getSecret(eventId: string): string | undefined {
    return this.secrets.get(eventId);
  }

  forget(eventId: string): void {
    this.secrets.delete(eventId);
  }
}
