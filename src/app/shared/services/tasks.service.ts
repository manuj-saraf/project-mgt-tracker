import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { Employee } from '../@models/employee.model';
import { EmployeeUI } from '../@models/employee-ui.model';
import { EmployeeMapper } from '../@mappers/member-mapper';
import { TaskDetails, TaskDetailsFormData } from '../@models/task-details.model';
import { TaskApproval } from '../@models/task-approval.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private taskListSubject = new BehaviorSubject<TaskDetails[]>([]);
  public taskList$ = this.taskListSubject.asObservable();

  taskData : {[s: Employee["id"]]: TaskDetails[]} = {};
  taskIdCounter = 1001;

  constructor() {
  }

  getTaskIdCounter(): number {
    return this.taskIdCounter;
  }

  updateTaskIdCounter(): void {
    this.taskIdCounter++;
  }

  getAllTasks(): TaskDetails[] {
    return this.taskListSubject.value;
  }

  addTask(task: TaskDetailsFormData): Observable<{message: string}> {
    const assignedTo = task.assignedTo;
    if(!this.taskData[assignedTo]){
      this.taskData[assignedTo] = [];
    }
    // TODO : Add check for task end date is greater than project end date. If yes throw error  
    const newTask = {...task, id : this.getTaskIdCounter(), approvalHistory : []} as TaskDetails;

    this.taskData[assignedTo].push(newTask);
    this.updateTaskIdCounter();
    return of({message : "Task assiggned successfully "});
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
