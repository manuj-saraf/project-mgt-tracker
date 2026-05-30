import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TaskStatus } from 'src/app/shared/@config/task-approval-status';
import { EmployeeIdentification, EmployeeUI } from 'src/app/shared/@models/employee-ui.model';
import { TaskApproval } from 'src/app/shared/@models/task-approval.model';
import { TaskDetails } from 'src/app/shared/@models/task-details.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-approve-task',
  standalone: false,
  templateUrl: './approve-task.component.html',
  styleUrls: ['./approve-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproveTaskComponent implements OnInit, OnDestroy{
  currentUser: EmployeeUI | null = null;
  selectedMember: EmployeeIdentification | null = null;
  memberList: EmployeeIdentification[] = [];
  memberFormGroup! : FormGroup;
  pendingTasks : TaskDetails[] = [];
  approvedOrRejectedTasks : TaskDetails[] = [];
  
  errorMsg$ = new BehaviorSubject<string>('');
  destroy$ = new Subject<void>();
  selectedTaskIds : Set<number> = new Set();
  taskStatus = TaskStatus;
  
  constructor(private fb: FormBuilder, private readonly memberService: MemberService, 
    private readonly taskService: TasksService, private readonly alertService: AlertService){
      this.memberService.getCurrentUserDetails().pipe(takeUntil(this.destroy$)).subscribe(user=> this.currentUser = user);

    }

  ngOnInit(): void {
    this.fetchAllMemberIdsAndNames();
  }

  fetchAllMemberIdsAndNames(): void {
    this.memberService.getAllMemberIdsAndNames().pipe(takeUntil(this.destroy$)).subscribe((empList: EmployeeIdentification[])=>{
      this.onFetchAllMembersSuccess(empList);
    });
  }

  onFetchAllMembersSuccess(empList: EmployeeIdentification[]): void {
    if(empList.length === 0){
      this.errorMsg$.next("No Team members available. Please add team emmbers first and assign task");
    }
    else{
      this.errorMsg$.next('');
      this.memberList = empList;
      this.createForm();
    }
    
  }

  createForm(): void {
    this.memberFormGroup = this.fb.group({
      member:[null, [Validators.required]]
    });

    this.memberFormGroup.get('member')?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
    .subscribe((memberId : string)=>{
      const id = JSON.parse(memberId) as EmployeeUI['id'];
      this.onMemberChange(id);
    });
  }

  onMemberChange(memberId: EmployeeUI['id']) : void {
    const id = Number(memberId);
    
    this.selectedMember = this.memberList.find(m => m.id === id) ?? null;
    this.pendingTasks = [];
    this.approvedOrRejectedTasks = [];
    this.selectedTaskIds.clear();
    this.errorMsg$.next('');
    if(this.selectedMember){
      this.fetchTasksByEmployeeId(this.selectedMember.id);
    }
  }

  fetchTasksByEmployeeId(id: number): void {
    this.taskService.getPendingTasksbyEmployeeId(id).pipe(takeUntil(this.destroy$))
    .subscribe((tasks: TaskDetails[]) => {
      this.onFetchPendingTasksSuccess(tasks);
    })
  }

  onFetchPendingTasksSuccess(tasks: TaskDetails[]) : void {
    const totalTasks = tasks;
    const pendingTasks = [] as TaskDetails[];
    const approvedOrRejectedTasks = [] as TaskDetails[];
    totalTasks.forEach(task=>{
      const isTaskApprovedByCurrentUser = task.approvalHistory?.some(appHistory=> appHistory.approverName === this.currentUser?.name);
      if(task.status === TaskStatus.Rejected || isTaskApprovedByCurrentUser){
        approvedOrRejectedTasks.push(task);
      }else {
        pendingTasks.push(task);
      }
    });
    this.pendingTasks = [...pendingTasks];
    this.approvedOrRejectedTasks = [...approvedOrRejectedTasks];
    if(this.pendingTasks.length ===0) {
      this.errorMsg$.next('No pending tasks to approve.');
    }
  }

  isActionDisabled(): boolean {
    return (!this.selectedMember || !this.currentUser || this.selectedTaskIds.size === 0);
  }

  toggleTaskSelection(ev: Event, taskId: number): void {
    const isChecked = (ev.target as HTMLInputElement)?.checked;
    if(isChecked){
      this.selectedTaskIds.add(taskId);
    }
    else {
      this.selectedTaskIds.delete(taskId);
    }
  }

  trackByMemberId(index: number, member: EmployeeIdentification): number {
    return member.id;
  }

  updateTaskApproval(approvalStatus: TaskStatus): void {
    if(!this.selectedMember || !this.currentUser || this.selectedTaskIds.size === 0){
      return;
    }
    const approvalData: TaskApproval = {
      approverName: this.currentUser.name,
      approverRole: this.currentUser.role,
      approvalDate: new Date().toISOString(),
      approvalStatus
    };
    this.taskService.updateTaskApproval(this.selectedMember.id, Array.from(this.selectedTaskIds), approvalData).pipe(takeUntil(this.destroy$))
    .subscribe((val)=>{
      this.onTaskApprovalStatusUpdated(val, approvalStatus);
    });
  }

  onTaskApprovalStatusUpdated(val: {message: string} | null, approvalStatus: TaskStatus): void {
    if(val){
      const updateMsg = approvalStatus === TaskStatus.Approved ? 'Task Approval successful!' : 'Task Rejection successful!';
      this.alertService.showAlert(updateMsg, 'success');
      this.onMemberChange(this.selectedMember!.id)
    }else {
      this.alertService.showAlert('Task Approval failed', 'error');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.alertService.hideAlert();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
