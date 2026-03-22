import { EmployeeUI } from "../@models/employee-ui.model";
import { Employee } from "../@models/employee.model";

const convertEmployeeToUIModel = (members: Employee[]): EmployeeUI[] => {
    return members.map(member => {
        return {
            ...member,
            allocationPercentage: ((+member.allocationPercentage *1000)/100) as number
        }
    });
}

const convertUIModelToEmployee = (member: EmployeeUI): Employee => {
    return {
        ...member,
        allocationPercentage: (member.allocationPercentage / 1000 * 100).toString()
    };
}

export const EmployeeMapper = {
    convertEmployeeToUIModel,
    convertUIModelToEmployee
};