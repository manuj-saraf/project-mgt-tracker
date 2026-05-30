import { defaultEmployees } from "../@config/employees";
import { EmployeeAllocationUI, EmployeeIdentification, EmployeeSelfAndTaskDetails, EmployeeUI } from "../@models/employee-ui.model";
import { Employee } from "../@models/employee.model";
import { TaskApprovalPendingDetails } from "../@models/task-approval.model";
import { TaskApprovalDetails, TaskDetails } from "../@models/task-details.model";

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

const getPendingEmpTasksAndOtherDetails = (emp: EmployeeUI, taskList : TaskDetails[]): EmployeeSelfAndTaskDetails => {
    const { id, name, currentProjectStartDate, currentProjectEndDate, allocationPercentage} = emp;
    
    const taskDetails: TaskApprovalDetails[] = [...taskList].map(task=> {
        const res = defaultEmployees.map(mgr=> {
            const {role, name} = mgr;
            let approvalStatus = 'Pending';
            let approvalDate = '';
            const approvedInfo  = task.approvalHistory.find(a => a.approverName === mgr.name);
            if(approvedInfo){
                approvalDate = approvedInfo.approvalDate;
                approvalStatus = approvedInfo.approvalStatus as string;
            }
            return {role, name, approvalStatus, approvalDate } as TaskApprovalPendingDetails;
        });
        const {approvalHistory, ...remaingTaskInfo} = task;
        return {...remaingTaskInfo, pendingApprovals : res};
    });
    return {id, name, currentProjectStartDate, currentProjectEndDate, allocationPercentage, taskDetails}
}

export const EmployeeMapper = {
    convertEmployeeToUIModel,
    getEmployeeUIToUpdateAllocation,
    updateEmployeeAllocationInfoToEmployee,
    convertUIModelToEmployee,
    getAllEmployeesIdsAndNames,
    getPendingEmpTasksAndOtherDetails
};