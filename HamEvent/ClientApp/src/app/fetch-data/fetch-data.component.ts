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
  public balance = '';
  public searchInput = '';
  public loaded = false;
  public blob: Blob | undefined;
  public index: number = 0;
  public countItems: number = 100;

  constructor(public http: HttpClient, private formBuilder: FormBuilder, @Inject('BASE_URL') public baseUrl: string) {
    this.loadData()
    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }
  //doit() {
  //  this.http.get<BalanceResult>(this.baseUrl + 'hamevent/balanceDoIt').subscribe(result => {
  //  }, error => console.error(error));

  //  this.loadData();

  //}
  submitForm() {
    this.searchInput = encodeURIComponent(this.searchForm.get('search')?.value);
    this.loaded = false;
    this.index = 0;
    this.loadData();
    
  }

  genPdf() {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };

    return this.http.get(this.baseUrl + 'hamevent/Diploma/' + this.searchInput, httpOptions).subscribe((data:any) => {

      this.blob = new Blob([data], { type: 'application/pdf' });

      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "diploma.pdf";
      link.click();

    });
  }

  loadData() {
    this.http.get<QSO[]>(this.baseUrl + 'hamevent?callsign=' + this.searchInput).subscribe(result => {
      this.QSOs = result;
      this.loaded = true;
      console.log('base URL: ' + this.baseUrl);
      console.log('search input: ' + this.searchInput);
    }, error => console.error(error));


    //this.http.get<BalanceResult>(this.baseUrl + 'hamevent/balance').subscribe(result => {
    //  this.balance = result.balance;
    //}, error => console.error(error));
  }
  qualifiesForDiploma() {
    return this.QSOs.length > 0 && this.searchInput.length > 0 && this.loaded;
  }

  prevPage() {
    if (this.index > 0) this.index = this.index - 1;
  }

  nextPage() {
    this.index = this.index + 1;
  }
}

interface PageResult<T>
{
  count: number;
  pageIndex: number;
  pageSize: number;
  items: T[];
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
//interface BalanceResult {
//  balance: string;
//}
