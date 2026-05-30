import { TaskStatus } from "../@config/task-approval-status";
import { Employee } from "./employee.model";
import { TaskApproval, TaskApprovalPendingDetails } from "./task-approval.model";

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

export interface TaskApprovalDetails extends Omit<TaskDetails, 'approvalHistory'> {
    pendingApprovals : TaskApprovalPendingDetails[];
}