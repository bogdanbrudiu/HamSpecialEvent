import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService, HamEvent } from '../../events.service';
import { QSO, QSOsService } from '../../qsos.service';
import { PdfService } from '../../pdf.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UploadComponent } from '../upload/upload.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgIf, NgFor, DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditQsoDialogComponent } from './edit-qso-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';


declare let gtag: Function;
@Component({
   selector: 'app-adminqsos',
  templateUrl: './adminqsos.component.html',
  styleUrl: './adminqsos.component.css',
  standalone: true,
  imports: [NgIf, UploadComponent, RouterLink, ReactiveFormsModule, NgFor, DatePipe, FormsModule, NgxPaginationModule, TranslateModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MatDialogModule, MatSortModule, MatSnackBarModule
  ]
})
export class AdminQSOsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  public dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public displayedColumns: string[] = ['callsign1', 'callsign2', 'mode', 'band', 'date', 'actions'];

  public searchForm!: FormGroup;
  public QSOs: any[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  public eventId: string = '';
  public eventSecret: string = '';
  public event: HamEvent | undefined;
  public originalQSO: QSO | undefined;
  public searchInput = '';
  public loaded = false;
  public blob: Blob | undefined;
  public isLive: boolean = false;
  @ViewChild(UploadComponent) upload!: UploadComponent;


  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private pdfService: PdfService, private translate: TranslateService, public dialog: MatDialog,
    private snackBar: MatSnackBar) {

    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventSecret = params.get('secret')!;
      this.eventsService.getEvent(this.eventId, this.eventSecret).subscribe(
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
    this.dataSource.sort = this.sort;
  }

  submitForm() {
    this.searchInput = encodeURIComponent(this.searchForm.get('search')?.value);
    this.loaded = false;
    this.page = 1;
    this.loadData();
 
  }

  onMatPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.tableSize = event.pageSize;
    this.loadData();
  }

  editQSO(qso: any) {
    this.originalQSO = Object.assign({}, qso);
    qso.editable = true;
    const dialogRef = this.dialog.open(EditQsoDialogComponent, {
      width: '400px',
      data: { ...qso }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveQSO(result);
      }
    });
  }

  saveQSO(qso: any) {
    if (this.originalQSO) {
      this.qsosService.update(this.originalQSO, qso, this.eventId, this.eventSecret).subscribe(
        (response) => {
          this.loadData();
          console.log(response);
        },
        (error) => {
          console.log(error);
        });
      }
  }
  edit() {
    this.router.navigate([this.eventId, this.eventSecret,'edit']);
  }
  top() {
    this.router.navigate([this.eventId, 'top']);
  }
  live() {
    this.router.navigate([this.eventId, 'live']);
  }
  deleteall() {
    if (confirm(this.translate.instant('Are you sure?'))) {
      this.qsosService.deleteAll(this.eventId, this.eventSecret).subscribe(
        (response) => {
          this.loadData();
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  delete(qso: QSO) {
    this.qsosService.delete(qso, this.eventId, this.eventSecret).subscribe(
      (response) => {
        this.loadData();
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: this.translate.instant('Are you sure you want to delete this QSO?') }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.qsosService.delete(qso, this.eventId, this.eventSecret).subscribe(
          () => {
            this.loadData();
            this.snackBar.open(this.translate.instant('QSO deleted'), 'OK', { duration: 2000 });
          },
          () => this.snackBar.open(this.translate.instant('Delete failed'), 'OK', { duration: 2000 })
        );
      }
    });
  }
  exportall() {
    this.qsosService.exportAll(this.eventId, this.eventSecret).subscribe((data: any) => {

      this.blob = new Blob([data], { type: 'text/xml' });

      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "log.adif";
      link.click();

    });
  }
  genPdf() {
    return this.pdfService.getPdf(this.eventId, this.searchInput).subscribe((data: any) => {
      gtag('event', "GetDiplomaFromAdmin", {
        'event_category': "diploma",
        'event_label': "admin",
        'value': this.searchInput
      });
      this.blob = new Blob([data], { type: 'application/pdf' });

      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "diploma.pdf";
      link.click();

    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.qsosService.getAllQSOs(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.QSOs = response.data;
        this.dataSource.data = response.data;
        this.count = response.count;
        this.loaded = true;
        if (this.upload) {
          this.upload.message = '';
          this.upload.progress = 0;
        }
        //// Set paginator and sort after data is loaded
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;

        console.log(response);
      },
      (error) => {
        console.log(error);
        this.loaded = true;
        this.snackBar.open(this.translate.instant('Failed to load QSOs'), 'OK', { duration: 3000 });
      }
    );
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.loadData();
  }
  uploadFinished(event: any) {
    this.loadData();
  }
  qualifiesForDiploma() {
    return this.QSOs.length > 0 && this.searchInput.length > 0 && this.loaded;
  }
}




