import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Inject, Input } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() eventId: string='';
  @Input() eventsecret: string='';
  progress: number = 0;
  message: string = '';
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) { }

  ngOnInit() {
  }

  uploadFile = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(this.baseUrl + 'api/hamevent/' + encodeURIComponent(this.eventId) + '/' + encodeURIComponent(this.eventsecret) +'/upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.onUploadFinished.emit(event.body);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }
}
