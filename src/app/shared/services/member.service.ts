import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { Employee } from '../@models/employee.model';
import { EmployeeAllocationUI, EmployeeUI } from '../@models/employee-ui.model';
import { EmployeeMapper } from '../@mappers/member-mapper';
import { UserRoles } from '../@config/user-roles';

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

  getAllMembers(){
    const members = this.membersList.value.filter(emp=> emp.role === UserRoles.Member);
    return of(EmployeeMapper.convertEmployeeToUIModel(members));
  }

  getMembersCount(): number {
    return this.membersList.value.length;
  }

  getMemberById(id: number): Observable<EmployeeUI> {
    const member = this.membersList.value.find(member => member.id === id);
    if (member) {
      return of(EmployeeMapper.convertEmployeeToUIModel([member])[0]);
    }
    return throwError(()=> new Error('Api returned null data'));
  }

  getMemberToUpdateAllocation(id:number): Observable<EmployeeAllocationUI>{
    const member = this.membersList.value.find(member => member.id === id);
    if(member){
      return of(EmployeeMapper.getEmployeeUIToUpdateAllocation(member));
    }
    return throwError(()=> new Error('Api returned null data'));
  }

  getCurrentUserDetails(): Observable<EmployeeUI | null> {
    return of(this.currentUserSubject?.value);
  }

  addMember(member: EmployeeUI): void {
    const currentMembers = this.membersList.value;
    if (!currentMembers.find(m => m.id === member.id)) {
        const employee = EmployeeMapper.convertUIModelToEmployee(member);
      this.membersList.next([...currentMembers, employee]);
      console.log("Member added:",  this.membersList.value);
    }
  }
  updateMember(updatedMember: EmployeeAllocationUI): Observable<{message: string}> {
    const currentMembers = this.membersList.value;
    const index = currentMembers.findIndex(m => m.id === updatedMember.id);
    const employee = EmployeeMapper.updateEmployeeAllocationInfoToEmployee(updatedMember, currentMembers[index]);
    currentMembers[index] = employee;
    this.membersList.next([...currentMembers]);
    return of({message: "Member updated successfullly!"});
  }

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
