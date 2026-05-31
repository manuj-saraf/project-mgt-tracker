import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { memberUIData, mockMemberFormData } from '../@mock/members.mock';
import { mockTaskDetailsFormData, taskApproverDetails } from '../@mock/tasks.mock';
import { TaskDetailsFormData } from '../@models/task-details.model';
import { MemberService } from './member.service';

import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  const addMultipleMembers = ()=>{
    const firstMember = {...mockMemberFormData};
    const secondMember = {...mockMemberFormData, name: 'Member2', experience: firstMember.experience +1 };
    [firstMember, secondMember].forEach(memberFormData=>{
        service['memberService'].addMember(memberFormData).subscribe((res) => {});
    });
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [MemberService]
    });
    service = TestBed.inject(TasksService);
    service.taskIdCounter = 1001;
    service.taskData = {};

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the current task id counter ', () => {
    expect(service.getTaskIdCounter()).toBe(1001);
  });

  it('should increment the current task id counter ', () => {
    service.updateTaskIdCounter()
    expect(service.getTaskIdCounter()).toBe(1002);
  });

  it('should add Task for a member ', fakeAsync(() => {
    addMultipleMembers();
    service.addTask({...mockTaskDetailsFormData}).subscribe(res=> {
        expect(res.message).toContain('Task assiggned successfully ');
    });
  }));

  it('should throw error if task end date > project End Date ', fakeAsync(() => {
    addMultipleMembers();
    const taskData  = {
        ...mockTaskDetailsFormData,
        taskEndDate: '2026-09-20'
    } as TaskDetailsFormData;

    service.addTask({...taskData}).subscribe({
        next: ()=> fail('Should error'),
        error: (err)=> {
            expect(err).toBeTruthy();
        }
    })
  }));

  it('should return Pending Task for a member ', fakeAsync(() => {
    addMultipleMembers();
    service.getPendingTasksbyEmployeeId(memberUIData.id).subscribe(tasks =>{
        expect(tasks.length).toBe(0);
    });
    tick();
    service.addTask({...mockTaskDetailsFormData}).subscribe(res=> {});
    tick();
    service.getPendingTasksbyEmployeeId(memberUIData.id).subscribe(tasks =>{
        expect(tasks.length).toBe(1);
    });
  }));

  it('should fetch Pending Task for Logged-In member ', fakeAsync(() => {
    addMultipleMembers();
    service.getPendingTasksForLoggedInEmployee(memberUIData.id).subscribe(finalData =>{
        expect(finalData.taskDetails.length).toBe(0);
    });
    tick();
    service.addTask({...mockTaskDetailsFormData}).subscribe(res=> {});
    tick();
    service.getPendingTasksForLoggedInEmployee(memberUIData.id).subscribe(finalData =>{
        expect(finalData).toBeTruthy();
    });
  }));

  it('should approve Assign Task to a member ', fakeAsync(() => {
    addMultipleMembers();
    service.addTask({...mockTaskDetailsFormData}).subscribe(res=> {});
    tick();
    service.getPendingTasksForLoggedInEmployee(memberUIData.id).subscribe(finalData =>{
        const taskId = service.taskData[memberUIData.id][0].id;
        service.updateTaskApproval(memberUIData.id, [taskId], taskApproverDetails).subscribe(res=> {
            expect(res?.message).toContain('Task approval status updated successfully!');
        })
        
    });
  }));

});
