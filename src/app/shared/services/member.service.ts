import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { Employee } from '../@models/employee.model';
import { EmployeeUI } from '../@models/employee-ui.model';
import { EmployeeMapper } from '../@mappers/member-mapper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private membersList = new BehaviorSubject<Employee[]>([...defaultEmployees]);
  public members$ = this.membersList.asObservable();

  private currentUserSubject = new BehaviorSubject<EmployeeUI | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
  }

  getMembers(): EmployeeUI[] {
    return EmployeeMapper.convertEmployeeToUIModel(this.membersList.value);
  }

  getMembersCount(): number {
    return this.membersList.value.length;
  }

  getMemberById(id: number): EmployeeUI | null {
    const member = this.membersList.value.find(member => member.id === id);
    if (member) {
      return EmployeeMapper.convertEmployeeToUIModel([member])[0];
    }
    return null;
  }
  addMember(member: EmployeeUI): void {
    const currentMembers = this.membersList.value;
    if (!currentMembers.find(m => m.id === member.id)) {
        const employee = EmployeeMapper.convertUIModelToEmployee(member);
      this.membersList.next([...currentMembers, employee]);
    }
  }

//   removeMember(member: Employee): void {
//     const currentMembers = this.membersList.value;
//     this.membersList.next(currentMembers.filter(m => m.id !== member.id));
//   }

//   updateMembers(members: Employee[]): void {
//     this.membersList.next(members);
//   }

  setCurrentUser(user: EmployeeUI | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): EmployeeUI | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<EmployeeUI | null> {
    return this.currentUser$;
  }
}
