import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class EventsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) { }

  getAllEvents(page: number, size: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/hamevent/hamevents?page='+page+'&size='+size);
  }
  getEvent(eventId:string, secret:string="", lang:string=""): Observable<any> {
    const secretPart = secret ? `secret=${encodeURIComponent(secret)}` : '';
    const langPart = lang ? `lang=${encodeURIComponent(lang)}` : '';
    const query = [secretPart, langPart].filter(q => q).join('&');
    const suffix = query ? `?${query}` : '';
    return this.http.get(this.baseUrl + 'api/hamevent/hamevent/' + eventId + suffix);
  }
  updateEvent(event:any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'api/hamevent/hamevent/', event);
  }
  recoverAdminLinks(email: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'api/hamevent/hamevent/recover', { email });
  }
}
export interface HamEvent {
  id: string;
  name: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: { [lang: string]: string };
  rules: { [lang: string]: string };
  email: string;
  hasTop: boolean;
  diploma: string;
  days: number;
  first: string;
  last: string;
  count: number;
  unique: number;
  excludeCallsigns: string;
  excludedCallsigns: string[];
  secretKey: string;
  icon: string;
}
