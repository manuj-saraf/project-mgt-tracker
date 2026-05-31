import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { defaultEmployees } from 'src/app/shared/@config/employees';
import { TaskStatus } from 'src/app/shared/@config/task-approval-status';
import { EmployeeMapper } from 'src/app/shared/@mappers/member-mapper';
import { memberUIData, mockMemberFormData } from 'src/app/shared/@mock/members.mock';
import { mockTaskDetailsFormData } from 'src/app/shared/@mock/tasks.mock';
import { EmployeeIdentification } from 'src/app/shared/@models/employee-ui.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';

import { ApproveTaskComponent } from './approve-task.component';

describe('ApproveTaskComponent', () => {
  let component: ApproveTaskComponent;
  let fixture: ComponentFixture<ApproveTaskComponent>;

  const addMultipleMembers = ()=>{
    const firstMember = {...mockMemberFormData};
    const secondMember = {...mockMemberFormData, name: 'Member2', experience: firstMember.experience +1 };
    [firstMember, secondMember].forEach(memberFormData=>{
        component['memberService'].addMember(memberFormData).subscribe((res) => {});
    });
  }
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveTaskComponent],
      imports: [ ReactiveFormsModule ],
      providers:[FormBuilder, MemberService, AlertService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveTaskComponent);
    component = fixture.componentInstance;
    component.currentUser = null;
    component.selectedMember = null;
    component.memberList = [];
    component.pendingTasks = [];
    component.approvedOrRejectedTasks = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch All members ', () => {
    addMultipleMembers(); 
    fixture.detectChanges();
    spyOn(component, 'createForm').and.callThrough();
    component.fetchAllMemberIdsAndNames();
    fixture.detectChanges();
    expect(component.createForm).toHaveBeenCalled();
  });
  
  it('should assign task to a member', fakeAsync(() => {
    addMultipleMembers();
    component['taskService'].addTask({...mockTaskDetailsFormData}).subscribe(res=> {
      component.fetchAllMemberIdsAndNames();
    });
    
    fixture.detectChanges();
    spyOn(component,'fetchTasksByEmployeeId').and.callThrough();
    component.memberFormGroup.patchValue({member: memberUIData.id});
    fixture.detectChanges();
    expect(component.fetchTasksByEmployeeId).toHaveBeenCalled();
  }));

  
  it('should show message that no Pending tasks left', fakeAsync(() => {
    addMultipleMembers();
    component.fetchTasksByEmployeeId(memberUIData.id);
    tick();
    expect(component.errorMsg$.value).toContain('No pending tasks to approve.');
  }));

  it('should toggle Task selection ', () => {
    component.selectedTaskIds.clear(); 
    const ev = {target : {checked: true}} as any;
    component.toggleTaskSelection(ev, 1001);
    expect(component.selectedTaskIds.has(1001)).toBeTruthy();
    ev.target.checked = false;
    component.toggleTaskSelection(ev, 1001);
    expect(component.selectedTaskIds.has(1001)).toBeFalsy();
  });

  it('should disable button ', () => {
    const curentUser = EmployeeMapper.convertEmployeeToUIModel([defaultEmployees[1]])[0];
    component['memberService'].setCurrentUser(curentUser)
    component.currentUser = curentUser;
    component.selectedTaskIds.clear();
    component.selectedMember = {id: memberUIData.id, name: memberUIData.name} as EmployeeIdentification;
    expect(component.isActionDisabled()).toBeTrue();
  });

  it('should call  updateTaskApproval andhandle success', fakeAsync(() => {
    addMultipleMembers();
    const curentUser = EmployeeMapper.convertEmployeeToUIModel([defaultEmployees[1]])[0];
    component['memberService'].setCurrentUser(curentUser)
    component.currentUser = curentUser;
    component.selectedMember = {id: memberUIData.id, name: memberUIData.name} as EmployeeIdentification;
    component.selectedTaskIds.clear(); 
    component.selectedTaskIds.add(1001);
    spyOn(component, 'onTaskApprovalStatusUpdated').and.callThrough();
    component.updateTaskApproval(TaskStatus.Approved);
    tick();
    expect(component.onTaskApprovalStatusUpdated).toHaveBeenCalled();
  }));

});
