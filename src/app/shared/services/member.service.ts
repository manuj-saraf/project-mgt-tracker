import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private dummyMembers: string[] = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams',
    'Robert Brown',
    'Emily Davis',
    'David Wilson',
    'Lisa Anderson'
  ];

  private membersSubject = new BehaviorSubject<string[]>(this.dummyMembers);
  public members$ = this.membersSubject.asObservable();

  constructor() {}

  getMembers(): string[] {
    return this.membersSubject.value;
  }

  addMember(member: string): void {
    const currentMembers = this.membersSubject.value;
    if (!currentMembers.includes(member)) {
      this.membersSubject.next([...currentMembers, member]);
    }
  }

  removeMember(member: string): void {
    const currentMembers = this.membersSubject.value;
    this.membersSubject.next(currentMembers.filter(m => m !== member));
  }

  updateMembers(members: string[]): void {
    this.membersSubject.next(members);
  }
}
