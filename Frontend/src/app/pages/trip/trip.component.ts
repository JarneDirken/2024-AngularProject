import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../../model/Trip';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CurrencySymbols } from '../../model/Currency';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { Location } from '@angular/common';
import { AuthService, User } from '@auth0/auth0-angular';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { TripType, TripTypeDetails } from '../../model/TripType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InviteFormComponent } from '../../components/invite-form/invite-form.component';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, MatTooltipModule,MatDialogModule],
  providers: [DatePipe],
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  trip: Trip = { id: 0, name: "", type: TripType.Beach, location: "", image: "", start: new Date(), end:new Date(), activities: [], userId: '', isPublic: false, count: 0 };
  trip$: Subscription = new Subscription();
  formattedStart: string | null = null;
  formattedEnd: string | null = null;
  tripId: number = 0;
  deleteTrip$: Subscription = new Subscription();
  deleteActivity$: Subscription = new Subscription();
  publishTrip$: Subscription = new Subscription();
  unpublishTrip$: Subscription = new Subscription();
  
  tripDetails:  Record<number, { name: string, icon: string }> = TripTypeDetails;

  loading: boolean = true;
  progress: number = 0;
  progressSpeed: number = 0;
  sumCosts: number = 0;
  currencySymbols: Record<any, string> = CurrencySymbols;
  errorMessage = "";
  public loggedInUser: User | undefined;
  userId = "";
  userEmails: String[] = [];

  constructor(private tripService: TripService, private route: ActivatedRoute,private router: Router,private datePipe: DatePipe, private location: Location, public auth: AuthService, private confirmationModalService: ConfirmationModalService,  private snackBar: MatSnackBar,public dialog: MatDialog) {
    // Retrieve user ID from Auth0
    if(this.auth.user$){
      this.auth.user$.subscribe((data) => {
        if (data){
          this.userId = data.sub || '';
          this.loggedInUser = data;
        }
      });
    }   
  }

  calculateSum(): number {
    let sum = 0;
    this.trip.activities.forEach(activity => {
      if (activity.cost?.amount) {
        sum += activity.cost.amount;
      }
    });
    this.progress = (sum / Number(this.trip.cost?.amount)) * 100
    this.progressSpeed = this.progress;
    if (this.progress > 100) this.progressSpeed = 101;
    return sum;
  }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId != null) {
      this.loading = true;
      this.tripId = +tripId;
      this.trip$ = this.tripService.getTripById(this.tripId).subscribe(
        {
          next: result => {
            this.trip = result;
            this.formattedStart = this.datePipe.transform(result.start, 'dd/MM/yy');
            this.formattedEnd = this.datePipe.transform(result.end, 'dd/MM/yy');
            this.sumCosts = this.calculateSum();
            this.trip.users?.forEach(user => {
              this.userEmails.push(user.email);
            });
            this.loading = false;
          },
          error: error => {
            if (error.status === 404) {
              // Redirect to home page when the trip is not found
              this.router.navigate(['error'], { state: { message: "What you were looking for doesn't exist 😢" } });
              this.loading = false;
            } else if (error.status === 401) {
              // Redirect to error page (still need to make) if the user isn't authorized
              this.router.navigate(['error'], { state: { message: "You are not allowed to see that trip! 😡" } });
              this.loading = false;
            } else {
              // Handle other errors as needed
              this.router.navigate(['error'], { state: { message: "Oops, something went wrong 😢" } });
              this.loading = false;
            }
          }
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.trip$.unsubscribe();
    this.deleteTrip$.unsubscribe();
    this.deleteActivity$.unsubscribe();
    this.publishTrip$.unsubscribe();
    this.unpublishTrip$.unsubscribe();
  }

  add() {
    //Navigate to activity form
    this.router.navigate(['activity/add'], { state: { tripId: this.tripId, mode: 'add', currency: this.trip.cost?.currency} });
  }

  edit(id: number) {
    this.router.navigate(["activity/add"], { state: { tripId: this.tripId, activityId: id, mode: 'edit',currency: this.trip.cost?.currency } })
  }

  editThisTrip() {
    //Navigate to form in edit mode
    this.router.navigate(['trips/add'], { state: { id: this.trip.id, mode: 'edit' } });
  }

  deleteThisTrip() {
    this.confirmationModalService
          .openConfirmationModal('Confirm Deletion', `Are you sure you want to delete: ${this.trip.name}`)
          .subscribe((result) => {
            if (result) {
              this.deleteTrip$ = this.tripService.deleteTrip(this.trip.id).subscribe({
                next: (v) => {this.router.navigate(['trips/all']), this.snackBar.open('Successfully deleted trip', undefined, {
                  duration: 4000, // 4 seconds
                  verticalPosition: 'top',
                  horizontalPosition: 'end', 
                  panelClass: ['success-snackbar'],
                });},
                error: (e) => this.errorMessage = e.message
              });
            }
          });
  }

  
  publish(id: number) {
    this.publishTrip$ = this.tripService.publishTrip(id).subscribe({
      next: (v) =>  {this.router.navigate(['trips/public']), this.snackBar.open('Successfully published trip', undefined, {
        duration: 4000, // 4 seconds
        verticalPosition: 'top',
        horizontalPosition: 'end', 
        panelClass: ['success-snackbar'],
      });},
      error: (e) => this.errorMessage = e.message
    });
  }

  unpublish(id: number) {
    this.unpublishTrip$ = this.tripService.unpublishTrip(id).subscribe({
      next: (v) =>  {this.router.navigate(['trips/all']), this.snackBar.open('Successfully unpublished trip', undefined, {
        duration: 4000, // 4 seconds
        verticalPosition: 'top',
        horizontalPosition: 'end', 
        panelClass: ['success-snackbar'],
      });},
      error: (e) => this.errorMessage = e.message
    });
  }

  invite() {
    const dialogRef = this.dialog.open(InviteFormComponent, {
      data: {trip : this.trip}
    });

    dialogRef.afterClosed().subscribe();
  }

  delete(id: number) {
    this.confirmationModalService
      .openConfirmationModal('Confirm Deletion', 'Are you sure you want to delete this activity?')
      .subscribe((result) => {
        if (result) {
          this.deleteActivity(id);
        }
      });
  }
  
  deleteActivity(id: number) {
    this.deleteActivity$ = this.tripService.deleteActivity(id).subscribe({
      next: (v) => {this.refreshTripDetails(), this.snackBar.open('Successfully deleted activity', undefined, {
        duration: 4000, // 4 seconds
        verticalPosition: 'top',
        horizontalPosition: 'end', 
        panelClass: ['success-snackbar'],
      });},
      error: (e) => {
        this.errorMessage = e.message
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      }
       });
  }
  
  refreshTripDetails() {
    this.loading = true;
    this.tripService.getTripById(+this.tripId).subscribe({
      next: result => {
        this.trip = result;
        this.formattedStart = this.datePipe.transform(this.trip.start, 'dd/MM/yy');
        this.formattedEnd = this.datePipe.transform(this.trip.end, 'dd/MM/yy');
        this.sumCosts = this.calculateSum();
        this.loading = false;
      },
      error:  error => {
        if (error.status === 404) {
          // Redirect to home page when the trip is not found
          this.router.navigate(['/']);
          this.loading = false;
        } else {
          // Handle other errors as needed
          console.error('Error fetching trip:', error);
          this.loading = false;
        }
      }
    });
  }


  formatDate(date:Date) {
    return this.datePipe.transform(date, 'dd/MM/yy');
  }

  back(){
    this.router.navigate(['/trips/all']);
  }
}