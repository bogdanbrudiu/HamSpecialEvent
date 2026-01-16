import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BandModeStat, EventStats, FoxDailyStat, QSOsService } from '../../qsos.service';

interface FoxDailyGroup {
  fox: string;
  entries: FoxDailyStat[];
}

@Component({
  selector: 'app-event-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnChanges {
  @Input() eventId!: string;

  stats?: EventStats;
  loading = false;
  foxDailyGroups: FoxDailyGroup[] = [];
  maxDailyCount = 0;

  constructor(private qsosService: QSOsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && changes['eventId'].currentValue) {
      this.loadStats();
    }
  }

  get bandModeBands(): string[] {
    const list = this.stats?.bandModeTotals?.map(b => b.band) ?? [];
    return [...new Set(list)].sort();
  }

  get bandModeModes(): string[] {
    const list = this.stats?.bandModeTotals?.map(b => b.mode) ?? [];
    return [...new Set(list)].sort();
  }

  bandModeCount(mode: string, band: string): number {
    return this.stats?.bandModeTotals?.find(b => b.mode === mode && b.band === band)?.count ?? 0;
  }

  get foxBands(): string[] {
    const list = this.stats?.foxBandTotals?.map(b => b.band) ?? [];
    return [...new Set(list)].sort();
  }

  foxBandCount(fox: string, band: string): number {
    return this.stats?.foxBandTotals?.find(b => b.fox === fox && b.band === band)?.count ?? 0;
  }

  foxBandTotal(fox: string): number {
    return this.stats?.foxBandTotals?.filter(b => b.fox === fox).reduce((sum, cur) => sum + cur.count, 0) ?? 0;
  }

  foxBandColumnTotal(band: string): number {
    return this.stats?.foxBandTotals?.filter(b => b.band === band).reduce((sum, cur) => sum + cur.count, 0) ?? 0;
  }

  get foxList(): string[] {
    const list = this.stats?.foxBandTotals?.map(f => f.fox) ?? [];
    return [...new Set(list)].sort();
  }

  private loadStats(): void {
    if (!this.eventId) {
      return;
    }
    this.loading = true;
    this.qsosService.getStats(this.eventId).subscribe({
      next: (res) => {
        this.stats = res;
        this.prepareDailyGroups(res.foxDailyTotals || []);
        this.loading = false;
      },
      error: () => {
        this.stats = undefined;
        this.foxDailyGroups = [];
        this.loading = false;
      }
    });
  }

  private prepareDailyGroups(entries: FoxDailyStat[]): void {
    const grouped: Record<string, FoxDailyStat[]> = {};
    entries.forEach(e => {
      grouped[e.fox] = grouped[e.fox] || [];
      grouped[e.fox].push(e);
    });
    this.foxDailyGroups = Object.keys(grouped)
      .sort()
      .map(key => ({ fox: key, entries: grouped[key].sort((a, b) => a.day.localeCompare(b.day)) }));
    this.maxDailyCount = entries.reduce((max, cur) => Math.max(max, cur.count), 0);
  }

  buildLinePoints(entries: FoxDailyStat[], width = 320, height = 140): string {
    if (!entries.length || this.maxDailyCount === 0) {
      return '';
    }
    const step = entries.length > 1 ? width / (entries.length - 1) : width / 2;
    return entries
      .map((entry, idx) => {
        const x = Math.round(idx * step);
        const ratio = entry.count / this.maxDailyCount;
        const y = Math.round(height - ratio * height);
        return `${x},${y}`;
      })
      .join(' ');
  }

  bandModeRowTotal(mode: string): number {
    return this.stats?.bandModeTotals?.filter(b => b.mode === mode).reduce((sum, cur) => sum + cur.count, 0) ?? 0;
  }

  bandModeColumnTotal(band: string): number {
    return this.stats?.bandModeTotals?.filter(b => b.band === band).reduce((sum, cur) => sum + cur.count, 0) ?? 0;
  }
}
