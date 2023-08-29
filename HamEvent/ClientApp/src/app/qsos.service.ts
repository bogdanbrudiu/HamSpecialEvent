import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QSOsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) { }
  getAllQSOs(eventId: string, callsign: string, page: number, size: number): Observable<any> {
    return this.http.get(this.baseUrl + 'hamevent/QSOs/' + encodeURIComponent(eventId)+"?page="+page+"&size="+size+"&callsign="+encodeURIComponent(callsign));
  }
}
