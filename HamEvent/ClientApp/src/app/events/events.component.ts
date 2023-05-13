import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent {
  searchForm!: FormGroup;
  public Events: Event[] = [];
  public loaded = false;


  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string, private router: Router) {
    this.loadData()
   
  }



  loadData() {
    this.http.get<Event[]>(this.baseUrl + 'hamevent/hamevents').subscribe(result => {
      this.Events = result;
      this.loaded = true;

    }, error => console.error(error));


  }
  gotoEvent(event: Event) {
    this.router.navigateByUrl(event.id);
  }

}

interface Event {
  name: string;
  id: string;
}

