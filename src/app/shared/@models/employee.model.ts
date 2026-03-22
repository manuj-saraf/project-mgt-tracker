import { Skills } from "../@config/skills";

export interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    joiningDate: string;
    skills: Skills[];
    profileDescription: string;
    currentProjectStartDate: string;
    currentlProjectEndDate: string;
}