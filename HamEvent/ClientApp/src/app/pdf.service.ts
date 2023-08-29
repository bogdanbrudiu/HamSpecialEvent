import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) { }
  getPdf(eventId: string, callsign: string): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get(this.baseUrl + 'hamevent/Diploma/' + encodeURIComponent(eventId) + '/' + encodeURIComponent(callsign), httpOptions);
  }
}
