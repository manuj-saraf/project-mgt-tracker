import { TaskApprovalStatus } from "../@config/task-approval-status";
import { UserRoles } from "../@config/user-roles";

export interface TaskApproval{
    approverName: string;
    approverRole: UserRoles;
    approvalDate: string;
    approvalStatus: TaskApprovalStatus;
}
