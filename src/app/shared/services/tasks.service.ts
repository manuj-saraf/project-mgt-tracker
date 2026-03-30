import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { Employee } from '../@models/employee.model';
import { EmployeeUI } from '../@models/employee-ui.model';
import { EmployeeMapper } from '../@mappers/member-mapper';
import { TaskDetails } from '../@models/task-details.model';
import { TaskApproval } from '../@models/task-approval.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private taskListSubject = new BehaviorSubject<TaskDetails[]>([]);
  public taskList$ = this.taskListSubject.asObservable();

  constructor() {
  }

  getAllTasks(): TaskDetails[] {
    return this.taskListSubject.value;
  }

  addTask(task: TaskDetails): void {
    const currentTasks = this.taskListSubject.value;
    this.taskListSubject.next([...currentTasks, task]);
  }
  
  getTasksbyEmployeeId(employeeId: number): TaskDetails[] {
    return this.taskListSubject.value.filter(task => task.assignedTo === employeeId);
  }
    
  
  updateTaskApproval(taskId: number, approval:TaskApproval): void {
    const taskToUpdate = this.taskListSubject.value;
    const taskIndex = taskToUpdate.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const taskApprovalHistory = taskToUpdate[taskIndex].approvalHistory || [];
      taskToUpdate[taskIndex].approvalHistory = [...taskApprovalHistory, approval];
      this.taskListSubject.next([...taskToUpdate]);
    }
  }

}
