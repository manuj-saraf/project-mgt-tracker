import { Injectable } from '@angular/core';
import { filter, Observable, of, switchMap, throwError } from 'rxjs';
import { Employee } from '../@models/employee.model';
import { EmployeeUI } from '../@models/employee-ui.model';
import { TaskDetails, TaskDetailsFormData } from '../@models/task-details.model';
import { TaskApproval } from '../@models/task-approval.model';
import { MemberService } from './member.service';
import { TaskStatus } from '../@config/task-approval-status';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  taskData: { [s: Employee["id"]]: TaskDetails[] } = {};
  taskIdCounter = 1001;

  constructor(private readonly memberService: MemberService) {
  }

  getTaskIdCounter(): number {
    return this.taskIdCounter;
  }

  updateTaskIdCounter(): void {
    this.taskIdCounter++;
  }


  addTask(task: TaskDetailsFormData): Observable<{ message: string }> {
    const assignedTo = task.assignedTo;
    if (!this.taskData[assignedTo]) {
      this.taskData[assignedTo] = [];
    }
    return this.memberService.getMemberById(assignedTo).pipe(
      filter(m => !!m),
      switchMap((member: EmployeeUI) => {
        const projectEndDate = new Date(member?.currentProjectEndDate);
        const taskEndDate = new Date(task.taskEndDate);
        if (taskEndDate > projectEndDate) {
          return throwError(() => new Error('Task end date cannot be greater than project End Date '))
        }
        else {
          const newTask = { ...task, id: this.getTaskIdCounter(), approvalHistory: [] } as TaskDetails;
          this.taskData[assignedTo].push(newTask);
          this.updateTaskIdCounter();
          return of({ message: "Task assiggned successfully " });
        }
      })
    )
  }


  getPendingTasksbyEmployeeId(employeeId: number): Observable<TaskDetails[]> {
    const pendingEmpTaskList = (this.taskData[employeeId] || ([] as TaskDetails[])).filter(task => task.status === TaskStatus.Assigned);
    return of(pendingEmpTaskList);
  }


  updateTaskApproval(empId: Employee['id'], taskIds: number[], approval: TaskApproval): Observable<{ message: string } | null> {
    const empTaskList = this.taskData[empId];
    if (!empTaskList) {
      return of(null);
    }
    let isValueUpdated = false;
    for (const taskId of taskIds) {
      const taskToUpdate = empTaskList.find(task => task.id === taskId);
      if (!taskToUpdate) { continue; }
      taskToUpdate.approvalHistory ??= [];
      taskToUpdate.approvalHistory.push(approval);
      const countOfTasksApproved = taskToUpdate.approvalHistory.filter(t => t.approvalStatus === TaskStatus.Approved)?.length;
      const countOfTasksRejected = taskToUpdate.approvalHistory.length - countOfTasksApproved;
      if (countOfTasksRejected > 0) {
        taskToUpdate.status = TaskStatus.Rejected;
      }
      else if (countOfTasksApproved > 1) {
        // Approved by both : Architect / Manager 
        taskToUpdate.status = TaskStatus.Approved;
      }
      isValueUpdated = true;
    }
    return of(isValueUpdated ? { message: 'Task approval status updated successfully!' } : null);
  }

}
