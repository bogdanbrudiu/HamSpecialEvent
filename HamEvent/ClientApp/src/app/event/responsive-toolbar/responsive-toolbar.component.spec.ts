import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResponsiveToolbarComponent } from './responsive-toolbar.component';

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
});
