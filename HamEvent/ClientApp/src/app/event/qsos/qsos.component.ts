import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HamEvent, EventsService } from '../../events.service';
import { QSO, QSOsService } from '../../qsos.service';
import { PdfService } from '../../pdf.service';
import { MatTableModule, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatTableDataSource } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf, DatePipe } from '@angular/common';
import { ResponsiveToolbarComponent } from '../responsive-toolbar/responsive-toolbar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

declare let gtag: Function;
@Component({
    selector: 'app-qsos',
    templateUrl: './qsos.component.html',
    styleUrls: ['./qsos.component.css'],
  standalone: true,
  imports: [MatTableModule, NgIf, ResponsiveToolbarComponent, MatGridListModule, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe, TranslateModule, MatPaginatorModule]
})
export class QSOsComponent implements OnInit, AfterViewInit {

  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];

  searchForm!: FormGroup;
  public QSOs: QSO[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;

  public eventId: string = '';
  public event: HamEvent | undefined;
  public searchInput = '';
  public loaded = false;

  public blob: Blob | undefined;
  public isLive: boolean = false;

  displayedColumns: string[] = ['callsign1', 'callsign2', 'mode', 'band', 'timestamp'];
  @ViewChild(MatTable) table!: MatTable<HamEvent>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<HamEvent>();
  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private pdfService: PdfService) {

    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventsService.getEvent(this.eventId).subscribe(
        (response) => {
          this.event = response;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.qsosService.getLive(this.eventId).subscribe(
        (response) => {
          this.isLive = response != null && (<Array<any>>response).length > 0;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );

      this.loadData();
    });
  }
  searchIsValid() {
    return !(this.searchForm.get('search')?.value == "" || this.searchForm.get('search')?.value == null);
  }
  submitForm() {
    this.searchInput = encodeURIComponent(this.searchForm.get('search')?.value);
    this.loaded = false;
    this.page = 0;
    this.loadData();
    
  }

  top() {
    this.router.navigate([this.eventId, 'top']);
  }

  genPdf() {

    return this.pdfService.getPdf(this.eventId, this.searchInput).subscribe((data: any) => {
      gtag('event', "GetDiplomaFromAdmin", {
        'event_category': "diploma",
        'event_label': "qsos",
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


  loadData() {
    this.qsosService.getAllQSOs(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.QSOs = response.data;
        this.dataSource = response.data;
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

  onTableDataChange(event: any) {
    this.page = event;
    this.loadData();
  }

  qualifiesForDiploma() {
    return this.QSOs.length > 0 && this.searchInput.length > 0 && this.loaded;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}


