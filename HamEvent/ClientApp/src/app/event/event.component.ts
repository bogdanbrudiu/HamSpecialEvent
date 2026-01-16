import { Component, OnInit, ViewChild } from '@angular/core';
import { EventsService, HamEvent } from '../events.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { ResponsiveToolbarComponent } from './responsive-toolbar/responsive-toolbar.component';
import { NgIf, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
//import { MatInputModule } from '@angular/material/input';
//import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QSO, QSOsService } from '../qsos.service';
import { MatTableModule, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatTableModule, NgIf, ResponsiveToolbarComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe, TranslateModule, MatPaginatorModule, NgIf, ResponsiveToolbarComponent, RouterLink, MatIconModule, MatDivider, DatePipe, MatTabsModule, MatProgressBarModule, MatTable, TranslateModule]
})
export class EventComponent implements OnInit {

  public eventId: string = '';
  public event!: HamEvent;
  public searchInput = '';
  public loaded = true;
  public logs: QSO[] = [];
  public top: QSO[] = [];
  page: number = 0;
  count: number = 0;
  tableSize: number = 20;
  displayedColumns: string[] = ['callsign1', 'callsign2', 'mode', 'band', 'timestamp'];
  displayedColumnsTop: string[] = ['callsign1', 'count', 'mode', 'band', 'points', 'rank'];
  @ViewChild(MatTable) table!: MatTable<HamEvent>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public blob: Blob | undefined;
  public isLive: boolean = false;
  searchForm!: FormGroup;
  gridColumns = 3;
  public sanitizedDescription: SafeHtml | undefined;
  public sanitizedRules: SafeHtml | undefined;
  public currentLang = 'en';

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }
  private pickLocalized(value: { [lang: string]: string } | undefined): string {
    if (!value) return '';
    const lang = this.translate.currentLang || this.currentLang;
    const fallback = value['en'] || Object.values(value)[0] || '';
    return value[lang] || fallback || '';
  }
  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private sanitizer: DomSanitizer, private translate: TranslateService) {
    this.searchForm = this.formBuilder.group({
      search: "",
    });
    this.currentLang = this.translate.currentLang || 'en';
   }

  ngOnInit() {
    console.log('EventComponent ngOnInit');
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      console.log(this.eventId);
      this.eventsService.getEvent(this.eventId, '', this.currentLang).subscribe(
        (response) => {
          this.event = response;
          console.log(response);
          this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.pickLocalized(this.event.description));
          this.sanitizedRules = this.sanitizer.bypassSecurityTrustHtml(this.pickLocalized(this.event.rules));
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
  submitForm() {
    console.log('submitForm');
    this.eventsService.getEvent(this.searchInput, '', this.currentLang).subscribe(
      (response) => {
        this.event = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  //searchForm() {
  //  console.log('searchForm');
  //  this.router.navigate(['events/' + this.searchInput]);
  //}

  loadData() {
    this.qsosService.getAllQSOs(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.logs = response.data;
        //this.dataSource = response.data;
        this.count = response.count;
        this.loaded = true;
        this.table.renderRows();

        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadTop() {
    this.qsosService.getTop(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.top = response.data;
        //this.dataSource = response.data;
        this.count = response.count;
        this.loaded = true;
        this.table.renderRows();

        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  tabClick(tab: any) {
    console.log(tab);
    if (tab.index == 2)
      this.loadData();
    if (tab.index == 3)
      this.loadTop();
  }
}
