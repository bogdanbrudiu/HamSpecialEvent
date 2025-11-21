import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-qso-dialog',
  templateUrl: './edit-qso-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, NgIf, TranslateModule]
})
export class EditQsoDialogComponent {
  qso: any;

  constructor(
    public dialogRef: MatDialogRef<EditQsoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.qso = { ...data };
  }

  save() {
    this.dialogRef.close(this.qso);
  }

  cancel() {
    this.dialogRef.close();
  }
}
