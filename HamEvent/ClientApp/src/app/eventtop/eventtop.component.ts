import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HamEvent, EventsService } from '../events.service';
import { Participant, QSO, QSOsService } from '../qsos.service';

@Component({
  selector: 'app-eventtop',
  templateUrl: './eventtop.component.html'
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


  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService) {

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
    this.router.navigate([this.eventId]);
  }
  loadData() {
    this.qsosService.getTop(this.eventId, this.searchInput, this.page, this.tableSize).subscribe(
      (response) => {
        this.Top = response.data;
        this.count = response.count;
        this.loaded = true;
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


}


