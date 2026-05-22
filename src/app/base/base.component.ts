import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MemberService } from '../shared/services/member.service';
import { UserRoles } from '../shared/@config/user-roles';
import { EmployeeUI } from '../shared/@models/employee-ui.model';
import { allNavigationLinks, NavigationData } from './base.helper';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  standalone: false,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit, OnDestroy {

  currentUser: EmployeeUI | null = null;

  navigationData = allNavigationLinks;
  private readonly destroy$ = new Subject<void>();
  
  constructor(private route : ActivatedRoute, private readonly router: Router, private readonly memberService :MemberService, readonly alertService: AlertService){}

  ngOnInit(): void {
    this.memberService.getCurrentUserDetails().pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
    });
  }

  get navigationLinks(): NavigationData[] {
    if (!this.currentUser) {
      return [];
    }

    if (this.currentUser.role === UserRoles.Member) {
      return this.navigationData.filter(link => link.id === 'viewTask');
    }else {
      return this.navigationData.filter(link => link.id !== 'viewTask');
    }
  }

  trackByFn(index: number, navInfo: NavigationData): string {
    return navInfo.label
  }

  get hasChildRoute(): boolean {
    return this.route.children.length > 0;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
