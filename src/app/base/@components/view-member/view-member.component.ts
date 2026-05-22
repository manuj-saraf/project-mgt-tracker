import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeUI } from '../../../shared/@models/employee-ui.model';
import { MemberService } from '../../../shared/services/member.service';
import { Subject, takeUntil } from 'rxjs';
import { Skills } from 'src/app/shared/@config/skills';

@Component({
  selector: 'app-view-member',
  standalone: false,
  templateUrl: './view-member.component.html',
  styleUrls: ['./view-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewMemberComponent  implements OnInit, OnDestroy {
  members: EmployeeUI[] = [];
  private readonly destroy$ = new Subject<void>();
  
  constructor(private memberService : MemberService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getAllMembers().pipe(takeUntil(this.destroy$)).subscribe((members)=>{
      this.members = members.sort((a, b) => b.experience - a.experience);
    })
  }

  trackByMemberId(index: number, member: EmployeeUI): number {
    return member.id;
  }

  trackByMemberSkills(index: number, skill: Skills): Skills {
    return skill;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
