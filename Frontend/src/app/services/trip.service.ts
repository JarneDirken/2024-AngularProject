import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '../model/Trip';
import { Activity } from '../model/Activity';
import { ActivityType } from '../model/ActivityType';
import { environment } from 'src/environments/environment';

import { Cost } from '../model/Cost';
import { UserTripCount } from '../model/UserTripCount';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private apiUrl: string = environment.api_url;

    constructor(private httpClient: HttpClient) { }

    private getFullUrl(endpoint: string): string {
        return `${this.apiUrl}/${endpoint}`;
    }

    getTrips(): Observable<Trip[]> {
        return this.httpClient.get<Trip[]>(this.getFullUrl('Trip'));
    }

    getSharedTrips(): Observable<Trip[]> {
        return this.httpClient.get<Trip[]>(this.getFullUrl('Trip/shared'));
    }

    getPublicTrips(): Observable<Trip[]> {
        return this.httpClient.get<Trip[]>(this.getFullUrl('public'));
    }

    searchPublicTrips(searchTerm: string, type: string | undefined): Observable<Trip[]> {
        let url = this.getFullUrl('public/search');
        if (searchTerm != '') url += `?name=${searchTerm}`;
        if (type != 'undefined' && type != undefined) url += `?&type=${type}`;
        return this.httpClient.get<Trip[]>(url);
    }

    getTripById(id: number): Observable<Trip> {
        return this.httpClient.get<Trip>(this.getFullUrl(`Trip/${id}`));
    }

    getActivityById(id: number): Observable<Activity> {
        return this.httpClient.get<Activity>(this.getFullUrl(`Trip/activity/${id}`));
    }

    postTrip(trip: Trip): Observable<Trip> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.post<Trip>(this.getFullUrl('Trip'), trip, { headers });
    }

    putCost(id: number, cost: Cost): Observable<Cost> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.put<Cost>(this.getFullUrl(`Trip/cost/${id}`), cost, { headers });
    }
    
    postActivity(tripId: number, activity: Activity): Observable<Activity> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.post<Activity>(this.getFullUrl(`Trip/${tripId}/activity`), activity, { headers });
    }

    putTrip(id: number, trip: Trip): Observable<Trip> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.put<Trip>(this.getFullUrl(`Trip/${id}`), trip, { headers });
    }

    publishTrip(id: number): Observable<Trip> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.put<Trip>(this.getFullUrl(`Trip/publish/${id}`), { headers });
    }

    unpublishTrip(id: number): Observable<Trip> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.put<Trip>(this.getFullUrl(`Trip/unpublish/${id}`), { headers });
    }

    putActivity(id: number, activity: Activity): Observable<Activity> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.httpClient.put<Activity>(this.getFullUrl(`Trip/activity/${id}`), activity, { headers });
    }

    deleteTrip(id: number): Observable<unknown> {
        return this.httpClient.delete<unknown>(this.getFullUrl(`Trip/${id}`));
    }

    deleteCost(id: number): Observable<unknown> {
        return this.httpClient.delete<unknown>(this.getFullUrl(`Trip/cost/${id}`));
    }

    deleteActivity(id: number): Observable<unknown> {
        return this.httpClient.delete<unknown>(this.getFullUrl(`Trip/activity/${id}`));
    }

    leaveTrip(id: number): Observable<unknown> {
        return this.httpClient.patch<unknown>(this.getFullUrl(`Trip/leave/${id}`), {});
    }

    getActivityTypes(): Observable<ActivityType[]> {
        return this.httpClient.get<ActivityType[]>(this.getFullUrl('Trip/ActivityTypes'));
    }

    getUserTripCount(): Observable<UserTripCount> {
        return this.httpClient.get<UserTripCount>(this.getFullUrl('Trip/userTripCount'))
    }    
}