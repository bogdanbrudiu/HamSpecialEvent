import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adminqsos',
  templateUrl: './adminqsos.component.html'
})
export class AdminQSOsComponent {

  public balance = '';


  searchForm!: FormGroup;
  public QSOs: QSO[] = [];
  public eventId: string = '';
  public eventsecret: string = '';
  public searchInput = '';
  public loaded = false;
  public blob: Blob | undefined;

  constructor(public http: HttpClient, private formBuilder: FormBuilder, @Inject('BASE_URL') public baseUrl: string, private routes: ActivatedRoute) {

    this.searchForm = this.formBuilder.group({
      search: "",
    });
  }

  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventsecret = params.get('secret')!;
      this.loadData();
    });
  }

  submitForm() {
    this.searchInput = encodeURIComponent(this.searchForm.get('search')?.value);
    this.loaded = false;
    this.loadData();
 
  }

  genPdf() {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };

    return this.http.get(this.baseUrl + 'hamevent/Diploma/'+encodeURIComponent(this.eventId)+'/' + this.searchInput, httpOptions).subscribe((data:any) => {

      this.blob = new Blob([data], { type: 'application/pdf' });

      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "diploma.pdf";
      link.click();

    });
  }

    doit() {
    this.http.get<BalanceResult>(this.baseUrl + 'hamevent/balanceDoIt').subscribe(result => {
    }, error => console.error(error));

    this.loadData();

  }


  loadData() {
    this.http.get<QSO[]>(this.baseUrl + 'hamevent/'+encodeURIComponent(this.eventId)+'?callsign=' + this.searchInput).subscribe(result => {
      this.QSOs = result;
      this.loaded = true;
      console.log('base URL: ' + this.baseUrl);
      console.log('search input: ' + this.searchInput);
    }, error => console.error(error));



    this.http.get<BalanceResult>(this.baseUrl + 'hamevent/balance').subscribe(result => {
      this.balance = result.balance;
    }, error => console.error(error));


  }
  qualifiesForDiploma() {
    return this.QSOs.length > 0 && this.searchInput.length > 0 && this.loaded;
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

interface BalanceResult {
  balance: string;
}
