import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../model/Trip';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { TripService } from '../../services/trip.service';
import { Subscription } from 'rxjs';
import { TripType } from '../../model/TripType';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { User } from 'src/app/model/User';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-invite-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, MatDialogModule, MatTooltipModule],
  templateUrl: './invite-form.component.html',
  styleUrl: './invite-form.component.css'
})
export class InviteFormComponent implements OnInit, OnDestroy {

  // tripId: number = 0;
  userId: string = '';

  newFriendEmail = "";
  newUser: User = {email: '', tripId: 0, id: 0, picture: ''}
  usersToAdd: string[] = [];

  trip: Trip = { id: 0, name: "", type: TripType.Beach, location: "", image: "", start: new Date(), end:new Date(), activities: [], userId: '', isPublic: false, users : [], count: 0 };

  isSubmitted: boolean = false;
  errorMessage: string = "";

  trip$: Subscription = new Subscription();
  putTrip$: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: {trip: Trip},public dialogRef: MatDialogRef<InviteFormComponent>,private router: Router, private tripService: TripService, public auth: AuthService,  private snackBar: MatSnackBar) {
    this.trip = data.trip;

    // Retrieve user ID from Auth0
    this.auth.user$.subscribe((user) => {
      if (user) {
        // Extract user ID from the ID token
        this.userId = user.sub || ''; // 'sub' is the user ID in the token
      }
    });

    // if (this.tripId != null && this.tripId > 0) {
    //   this.trip$ = this.tripService.getTripById(this.tripId).subscribe(result => this.trip = result);
    // }

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.trip$.unsubscribe();
    this.putTrip$.unsubscribe();
  }

  // Function to add a friends email to the trip, display an error message if the email is invalid
  addFriend() {
    if (!this.newFriendEmail) return;
    this.newUser.email = this.newFriendEmail;
    this.newUser.tripId = this.trip.id;
    if (this.newFriendEmail) {
      this.trip.users?.push(this.newUser);
      this.newFriendEmail = '';
      this.errorMessage = "";
    }
    this.saveInvites("added user");
  }

  saveInvites(text: string) {
    this.isSubmitted = true;
  
    this.putTrip$ = this.tripService.putTrip(this.trip.id, this.trip).subscribe({
      next: (v) => {this.router.navigateByUrl("/trip/" + this.trip.id),
      this.snackBar.open('Successfully '+text, undefined, {
        duration: 4000, // 4 seconds
        verticalPosition: 'top',
        horizontalPosition: 'end', 
        panelClass: ['success-snackbar'],
      });},
      error: error => {
        if (error.status === 404) {
          // Redirect to home page when the trip is not found
          this.router.navigate(['error'], { state: { message: "What you were looking for doesn't exist 😢" } });
          // this.loading = false;
        } else if (error.status === 401) {
          // Redirect to error page (still need to make) if the user isn't authorized
          this.router.navigate(['error'], { state: { message: "You are not allowed to see that trip! 😡" } });
          // this.loading = false;
        } else {
          // Handle other errors as needed
          this.router.navigate(['error'], { state: { message: "Oops, something went wrong 😢" } });
          // this.loading = false;
        }
      }
    });
  }

  // Function to remove a friends email from the trip
  removeFriend(index: number) {
    this.trip.users?.splice(index, 1);
    this.saveInvites("removed user");
  }

  // Function to clear the error message
  clearError() {
    this.errorMessage = "";
  }
}
