import { EmployeeUI } from "../@models/employee-ui.model";
import { Employee } from "../@models/employee.model";

const convertEmployeeToUIModel = (members: Employee[]): EmployeeUI[] => {
    return members.map(member => {
        return {
            ...member,
            allocationPercentage: ((+member.allocationPercentage *10000)/100) as number
        }
    });
}

const convertUIModelToEmployee = (member: EmployeeUI): Employee => {
    return {
        ...member,
        allocationPercentage: (member.allocationPercentage * 100/10000).toString()
    };
}

export const EmployeeMapper = {
    convertEmployeeToUIModel,
    convertUIModelToEmployee
};0