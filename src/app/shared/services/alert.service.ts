import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  public alert$ = this.alertSubject.asObservable();

   constructor() {
  }
  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertSubject.next({ message, type });
  }

  hideAlert(): void {
    this.alertSubject.next(null);
  }
}