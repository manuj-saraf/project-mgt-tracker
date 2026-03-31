import { Component, inject } from '@angular/core';
import { Employee } from '../../../shared/@models/employee.model';
import { EmployeeUI } from '../../../shared/@models/employee-ui.model';
import { MemberService } from '../../../shared/services/member.service';

@Component({
  selector: 'app-view-member',
  standalone: false,
  templateUrl: './view-member.component.html',
  styleUrl: './view-member.component.scss'
})
export class ViewMemberComponent {
  members: EmployeeUI[] = [];
  pagedMembers: EmployeeUI[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  memberService = inject(MemberService);
  constructor() {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.members = this.memberService.getMembers().sort((a, b) => b.experience - a.experience);
    this.totalPages = Math.ceil(this.members.length / this.pageSize);
    this.setPagedMembers();
  }

  setPagedMembers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedMembers = this.members.slice(startIndex, endIndex);
  }

  trackByMemberId(index: number, member: EmployeeUI): number {
    return member.id;
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPagedMembers();
    }
  }
}
