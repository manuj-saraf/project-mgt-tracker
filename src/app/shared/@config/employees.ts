import { Employee } from "../@models/employee.model";
import { Skills } from "./skills";
import { UserRoles } from "./user-roles";


export const defaultEmployees: Employee[] = [
    {
        id: 100001,
        name: "John Doe",
        role: UserRoles.Architect,
        experience: 11.5,
        skills: [Skills.Angular, Skills.Typescript, Skills.NodeJS, Skills.AWS, Skills.Docker, Skills.REST, Skills.Java],
        profileDescription: "Experienced Architect focused on scalable architecture, performance optimization, and mentoring cross-functional teams.",
        currentProjectStartDate: "2023-01-01",
        currentlProjectEndDate: "2026-12-31",
        allocationPercentage:"1.00"
    },
    {
        id: 100002,
        name: "Jane Smith",
        role: UserRoles.Manager,
        experience: 9.0,
        skills: [Skills.Angular, Skills.Typescript, Skills.NodeJS, Skills.Java, Skills.REST],
        profileDescription: "Strategic Manager who leads agile teams, aligns roadmap execution with business goals, and drives timely delivery.",
        currentProjectStartDate: "2023-03-01",
        currentlProjectEndDate: "2026-09-30",
        allocationPercentage:"1.00"
    }
];
   