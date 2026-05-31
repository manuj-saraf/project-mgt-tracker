import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployeeMapper } from 'src/app/shared/@mappers/member-mapper';
import { memberApiData, mockMemberFormData } from 'src/app/shared/@mock/members.mock';
import { mockTaskDetailsFormData } from 'src/app/shared/@mock/tasks.mock';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

import { AssignTaskComponent } from './assign-task.component';

describe('AssignTaskComponent', () => {
  let component: AssignTaskComponent;
  let fixture: ComponentFixture<AssignTaskComponent>;
  const addMultipleMembers = ()=>{
    const firstMember = {...mockMemberFormData};
    const secondMember = {...mockMemberFormData, name: 'Member2', experience: firstMember.experience +1 };
    [firstMember, secondMember].forEach(memberFormData=>{
        component['memberService'].addMember(memberFormData).subscribe((res) => {});
    });
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignTaskComponent],
      imports: [ ReactiveFormsModule ],
      providers:[FormBuilder, MemberService, AlertService, TasksService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTaskComponent);
    component = fixture.componentInstance;
    component.memberList = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use member id  as trackBy value', () => {
    const member = EmployeeMapper.getAllEmployeesIdsAndNames([{...memberApiData}])[0];
    expect(component.trackByMemberId(0, member)).toEqual(member.id);
  });

  it('should assign task to a member', fakeAsync(() => {
    addMultipleMembers();
    component.taskFormGroup.patchValue({...mockTaskDetailsFormData});
    spyOn(component,'onAddTaskSuccess').and.callThrough();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.onAddTaskSuccess).toHaveBeenCalled();
  }));

  it('should throw error while assigning task if task end date > project end date', fakeAsync(() => {
    addMultipleMembers();
    const taskFormData = {
      ...mockTaskDetailsFormData,
      taskStartDate: '2027-05-01',
      taskEndDate: '2027-05-20'
    };
    component.taskFormGroup.patchValue({...taskFormData});
    spyOn(component,'onAddTaskFail').and.callThrough();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.onAddTaskFail).toHaveBeenCalled();
  }));

});
