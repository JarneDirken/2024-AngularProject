import { ActivityType } from "./ActivityType";
import { Cost } from "./Cost";

export interface Activity {
    id: number;
    name: string;
    activityType: ActivityType;
    cost? : Cost;
    start: Date;
    end: Date;
    description?: string;
    location: string;
    // location: Location;
}