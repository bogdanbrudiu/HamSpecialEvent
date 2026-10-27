import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BandModeStat {
  band: string;
  mode: string;
  count: number;
}

export interface FoxBandStat {
  fox: string;
  band: string;
  count: number;
  total: number;
}

export interface FoxDailyStat {
  fox: string;
  day: string;
  count: number;
}

export interface EventStats {
  totalQsos: number;
  bandModeTotals: BandModeStat[];
  foxBandTotals: FoxBandStat[];
  foxDailyTotals: FoxDailyStat[];
}

@Injectable({
  providedIn: 'root'
})
export class QSOsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) { }

  getAllQSOs(eventId: string, callsign: string, page: number, pagesize: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/hamevent/QSOs/' + encodeURIComponent(eventId)+"?page="+page+"&pagesize="+pagesize+"&callsign="+encodeURIComponent(callsign));
  }

  delete(qso: QSO, eventId: string, secret: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/hamevent/QSOs/' + encodeURIComponent(eventId) + "/" + encodeURIComponent(secret) + "?"
      + "callsign1="+encodeURIComponent(qso.callsign1) + "&"
      + "callsign2=" + encodeURIComponent(qso.callsign2) + "&"
      + "mode=" + encodeURIComponent(qso.mode) + "&"
      + "band=" + encodeURIComponent(qso.band) + "&"
      + "timestamp=" + encodeURIComponent(qso.timestamp));
  }

  deleteAll(eventId: string, secret: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/hamevent/QSOs/' + encodeURIComponent(eventId) + "/" + encodeURIComponent(secret)+"/all");
  }

  exportAll(eventId: string, secret: string): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get(this.baseUrl + 'api/hamevent/ADIF/' + encodeURIComponent(eventId) + "/" + encodeURIComponent(secret) , httpOptions);
  }

  update(qso: QSO, updatedQSO: QSO, eventId: string, secret: string): Observable<any> {
    return this.http.post(this.baseUrl + 'api/hamevent/QSOs/' + encodeURIComponent(eventId) + "/" + encodeURIComponent(secret) + "?"
      + "callsign1=" + encodeURIComponent(qso.callsign1) + "&"
      + "callsign2=" + encodeURIComponent(qso.callsign2) + "&"
      + "mode=" + encodeURIComponent(qso.mode) + "&"
      + "band=" + encodeURIComponent(qso.band) + "&"
      + "timestamp=" + encodeURIComponent(qso.timestamp),  updatedQSO  );
  }

  getTop(eventId: string, callsign: string, page: number, size: number): Observable<any> {
    return this.http.get(this.baseUrl + 'api/hamevent/Top/' + encodeURIComponent(eventId) + "?page=" + page + "&pagesize=" + size + "&callsign=" + encodeURIComponent(callsign));
  }

  getLive(eventId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/hamevent/Live/' + encodeURIComponent(eventId));
  }

  getStats(eventId: string): Observable<EventStats> {
    return this.http.get<EventStats>(this.baseUrl + 'api/hamevent/Stats/' + encodeURIComponent(eventId));
  }
}
export interface QSO {
  callsign1: string;
  callsign2: string;
  rst1: string;
  rst2: string;
  freq: string;
  mode: string;
  band: string;
  timestamp: string;
}
export interface Participant {
  callsign: string;
  points: string;
  mode: string;
  band: string;
  count: string;
  rank: string;
}
export class Operator {
  callsign: string="";
  lastQSOs: QSO[]=[];
  }
export interface PageResult<T> {
  count: number;
  data: T[];
}
