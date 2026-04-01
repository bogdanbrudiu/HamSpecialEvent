import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [FormsModule, TranslateModule, NgIf],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  public password: string = '';
  public error: string | null = null;
  public loading = false;

  constructor(private router: Router) {}

  async submit() {
    this.error = null;
    if (!this.password) {
      this.error = 'Please enter the admin password.';
      return;
    }
    this.loading = true;
    try {
      const resp = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: this.password })
      });
      if (!resp.ok) {
        this.error = 'Invalid password';
        this.loading = false;
        return;
      }
      // on success navigate to admin/:secret
      await this.router.navigate(['admin', this.password]);
    } catch (e) {
      this.error = 'Validation failed, try again later.';
    } finally {
      this.loading = false;
    }
  }
}
