import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  searchForm!: FormGroup;
  public QSOs: QSO[] = [];
  public searchInput = '';


  constructor(public http: HttpClient, private formBuilder: FormBuilder, @Inject('BASE_URL') public baseUrl: string) {
    this.loadData()
    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }

  submitForm() {
    this.searchInput = this.searchForm.get('search')?.value;
    this.loadData()
  }

  loadData() {
    this.http.get<QSO[]>(this.baseUrl + 'hamevent?callsign=' + this.searchInput).subscribe(result => {
      this.QSOs = result;
    }, error => console.error(error));
  }
}

interface QSO {
  callsign1: string;
  callsign2: string;
  rst1: string;
  rst2: string;
  mode: string;
  band: string;
  timestamp: Date;
}

