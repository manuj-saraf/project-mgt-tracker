import { TaskStatus } from "../@config/task-approval-status";
import { UserRoles } from "../@config/user-roles";

export interface TaskApproval{
    approverName: string;
    approverRole: UserRoles;
    approvalDate: string;
    approvalStatus: TaskStatus;
}


export interface TaskApprovalPendingDetails {
    role: UserRoles, 
    name : string, 
    approvalStatus: string, 
    approvalDate: string
}