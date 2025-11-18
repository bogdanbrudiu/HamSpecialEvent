// src/app/admin/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('admin-auth');
    if (!isAuthenticated) {
      const password = prompt('Enter admin password:');
      if (password === 'admin123') { // Replace with real auth in production
        localStorage.setItem('admin-auth', 'true');
        return true;
      }
      alert('Authentication failed');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
