import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-recovery',
  standalone: true,
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class RecoveryComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  sending = false;
  status: 'idle' | 'success' | 'notfound' | 'error' = 'idle';
  message = '';

  constructor(private fb: FormBuilder, private eventsService: EventsService) { }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    this.status = 'idle';
    this.message = '';
    const email = this.form.value.email ?? '';
    this.eventsService.recoverAdminLinks(email).subscribe({
      next: (res) => {
        this.status = 'success';
        const count = res?.count ?? 0;
        this.message = count > 0 ? `${count}` : '0';
      },
      error: (err) => {
        if (err?.status === 404) {
          this.status = 'notfound';
        } else {
          this.status = 'error';
        }
      },
      complete: () => {
        this.sending = false;
      }
    });
  }
}
