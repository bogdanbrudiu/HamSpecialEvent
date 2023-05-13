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
  public loaded = false;
  public blob: Blob | undefined;

  constructor(public http: HttpClient, private formBuilder: FormBuilder, @Inject('BASE_URL') public baseUrl: string) {
    this.loadData()
    this.searchForm = this.formBuilder.group({
      search: "",
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

