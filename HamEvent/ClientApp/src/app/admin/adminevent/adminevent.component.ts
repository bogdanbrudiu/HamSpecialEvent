import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, HamEvent } from '../../events.service';
import { VerificationService } from '../../verification.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SanitizedHtmlPipe } from '../../sanitized-html.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIf, DatePipe, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'event-editor',
  templateUrl: './adminevent.component.html',
  styleUrl: './adminevent.component.css',
  standalone: true,
  imports: [
    NgIf, NgFor, ReactiveFormsModule, FormsModule, DatePipe, TranslateModule, SanitizedHtmlPipe,
    MatCheckboxModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatProgressBarModule, MatTabsModule
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

  constructor(public router: Router, private eventsService: EventsService, private verificationService: VerificationService, private routes: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
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
      } else {
        this.eventsService.getEvent(this.eventId, this.eventSecret).subscribe(
          (response) => {
            this.event = response;
            this.ensureLanguageKeys();
            this.initialEmail = response.email;
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });

  
  }
  onSubmit() {
    if (this.event) { 
      this.event.secretKey = this.eventSecret;
      this.ensureLanguageKeys();
      if (this.initialEmail != this.event.email) {
        if (!this.codeGenerated) {
          //send email
          this.verificationService.SendVerificationEmail(this.event.email).subscribe(
            (response) => {
              console.log(response);
              this.codeGenerated = true;
            },
            error => {
              console.log(error);
              alert(this.translate.instant('Sending Email validation failed, try again later!'));
            }
          );
          return;
        } else {
          //validate email

          this.verificationService.VerifyEmail(this.emailValidationCode, this.event.email).subscribe(
            (response) => {
              console.log(response);

              this.initialEmail = this.event?.email ?? "";
              this.updateEvent();
            },
            error => {
              console.log(error);
              alert(this.translate.instant('Email validation failed, code not valid!'));
            }
          );
        }
      } else {
        this.updateEvent();
      }
    }
  }

    private updateEvent() {
        this.eventsService.updateEvent(this.event).subscribe(
            (response) => {
                console.log(response);


                if (this.event && this.event.id === "00000000-0000-0000-0000-000000000000") {
                    this.router.navigate(['/', response.hamEvent.id, response.secretKey]);
                } else {
                    this.router.navigate(['/', this.eventId, this.eventSecret]);
                }
            },
          error => {
            alert(error);
              console.log(error);
            }
        );
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
