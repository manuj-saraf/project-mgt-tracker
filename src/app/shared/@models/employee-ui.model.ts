
import { Skills } from "../@config/skills";
import { Employee } from "./employee.model";

export interface EmployeeUI extends Omit<Employee, 'allocationPercentage'> {
    allocationPercentage: number;
}

export interface EmployeeDetailsFormData extends Omit<EmployeeUI, 'id'>{}

export interface EmployeeAllocationUI extends Pick<EmployeeUI, 'id' | 'name' | 'currentProjectEndDate' | 'allocationPercentage' >{}

export interface EmployeeIdentification extends Pick<EmployeeUI, 'id' | 'name'>{}