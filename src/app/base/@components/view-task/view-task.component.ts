import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeSelfAndTaskDetails, EmployeeUI } from 'src/app/shared/@models/employee-ui.model';
import { TaskApprovalDetails } from 'src/app/shared/@models/task-details.model';
import { MemberService } from 'src/app/shared/services/member.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-view-task',
  standalone: false,
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTaskComponent implements OnInit, OnDestroy{
  currentUser: EmployeeUI | null = null;
  currentUserData = {} as EmployeeSelfAndTaskDetails;
  taskDetails = [] as TaskApprovalDetails[];
  destroy$ = new Subject<void>();
  
  constructor( private readonly memberService: MemberService, private readonly taskService: TasksService){ }

  ngOnInit(): void {
    this.memberService.getCurrentUserDetails().pipe(takeUntil(this.destroy$))
    .subscribe(user=> this.onFetchCurrentUserSuccess(user));
  }

  onFetchCurrentUserSuccess(user: EmployeeUI | null): void {
    this.currentUser = user;
    this.getPendingTasksForSelf(user!.id);
  }

  getPendingTasksForSelf(id: number){
    this.taskService.getPendingTasksForLoggedInEmployee(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(obj => {
      this.currentUserData = obj;
      this.taskDetails = obj.taskDetails;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}