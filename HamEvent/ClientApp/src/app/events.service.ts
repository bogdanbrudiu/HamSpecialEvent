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
  getEvent(eventId:string): Observable<any> {
    return this.http.get(this.baseUrl + 'hamevent/hamevent/' + eventId);
  }
  updateEvent(event:any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'hamevent/hamevent/', event);
  }
}
export interface HamEvent {
  id: string;
  name: string;
  description: string;
  diploma: string;
}
