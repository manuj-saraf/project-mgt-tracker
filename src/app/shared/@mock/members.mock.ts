import { UserRoles } from "../@config/user-roles";
import { EmployeeDetailsFormData, EmployeeUI } from "../@models/employee-ui.model";
import { Employee } from "../@models/employee.model";


export const mockMemberFormData = {
    name: 'Manuj',
    role: UserRoles.Member,
    skills: ['Javascript', 'Angular', 'CSS'],
    profileDescription: 'description of member',
    currentProjectStartDate: '2026-05-01',
    currentProjectEndDate: '2026-05-30',
    experience: 10,
    allocationPercentage: 50
} as EmployeeDetailsFormData;



export const memberApiData = {
    ...mockMemberFormData,
    id: 100002,
    allocationPercentage: '0.5'
} as Employee;



export const memberUIData = {
    ...memberApiData,
    allocationPercentage: 50
} as EmployeeUI;