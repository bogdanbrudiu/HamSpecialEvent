import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { HamEvent, EventsService } from '../../events.service';
import { Participant, QSO, QSOsService } from '../../qsos.service';
import { PdfService } from '../../pdf.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ResponsiveToolbarComponent } from '../responsive-toolbar/responsive-toolbar.component';
declare let gtag: Function;

@Component({
  selector: 'app-eventtop',
  templateUrl: './eventtop.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule, ReactiveFormsModule, NgxPaginationModule, ResponsiveToolbarComponent]
})
export class EventTopComponent {
  searchForm!: FormGroup;
  public Top: Participant[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;

  public eventId: string = '';
  public event: HamEvent | undefined;
  public searchInput = '';
  public loaded = false;
  public blob: Blob | undefined;
  public isLive: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private pdfService: PdfService, private translate: TranslateService) {

    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }

  get localizedDescription(): string {
    const descriptions = (this.event?.description ?? {}) as { [lang: string]: string };
    if (typeof descriptions === 'string') {
      return descriptions;
    }
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return descriptions[currentLang] || descriptions['en'] || Object.values(descriptions)[0] || '';
  }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventsService.getEvent(this.eventId).subscribe(
        (response) => {
          this.event = response;
        },
        () => {}
      );
      this.qsosService.getLive(this.eventId).subscribe(
        (response) => {
          this.isLive = response != null && (<Array<any>>response).length > 0;
        },
        () => {}
      );
      this.loadData();
    });
  }
  submitForm() {
    this.searchInput = encodeURIComponent(this.searchForm.get('search')?.value);
    this.loaded = false;
    this.page = 0;
    this.loadData();
    
  }
  qsos() {
    this.router.navigate(['/event', this.eventId]);
  }
  loadData() {
    this.qsosService.getTop(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.Top = response.data;
        this.count = response.count;
        this.loaded = true;
      },
      () => {}
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.loadData();
  }
  genPdf() {

    return this.pdfService.getPdf(this.eventId, this.searchInput).subscribe((data: any) => {
      gtag('event', "GetDiplomaFromAdmin", {
        'event_category': "diploma",
        'event_label': "top",
        'value': this.searchInput
      });
      this.blob = new Blob([data], { type: 'application/pdf' });

      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = this.event?.name + " " + this.searchInput + ".pdf";
      link.click();

    });

  }
  qualifiesForDiploma() {
    return this.Top.length > 0 && this.searchInput.length > 0 && this.loaded;
  }
}


