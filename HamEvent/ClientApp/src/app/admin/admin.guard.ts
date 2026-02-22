// src/app/admin/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// validation is done via server API

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const routeSecret = route.paramMap ? route.paramMap.get('secret') : null;

    // If a secret is provided in the URL, validate it with the server
    if (routeSecret) {
      try {
        const ok = await this.validateOnServer(routeSecret);
        if (ok) return true;
      } catch (e) {
        // ignore and redirect to login below
      }
      // invalid secret -> go to login UI
      await this.router.navigate(['admin', 'login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // No secret in URL -> show the login UI
    await this.router.navigate(['admin', 'login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private async validateOnServer(value: string): Promise<boolean> {
    const resp = await fetch('/api/admin/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: value })
    });
    if (!resp.ok) return false;
    const txt = await resp.text();
    return txt === 'OK';
  }
}
