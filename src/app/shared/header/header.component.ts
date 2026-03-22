import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  members: string[] = [];
  selectedMember: string = '';
  isMenuOpen: boolean = false;
  appName: string = 'Project Management Tracker';

  navigationLinks = [
    { label: 'Add Member', route: '/add-member' },
    { label: 'View Members', route: '/view-members' },
    { label: 'Assign Task', route: '/assign-task' },
    { label: 'View Task', route: '/view-task' },
    { label: 'Allocation', route: '/allocation' }
  ];

  constructor(private router: Router, private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadMembers();
    this.memberService.members$.subscribe(() => {
      this.loadMembers();
    });
  }

  loadMembers(): void {
    this.members = this.memberService.getMembers();
  }

  onMemberSelected(member: string): void {
    this.selectedMember = member;
    this.router.navigate(['/view-members']);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
