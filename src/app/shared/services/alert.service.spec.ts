import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Alert, AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show Alert', fakeAsync(() => {
    let result! : Alert | null;

    service.alert$.subscribe((alert)=> {
        result = alert;
    });

    service.showAlert('show alert', 'success');
    tick();

    expect(result).not.toBeNull();
    expect(result).toEqual({
        message: 'show alert',
        type: 'success'
    });

  }));

  it('should hide Alert', fakeAsync(() => {
    let result : Alert | null = {message: 'show alert', type: 'success'};

    service.alert$.subscribe((alert)=> {
        result = alert;
    });

    service.hideAlert();
    tick();
    
    expect(result).toBeNull();    
  }));

});
