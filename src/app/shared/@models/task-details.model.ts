import { TaskStatus } from "../@config/task-approval-status";
import { Employee } from "./employee.model";
import { TaskApproval } from "./task-approval.model";

export interface TaskDetails{
    id: number;
    title: string;
    deliverables: string;
    status: TaskStatus;
    assignedTo: Employee['id'];
    taskStartDate: string;
    taskEndDate: string;
    approvalHistory:TaskApproval[];
}

export interface TaskDetailsFormData extends Omit<TaskDetails, 'id' | 'approvalHistory'> {}