import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { Employee } from '../@models/employee.model';
import { EmployeeAllocationUI, EmployeeDetailsFormData, EmployeeIdentification, EmployeeUI } from '../@models/employee-ui.model';
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


  getAllMembers(): Observable<EmployeeUI[]>{
    const members = this.membersList.value.filter(emp=> emp.role === UserRoles.Member);
    return of(EmployeeMapper.convertEmployeeToUIModel(members));
  }

  getAllMemberIdsAndNames(): Observable<EmployeeIdentification[]> {
    const members = this.membersList.value.filter(emp=> emp.role === UserRoles.Member);
    return of(EmployeeMapper.getAllEmployeesIdsAndNames(members));
  }


  getCurrentMemberId(): number {
    return 100000 + this.membersList.value.length;
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

  addMember(memberFormData: EmployeeDetailsFormData):  Observable<{message: string}> {
    const currentMembers = this.membersList.value;
    const memberId = this.getCurrentMemberId();
    const newMemberInfo = {id: memberId, ...memberFormData};
    const emp = EmployeeMapper.convertUIModelToEmployee(newMemberInfo);
    this.membersList.next([...currentMembers, emp]);
    return of({message : "Member added successfully"});
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
