import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { Employee } from '../@models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private membersList = new BehaviorSubject<Employee[]>([...defaultEmployees]);
  public members$ = this.membersList.asObservable();

  private currentUserSubject = new BehaviorSubject<Employee | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  getMembers(): Employee[] {
    return this.membersList.value;
  }

  getMemberById(id: number): Employee | null {
    return this.membersList.value.find(member => member.id === id) || null;
  }
  addMember(member: Employee): void {
    const currentMembers = this.membersList.value;
    if (!currentMembers.find(m => m.id === member.id)) {
      this.membersList.next([...currentMembers, member]);
    }
  }

  removeMember(member: Employee): void {
    const currentMembers = this.membersList.value;
    this.membersList.next(currentMembers.filter(m => m.id !== member.id));
  }

  updateMembers(members: Employee[]): void {
    this.membersList.next(members);
  }

  setCurrentUser(user: Employee | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Employee | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<Employee | null> {
    return this.currentUser$;
  }
}
