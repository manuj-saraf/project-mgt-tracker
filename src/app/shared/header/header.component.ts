import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MemberService } from '../services/member.service';
import { UserRoles } from '../@config/user-roles';
import { EmployeeUI } from '../@models/employee-ui.model';
import { allNavigationLinks } from '../../base/base.helper';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
    isMenuOpen: boolean = false;
    appName: string = 'Project Management Tracker';
    currentUser: EmployeeUI | null = null;
    private subscription: Subscription = new Subscription();

    private navigationData = allNavigationLinks;


    constructor(private router: Router, private memberService: MemberService) { }

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
        }

        // For Manager and Architect, show all links
        return this.navigationData;
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
