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
import { TranslateModule } from '@ngx-translate/core';
import { QSO, QSOsService } from '../qsos.service';
import { MatTableModule, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [MatTableModule, NgIf, ResponsiveToolbarComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe, TranslateModule, MatPaginatorModule, NgIf, ResponsiveToolbarComponent, RouterLink, MatIconModule, MatDivider, DatePipe, MatTabsModule, MatProgressBarModule, MatTable, TranslateModule]
})
export class EventComponent implements OnInit {

  public eventId: string = '';
  public event!: HamEvent;
  public searchInput = '';
  public loaded = true;
  public logs: QSO[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  displayedColumns: string[] = ['callsign1', 'callsign2', 'mode', 'band', 'timestamp'];
  @ViewChild(MatTable) table!: MatTable<HamEvent>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public blob: Blob | undefined;
  public isLive: boolean = false;
  searchForm!: FormGroup;
  gridColumns = 3;
  sanitizedDescription: SafeHtml | undefined;

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }
  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private sanitizer: DomSanitizer) {
    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }

  ngOnInit() {
    console.log('EventComponent ngOnInit');
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      console.log(this.eventId);
      this.eventsService.getEvent(this.eventId).subscribe(
        (response) => {
          this.event = response;
          console.log(response);
          this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.event.diploma);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
  submitForm() {
    console.log('submitForm');
    this.eventsService.getEvent(this.searchInput).subscribe(
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

  tabClick(tab: any) {
    console.log(tab);
    if (tab.index == 2)
      this.loadData();
  }
}
