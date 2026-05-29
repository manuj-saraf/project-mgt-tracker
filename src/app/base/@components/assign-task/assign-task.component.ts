import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TaskStatus } from 'src/app/shared/@config/task-approval-status';
import { EmployeeIdentification } from 'src/app/shared/@models/employee-ui.model';
import { TaskDetailsFormData } from 'src/app/shared/@models/task-details.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { dateAfterValidator, dateBeforeValidator } from 'src/app/shared/validators/date.validators';

@Component({
  selector: 'app-assign-task',
  standalone: false,
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignTaskComponent implements OnInit, OnDestroy {
  memberList: EmployeeIdentification[] = [];
  destroy$ = new Subject<void>();
  taskFormGroup! : FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly taskService : TasksService, 
    private readonly memberService : MemberService, private readonly alertService: AlertService){}

  ngOnInit(): void {
    this.fetchAllMemberIdsAndNames();
  }

  fetchAllMemberIdsAndNames(): void {
    this.memberService.getAllMemberIdsAndNames().pipe(takeUntil(this.destroy$)).subscribe((empList: EmployeeIdentification[])=>{
      this.onFetchAllMembersSuccess(empList);
    });
  }

  onFetchAllMembersSuccess(empList: EmployeeIdentification[]): void {
    console.log("empList", empList);
    this.memberList = empList;
    this.createForm();
  }

  createForm(){
    this.taskFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      deliverables: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      status: [TaskStatus.Assigned],
      assignedTo: [null, [Validators.required]],
      taskStartDate: ['', [Validators.required,  dateBeforeValidator('taskEndDate')]], 
      taskEndDate: ['', [Validators.required,  dateAfterValidator('taskStartDate')]] 
    });

    const dependentControls = [this.taskFormGroup.get('taskStartDate'), this.taskFormGroup.get('taskEndDate')];
    dependentControls.forEach(control=> {
      control?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(()=>{
        dependentControls.forEach(ctrl=> {
          ctrl?.updateValueAndValidity({emitEvent: false});
        })
      });
    });
  }


  trackByMemberId(index: number, member: EmployeeIdentification): number {
    return member.id;
  }


  onSubmit(){
    if(this.taskFormGroup.valid){
      const formData = this.taskFormGroup.value as TaskDetailsFormData;
      formData.assignedTo = Number(formData.assignedTo);
      this.taskService.addTask(formData).pipe(takeUntil(this.destroy$)).subscribe({
        next: ()=>{ this.onAddTaskSuccess();},
        error: ()=> { this.onAddTaskFail();}
      })
    }
  }

  onAddTaskSuccess(): void {
    this.alertService.showAlert('Task assigned successfully! ', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.onReset();
  }

  onAddTaskFail(): void {
    this.alertService.showAlert('Task assigned failed! Task End date should be smaller than Project End date  ', 'error');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onReset(){
    this.taskFormGroup.reset({
      status: TaskStatus.Assigned
    });
    this.taskFormGroup.markAsUntouched();

  }

  ngOnDestroy(){
    this.alertService.hideAlert();
    this.destroy$.next();
    this.destroy$.complete();
  }


}
