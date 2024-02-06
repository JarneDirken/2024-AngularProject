import { Activity } from "./Activity";
import { Cost } from "./Cost";
import { TripType } from "./TripType";
import { User } from './User';

export interface Trip {
    id: number;
    name: string;
    type?: TripType;
    location: string;
    image: string | undefined;
    userId: string;
    users?: User[];
    start: Date;
    end: Date;
    cost?: Cost;
    activities: Activity[];
    isPublic: boolean;
    count: number;
}