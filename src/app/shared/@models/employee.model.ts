
import { Skills } from "../@config/skills";

export interface Employee {
    id: number;
    name: string;
    role: string;
    experience: number;
    skills: Skills[];
    profileDescription: string;
    currentProjectStartDate: string;
    currentlProjectEndDate: string;
    allocationPercentage: string;
}