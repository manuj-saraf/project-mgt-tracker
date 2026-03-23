import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MemberService } from '../shared/services/member.service';
import { UserRoles } from '../shared/@config/user-roles';
import { EmployeeUI } from '../shared/@models/employee-ui.model';
import { allNavigationLinks } from './base.helper';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  standalone: false
})
export class BaseComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberService = inject(MemberService);
  alertService = inject(AlertService);
  private subscription = new Subscription();
  currentUser: EmployeeUI | null = null;

  navigationData = allNavigationLinks;

  ngOnInit(): void {
    this.subscription.add(
      this.memberService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get navigationLinks() {
    if (!this.currentUser) {
      return [];
    }

    if (this.currentUser.role === UserRoles.Member) {
      return this.navigationData.filter(link => link.label === 'View Task');
    }else {
      return this.navigationData.filter(link => link.label !== 'View Task');
    }

    
  }

  get hasChildRoute(): boolean {
    return this.route.children.length > 0;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
