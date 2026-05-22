import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MemberService } from '../services/member.service';
import { UserRoles } from '../@config/user-roles';
import { EmployeeUI } from '../@models/employee-ui.model';
import { allNavigationLinks, NavigationData } from '../../base/base.helper';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false,
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
    isMenuOpen: boolean = false;
    currentUser: EmployeeUI | null = null;

    private navigationData = allNavigationLinks;
    private readonly destroy$ = new Subject<void>();

    constructor(private router: Router, private memberService: MemberService) { }

    ngOnInit(): void {
        this.memberService.getCurrentUserDetails().pipe(takeUntil(this.destroy$)).subscribe(user => {
            this.currentUser = user;
        });
        
    }

    trackByFn(index: number, navInfo: NavigationData): NavigationData{
        return navInfo;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get navigationLinks(): NavigationData[] {
        if (!this.currentUser) {
            return [];
        }

        if (this.currentUser.role === UserRoles.Member) {
            return this.navigationData.filter(link => link.id === 'viewTask');
        }
        else {
        return this.navigationData.filter(link => link.id !== 'viewTask');
        }
        
    }

    navigate(route: string): void {
        this.router.navigate([route]);
        this.closeMenu();
    }

    logout(): void {
        this.memberService.setCurrentUser(null);
        this.router.navigate(['/']);
        this.closeMenu();
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu(): void {
        this.isMenuOpen = false;
    }
}
