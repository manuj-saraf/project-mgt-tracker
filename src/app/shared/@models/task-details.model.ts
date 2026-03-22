import { TaskApprovalStatus } from "../@config/task-approval-status";
import { Employee } from "./employee.model";
import { TaskApproval } from "./task-approval.model";

export interface TaskDetails{
    id: number;
    title: string;
    deliverables: string;
    status: TaskApprovalStatus;
    assignedTo: Employee['id'] | null;
    taskStartDate: string;
    taskEndDate: string;
    approvalHistory:TaskApproval[] | null;
}