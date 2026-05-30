import { Employee } from "./employee.model";
import { TaskApprovalPendingDetails } from "./task-approval.model";
import { TaskApprovalDetails } from "./task-details.model";

export interface EmployeeUI extends Omit<Employee, 'allocationPercentage'> {
    allocationPercentage: number;
}

export interface EmployeeDetailsFormData extends Omit<EmployeeUI, 'id'>{}

export interface EmployeeAllocationUI extends Pick<EmployeeUI, 'id' | 'name' | 'currentProjectEndDate' | 'allocationPercentage' >{}

export interface EmployeeIdentification extends Pick<EmployeeUI, 'id' | 'name'>{}

export interface EmployeeSelfAndTaskDetails {
    id: number;
    name: string;
    currentProjectStartDate: string;
    currentProjectEndDate: string;
    allocationPercentage: number;
    taskDetails : TaskApprovalDetails[];

}
