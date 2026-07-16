import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { EventsService, HamEvent } from '../../events.service';
import { Operator, QSO, QSOsService } from '../../qsos.service';
import { TranslateModule } from '@ngx-translate/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [NgIf, RouterLinkActive, RouterLink, NgClass, ExtendedModule, NgFor, TranslateModule]
})
export class DashboardComponent {
  public eventId: string = '';
  public event: HamEvent | undefined;
  public isLive: boolean = false;
  public Operators: Operator[] = [];
  public QSOs: QSO[] = [];
    interval: any;

  constructor(private routes: ActivatedRoute, private eventsService: EventsService, private qsosService: QSOsService, private router: Router) {

  }
  bandStatus(band: string): boolean {
    if (this.Operators) {
      for (let operator of this.Operators) {
        if (this.status(operator, band) != "") {
          return true;
        }
      }
    }
    return false;
  }
  status(operator: Operator, band: string): string {
    if (operator.lastQSOs.filter(qso => qso.band.startsWith(band)).length > 0) {
      return operator.lastQSOs.filter(qso => qso.band.startsWith(band))[0].freq + "/" + operator.lastQSOs.filter(qso => qso.band.startsWith(band))[0].mode;
    }
    return "";
  }
  ngOnInit() {
    this.routes.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      this.eventsService.getEvent(this.eventId).subscribe(
        (response) => {
          this.event = response;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.qsosService.getLive(this.eventId).subscribe(
        (response) => {
          this.loadLive(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.interval = setInterval(() => {
        this.qsosService.getLive(this.eventId).subscribe(
          (response) => {
            this.loadLive(response);
          },
          (error) => {
            console.log(error);
          }
        );
      }, 10000);
    });
  }
  private loadLive(response: any) {
        this.isLive = response != null && (<Array<any>>response).length > 0;
        this.Operators = response;
        this.QSOs = [];
        this.Operators.forEach((operator) => {
            this.QSOs = this.QSOs.concat(operator.lastQSOs);
        });
        this.QSOs.sort((n1, n2) => new Date(n1.timestamp) > new Date(n2.timestamp) ? -1 : 1);
        console.log(response);
    }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
