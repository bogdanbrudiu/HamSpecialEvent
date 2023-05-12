import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public QSOs: QSO[] = [];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<QSO[]>(baseUrl + 'hamevent').subscribe(result => {
      this.QSOs = result;
    }, error => console.error(error));
  }
}

interface QSO {
  Callsign1: string;
  Callsign2: string;
  RST1: string;
  RST2: string;
  Mode: number;
  Band: number;
  Timestamp: Date;
}
