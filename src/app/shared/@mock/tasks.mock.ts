import { defaultEmployees } from "../@config/employees";
import { TaskStatus } from "../@config/task-approval-status";
import { TaskDetailsFormData } from "../@models/task-details.model";

export const mockTaskDetailsFormData  = {
    title : 'Test task',
    deliverables: 'Information of Deliverables',
    status : TaskStatus.Assigned,
    assignedTo: 100002,
    taskStartDate: '2026-05-01',
    taskEndDate: '2026-05-20'
} as TaskDetailsFormData;


export const taskApproverDetails = {
    approverName: defaultEmployees[1].name,
    approverRole: defaultEmployees[1].role,
    approvalDate: '2026-05-30',
    approvalStatus: TaskStatus.Approved
}