import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResponsiveToolbarComponent } from './responsive-toolbar.component';
import { AdminEventNavigationService } from '../../admin/admin-event-navigation.service';

describe('ResponsiveToolbarComponent', () => {
  let component: ResponsiveToolbarComponent;
  let fixture: ComponentFixture<ResponsiveToolbarComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResponsiveToolbarComponent, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(ResponsiveToolbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    component.event = {
      id: 'evt-1',
      name: 'Event Name',
      subtitle: '',
      startDate: '',
      endDate: '',
      description: { en: '' },
      rules: { en: '' },
      email: '',
      hasTop: true,
      diploma: '',
      days: 0,
      first: '',
      last: '',
      count: 0,
      unique: 0,
      excludeCallsigns: '',
      excludedCallsigns: [],
      secretKey: '',
      icon: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits tabChanged when a tab item is clicked and tab selection is enabled', () => {
    component.enableTabSelection = true;
    spyOn(component.tabChanged, 'emit');

    const logsItem = component.menuItems.find(item => item.id === 'logs');
    expect(logsItem).toBeTruthy();

    component.onMenuItemClick(logsItem!);

    expect(component.selectedTab).toBe('logs');
    expect(component.tabChanged.emit).toHaveBeenCalledWith('logs');
  });

  it('navigates back to the event page when a tab item is clicked and tab selection is disabled', () => {
    spyOn(router, 'navigate');
    const logsItem = component.menuItems.find(item => item.id === 'logs');
    expect(logsItem).toBeTruthy();

    component.onMenuItemClick(logsItem!);

    expect(router.navigate).toHaveBeenCalledWith(['event/evt-1'], { queryParams: { tab: 'logs' } });
  });

  it('navigates for linked non-tab items', () => {
    spyOn(router, 'navigate');
    const onAirItem = component.menuItems.find(item => item.id === 'onair');
    expect(onAirItem).toBeTruthy();

    component.onMenuItemClick(onAirItem!);

    expect(router.navigate).toHaveBeenCalledWith(['event/evt-1/live']);
  });

  it('does not emit or navigate for disabled items', () => {
    component.enableTabSelection = true;
    const disabledItem = component.menuItems.find(item => item.id === 'livestream');
    expect(disabledItem).toBeTruthy();
    spyOn(component.tabChanged, 'emit');
    spyOn(router, 'navigate');

    component.onMenuItemClick(disabledItem!);

    expect(component.tabChanged.emit).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('returns to admin QSOs and editing with the original key', () => {
    TestBed.inject(AdminEventNavigationService).remember('evt-1', 'master-key');
    spyOn(router, 'navigate');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Admin QSOs');
    expect(fixture.nativeElement.textContent).toContain('Edit Event');
    component.openAdmin('qsos');
    expect(router.navigate).toHaveBeenCalledWith(['/admin', 'evt-1', 'master-key', 'qsos']);
    component.openAdmin('edit');
    expect(router.navigate).toHaveBeenCalledWith(['/admin', 'evt-1', 'master-key', 'edit']);
  });

  it('does not expose admin return actions for another event or public visitors', () => {
    TestBed.inject(AdminEventNavigationService).remember('different-event', 'master-key');
    spyOn(router, 'navigate');
    fixture.detectChanges();
    expect(component.adminSecret).toBeUndefined();
    expect(fixture.nativeElement.textContent).not.toContain('Admin QSOs');
    expect(fixture.nativeElement.textContent).not.toContain('Edit Event');
    component.openAdmin('qsos');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
