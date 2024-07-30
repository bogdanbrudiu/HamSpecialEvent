import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) { }
  SendVerificationEmail(email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/verification/send-verification?email=' + encodeURIComponent(email));
  }
  VerifyEmail(token:string, email: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/verification/verify?token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email), {
      responseType: 'text',
    });
  }
}
