import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, HamEvent } from '../../events.service';
import { VerificationService } from '../../verification.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SanitizedHtmlPipe } from '../../sanitized-html.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'event-editor',
  templateUrl: './adminevent.component.html',
  styleUrl: './adminevent.component.css',
  standalone: true,
  imports: [
    NgIf, NgFor, ReactiveFormsModule, FormsModule, TranslateModule, SanitizedHtmlPipe,
    MatCheckboxModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatProgressBarModule, MatTabsModule, MatSnackBarModule
  ]
})
export class AdminEventComponent implements OnInit {
  public eventId: string = '';
  public eventSecret: string = '';
  public event: HamEvent | undefined;
  public initialEmail: string = '';
  public emailValidationCode: string = '';
  public codeGenerated: boolean = false;
  public languages: string[] = ['en', 'ro'];
  public selectedDescriptionLang = 'en';
  public selectedRulesLang = 'en';
  public selectedDescriptionIndex = 0;
  public selectedRulesIndex = 0;
  public loadFailed = false;
  public saveError = '';
  public saveSuccess = '';
  public busy = false;

  constructor(public router: Router, private eventsService: EventsService, private verificationService: VerificationService, private routes: ActivatedRoute, private translate: TranslateService, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar, @Inject('BASE_URL') private baseUrl: string) { }

  private buildEditorRoute(eventId: string, secret: string) {
    return ['/admin', eventId, secret, 'edit'];
  }

  public cancelEdit() {
    if (this.isAdminEditor) {
      this.router.navigate(['/admin', this.eventSecret]);
      return;
    }

    this.router.navigate(['/events']);
  }

  get isAdminEditor(): boolean {
    return !!this.eventSecret && !this.isGuidLike(this.eventSecret) && !this.isSha256Like(this.eventSecret);
  }

  get uploadUrl(): string {
    if (!this.event || this.event.id === '00000000-0000-0000-0000-000000000000') return '';
    const secret = this.isAdminEditor ? this.event.secretKey : this.eventSecret;
    if (!secret) return '';
    return new URL(`api/hamevent/${this.event.id}/${encodeURIComponent(secret)}/upload`, this.baseUrl).href;
  }

  get powerShellUploadUrl(): string {
    return `'${this.uploadUrl.replace(/'/g, "''")}'`;
  }

  get shellUploadUrl(): string {
    return `'${this.uploadUrl.replace(/'/g, `'"'"'`)}'`;
  }

  private requestViewRefresh() {
    queueMicrotask(() => {
      try {
        this.cdr.detectChanges();
      } catch {
        // Ignore teardown timing issues.
      }
    });
  }

  private isGuidLike(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }

  private isSha256Like(value: string): boolean {
    return /^[0-9a-f]{64}$/i.test(value);
  }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.loadFailed = false;
      this.saveError = '';
      this.saveSuccess = '';
      this.initialEmail = '';
      this.emailValidationCode = '';
      this.codeGenerated = false;
      this.eventId = params.get('id')!;
      this.eventSecret = params.get('secret')!;
      if (this.eventId === "00000000-0000-0000-0000-000000000000") {
        var date = new Date();
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
          date.getUTCDate(), date.getUTCHours(),
          date.getUTCMinutes(), date.getUTCSeconds());

        
        this.event = {
            id: '00000000-0000-0000-0000-000000000000',
            secretKey: '00000000-0000-0000-0000-000000000000',
            name: '',
            startDate: new Date(now_utc).toISOString(),
            endDate: new Date(now_utc).toISOString(),
            description: { en: '' },
            rules: { en: '' },
            email: '',
            hasTop: true,
            subtitle: '',
            days: 0,
            first: '',
            last: '',
            count: 0,
            unique: 0,
            excludedCallsigns: [],
            icon: '',
            diploma: '',
            excludeCallsigns: ''
        }
        this.requestViewRefresh();
      } else {
        this.loadEventForEditor();
      }
    });

  
  }

  private loadEventForEditor() {
    const looksLikeEventSecret = this.isGuidLike(this.eventSecret) || this.isSha256Like(this.eventSecret);
    const secretKey = looksLikeEventSecret ? this.eventSecret : '';
    const adminKey = looksLikeEventSecret ? '' : this.eventSecret;

    this.eventsService.getEvent(this.eventId, secretKey, '', adminKey).subscribe(
      (response) => {
        this.applyLoadedEvent(response);
      },
      (error) => {
        this.event = undefined;
        this.loadFailed = true;
        this.requestViewRefresh();
      }
    );
  }

  private applyLoadedEvent(response: any) {
    this.event = response;
    this.loadFailed = false;
    this.saveError = '';
    this.ensureLanguageKeys();
    this.initialEmail = response.email;
    this.requestViewRefresh();
  }
  onSubmit() {
    if (this.event && !this.busy) {
      this.busy = true;
      this.saveError = '';
      this.saveSuccess = '';
      this.ensureLanguageKeys();
      if (this.initialEmail != this.event.email) {
        if (!this.codeGenerated) {
          //send email
          this.verificationService.SendVerificationEmail(this.event.email).subscribe(
            () => {
              this.codeGenerated = true;
              this.busy = false;
              this.requestViewRefresh();
            },
            () => {
              this.busy = false;
              alert(this.translate.instant('Sending Email validation failed, try again later!'));
              this.requestViewRefresh();
            }
          );
          return;
        } else {
          //validate email

          this.verificationService.VerifyEmail(this.emailValidationCode, this.event.email).subscribe(
            () => {
              this.initialEmail = this.event?.email ?? "";
              this.updateEvent();
            },
            () => {
              this.busy = false;
              alert(this.translate.instant('Email validation failed, code not valid!'));
              this.requestViewRefresh();
            }
          );
        }
      } else {
        this.updateEvent();
      }
    }
  }

    private updateEvent() {
      if (!this.event) return;
      const isNew = this.event.id === '00000000-0000-0000-0000-000000000000';
      const payload = { ...this.event, secretKey: isNew ? this.event.id : this.eventSecret };
      this.eventsService.updateEvent(payload, this.isAdminEditor ? this.eventSecret : '').subscribe(
            (response) => {
                this.busy = false;
                this.saveError = '';
                this.saveSuccess = isNew ? 'Event created successfully.' : 'Event updated successfully.';
                this.snackBar.open(this.translate.instant(this.saveSuccess), '', { duration: 6000 });
                if (this.isAdminEditor) {
                  this.router.navigate(['/admin', this.eventSecret]);
                } else if (isNew) {
                  this.router.navigate(this.buildEditorRoute(response.hamEvent.id, response.secretKey));
                } else {
                  this.requestViewRefresh();
                }
            },
          error => {
            this.busy = false;
            this.saveError = this.extractHttpError(error, this.translate.instant('Saving event failed.'));
            this.requestViewRefresh();
            }
        );
    }

    private extractHttpError(error: any, fallback: string) {
      if (!error) return fallback;
      if (typeof error === 'string') return error;
      if (typeof error?.error === 'string' && error.error.trim()) return error.error;
      if (typeof error?.message === 'string' && error.message.trim()) return error.message;
      if (error?.status) return `${fallback} (${error.status})`;
      return fallback;
    }

    private ensureLanguageKeys() {
      if (!this.event) return;
      if (!this.event.description) this.event.description = {} as any;
      if (!this.event.rules) this.event.rules = {} as any;
      this.languages.forEach(l => {
        if (this.event && !this.event.description[l]) this.event.description[l] = '';
        if (this.event && !this.event.rules[l]) this.event.rules[l] = '';
      });
    }

    onDescriptionTabChange(index: number) {
      this.selectedDescriptionIndex = index;
      this.selectedDescriptionLang = this.languages[index];
    }

    onRulesTabChange(index: number) {
      this.selectedRulesIndex = index;
      this.selectedRulesLang = this.languages[index];
    }

    getDescriptionPreview(lang: string) {
        return this.event?.description?.[lang] || '';
    }

    getRulesPreview(lang: string) {
        return this.event?.rules?.[lang] || '';
    }
 }
