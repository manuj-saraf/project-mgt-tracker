
import { Skills } from "../@config/skills";
import { UserRoles } from "../@config/user-roles";

export interface Employee {
    id: number;
    name: string;
    role: UserRoles;
    experience: number;
    skills: Skills[];
    profileDescription: string;
    currentProjectStartDate: string;
    currentlProjectEndDate: string;
    allocationPercentage: string;
}