import { EmployeeAllocationUI, EmployeeIdentification, EmployeeUI } from "../@models/employee-ui.model";
import { Employee } from "../@models/employee.model";

const convertEmployeeToUIModel = (members: Employee[]): EmployeeUI[] => {
    return members.map(member => {
        return {
            ...member,
            allocationPercentage: ((+member.allocationPercentage *10000)/100) as number
        }
    });
}

const getAllEmployeesIdsAndNames = (members: Employee[]): EmployeeIdentification[] => {
    return members.map(member=> {
        return {
            id: member.id,
            name: member.name
        }
    })
}

const getEmployeeUIToUpdateAllocation = (employee : Employee): EmployeeAllocationUI=> {
    return {
        id: employee.id,
        name: employee.name,
        currentProjectEndDate: employee.currentProjectEndDate,
        allocationPercentage: ((+employee.allocationPercentage *10000)/100) as number
    }
}

const updateEmployeeAllocationInfoToEmployee = (updatedEmployeeInfo: EmployeeAllocationUI, empData: Employee) =>{
    return {
        ...empData,
        allocationPercentage: (updatedEmployeeInfo.allocationPercentage * 100 / 10000).toString()
    }
}

const convertUIModelToEmployee = (member: EmployeeUI): Employee => {
    return {
        ...member,
        allocationPercentage: (member.allocationPercentage * 100/10000).toString()
    };
}

export const EmployeeMapper = {
    convertEmployeeToUIModel,
    getEmployeeUIToUpdateAllocation,
    updateEmployeeAllocationInfoToEmployee,
    convertUIModelToEmployee,
    getAllEmployeesIdsAndNames
};0