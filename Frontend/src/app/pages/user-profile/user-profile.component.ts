import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0User } from "../../model/Auth0User";
import { Trip } from '../../model/Trip';
import { TripService } from '../../services/trip.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { UserTripCount } from '../../model/UserTripCount';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTooltipModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  providers: [
    DatePipe,
  ],
})
export class UserProfileComponent implements OnInit{
  public loggedInUser: Auth0User | null = null;
  selectedButton: 'upcoming' | 'past' = 'upcoming'; // Default selected button
  upcoming : boolean = true;
  trips: Trip[] = [];
  trips$: Subscription = new Subscription();
  userTripCounts: UserTripCount | undefined;
  userTripCounts$: Subscription = new Subscription();
  loading: boolean = true;
  loadingTripCount: boolean = true;
  level: string = '';

  constructor(public auth: AuthService, private datePipe: DatePipe, private tripService: TripService) {
    // this is for testing, you get the whole Auth0User object
    // this.auth.isAuthenticated$.subscribe((auth) => {
    //   if (auth) {
    //     this.auth.user$.subscribe((data) => {
    //       this.loggedInUser = data as Auth0User;
    //     });
    //   } else {
    //     this.loggedInUser = null;
    //   }
    // });
    this.auth.isAuthenticated$.subscribe((auth) => {
      if (auth) {
        this.auth.user$.subscribe((data) => {
          this.auth.idTokenClaims$.subscribe((idToken) => {
            const created_at = idToken ? idToken['https://your-namespace/created_at'] || '' : '';
            const { name, email, picture, sub } = data as Auth0User;
            this.loggedInUser = { name, email, picture, sub, created_at };
          });
        });
      } else {
        this.loggedInUser = null;
      }
    });
  }

  ngOnInit(): void {
    this.getTrips();
    this.getUserTripCount();
  }

  ngOnDestroy(): void {
    this.trips$.unsubscribe();
    this.userTripCounts$.unsubscribe();
  }

  getTrips() {
    this.loading = true;
    this.trips$ = this.tripService.getTrips().subscribe(
      result => {
        this.trips = result;
        this.loading = false;
      },
      error => {
        console.error('Error fetching trips:', error);
        this.loading = false;
      }
    );
  }
  

  getUserTripCount() {
    this.loadingTripCount = true;
    this.userTripCounts$ = this.tripService.getUserTripCount().subscribe(
        result => {
            this.userTripCounts = result;
            this.level = this.calculateLevel(this.userTripCounts.tripCount);
            this.loadingTripCount = false;
        },
        error => {
            console.error('Error fetching user trip count:', error);
            this.loadingTripCount = false;
        }
    );
  }

  calculateLevel(tripCount: number): string {
    if (tripCount < 2) {
        return 'Beginner';
    } else if (tripCount >= 2 && tripCount <= 3) {
        return 'Intermediate';
    } else {
        return 'Advanced';
    }
}

  get upcomingTrips(): Trip[] {
    return this.trips.filter(trip => new Date(trip.end) > new Date());
  }

  get pastTrips(): Trip[] {
    return this.trips.filter(trip => new Date(trip.end) <= new Date());
  }

  toggleButton(button: 'upcoming' | 'past'): void {
    this.selectedButton = button;
    if (this.selectedButton === 'upcoming'){
      this.upcoming = true;
    } else {
      this.upcoming = false;
    }
  }

  formatDate(date: string | undefined): string | null {
    if (date != undefined) {
      var dateObject: Date = new Date(date);
      if (isNaN(dateObject.getTime())) {
        console.error('Invalid date format:', date);
        return null;
      }
      return this.datePipe.transform(dateObject, 'MMMM d, y');
    }
    return null;
  }

  formatDateDate(date:Date) {
    return this.datePipe.transform(date, 'dd/MM/yy');
  }
}
