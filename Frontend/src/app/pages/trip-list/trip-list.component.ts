import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Trip } from '../../model/Trip';
import { TripService } from '../../services/trip.service';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0User } from "../../model/Auth0User";
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { TripTypeDetails } from '../../model/TripType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  providers: [DatePipe],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css'],
  imports: [CommonModule, MatTooltipModule, RouterModule]
})
export class TripListComponent implements OnInit, OnDestroy {
  public loggedInUser: Auth0User | null = null;
  trips: Trip[] = [];
  trips$: Subscription = new Subscription();
  sharedTrips$: Subscription = new Subscription();
  sharedTrips: Trip[] = [];
  deleteTrip$: Subscription = new Subscription();
  publishTrip$: Subscription = new Subscription();
  userId: string = '';
  loading: boolean = true;
  loadingShared: boolean = true;
  errorMessage: string = '';
  tripDetails:  Record<number, { name: string, icon: string }> = TripTypeDetails;
  tripsToShow: Trip[] = [];
  tripsToLoad = 3;
  initialTripsToDisplay = 5;


  constructor(public auth: AuthService, private tripService: TripService, private router: Router,private datePipe: DatePipe, private confirmationModalService: ConfirmationModalService,  private snackBar: MatSnackBar) {
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
    this.getSharedTrips();
  }

  ngOnDestroy(): void {
    this.trips$.unsubscribe();
    this.sharedTrips$.unsubscribe();
    this.deleteTrip$.unsubscribe();
  }

  loadMoreTrips() {
    this.initialTripsToDisplay += this.tripsToLoad;
    this.updateTripsToShow();
  }

  updateTripsToShow() {
    this.tripsToShow = this.trips.slice(0, this.initialTripsToDisplay);
  }

  add() {
    //Navigate to form in add mode
    this.router.navigate(['planner']);
  }

  edit(id: number) {
    //Navigate to form in edit mode
    this.router.navigate(['trips/add'], { state: { id: id, mode: 'edit' } });
  }

  delete(id: number, event: Event) {
    event.stopPropagation();
  
    this.tripService.getTripById(id).subscribe(
      (trip) => {
        this.confirmationModalService
          .openConfirmationModal('Confirm Deletion', `Are you sure you want to delete this trip?
                                  \n${trip.name}`)
          .subscribe((result) => {
            if (result) {
              this.deleteTrip$ = this.tripService.deleteTrip(id).subscribe({
                next: (v) => this.getTrips(),
                error: (e) => this.errorMessage = e.message
              });
            }
          });
      },
      (error) => {
        // Handle error fetching trip by id
        console.error('Error fetching trip by id:', error);
      }
    );
  }
  

  leave(id: number, event: Event) {
    event.stopPropagation();
  
    this.tripService.getTripById(id).subscribe(
      (trip) => {
        this.confirmationModalService
          .openConfirmationModal('Confirm Leaving', `Are you sure you want to leave this trip?\n${trip.name}`)
          .subscribe((result) => {
            if (result) {
              this.leaveTrip(id);
            }
          });
      },
      (error) => {
        console.error('Error fetching trip by id:', error);
      }
    );
  }
  
  leaveTrip(id: number) {
    this.sharedTrips$ = this.tripService.leaveTrip(id).subscribe({
      next: (v) => {this.getSharedTrips(), this.snackBar.open('Successfully left trip', undefined, {
        duration: 4000, // 4 seconds
        verticalPosition: 'top',
        horizontalPosition: 'end', 
        panelClass: ['success-snackbar'],
      });},
      error: (e) => this.errorMessage = e.message
    });
  }
  

  getTrips() {
    this.loading = true;
    this.trips$ = this.tripService.getTrips().subscribe(
      result => {
        this.trips = result;
        this.loading = false;
        this.updateTripsToShow();
      },
      error => {
        console.error('Error fetching trips:', error);
        this.loading = false;
      }
    );
  }

  getSharedTrips(){
    this.loadingShared = true;
    this.trips$ = this.tripService.getSharedTrips().subscribe(
      result => {
        this.sharedTrips = result;
        this.loadingShared = false;
      },
      error => {
        console.error('Error fetching shared trips:', error);
        this.loadingShared = false;
      }
    );
  }

  formatDate(date:Date) {
    return this.datePipe.transform(date, 'dd/MM/yy');
  }

  // createTrip(): void{
  //   this.router.navigate(['planner']);
  // }
}
