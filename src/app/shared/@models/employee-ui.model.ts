
import { Skills } from "../@config/skills";
import { Employee } from "./employee.model";

export interface EmployeeUI extends Omit<Employee, 'allocationPercentage'> {
    allocationPercentage: number;
}