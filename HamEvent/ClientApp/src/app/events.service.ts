import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class EventsService {

  constructor(private http: HttpClient,@Inject('BASE_URL') public baseUrl: string) { }
  getAllEvents(page: number, size: number): Observable<any> {
    return this.http.get(this.baseUrl + 'hamevent/hamevents?page='+page+'&size='+size);
  }
  getEvent(eventId:string, secret:string=""): Observable<any> {
    return this.http.get(this.baseUrl + 'hamevent/hamevent/' + eventId + (secret ? '?secret=' + encodeURIComponent(secret):''));
  }
  updateEvent(event:any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'hamevent/hamevent/', event);
  }
}
export interface HamEvent {
  id: string;
  name: string;
  description: string;
  hasTop: boolean;
  diploma: string;
  days: number;
  first: string;
  last: string;
  count: number;
  unique: number;
}
