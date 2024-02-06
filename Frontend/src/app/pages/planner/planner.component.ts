import { Component, OnDestroy, OnInit, Inject, Injectable, Optional, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceAutocompleteComponent, PlaceSearchResult } from '../../components/place-autocomplete/place-autocomplete.component';
import { PlaceDetailsComponent } from '../../components/place-details/place-details.component';
import { MapDisplayComponent } from '../../components/map-display/map-display.component';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Subscription } from 'rxjs';
import { Trip } from '../../model/Trip';
import { Cost } from '../../model/Cost';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '@auth0/auth0-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Currency, CurrencySymbols } from '../../model/Currency';
import { TripType, TripTypeDetails } from '../../model/TripType';
import { switchMap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';



const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Injectable()
export class MomentUtcDateAdapter extends MomentDateAdapter {

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  override createDate(year: number, month: number, date: number): Moment {
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    let result = moment.utc({ year, month, date }).locale(this.locale);

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }
}

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, MatTooltipModule,PlaceAutocompleteComponent, PlaceDetailsComponent, MapDisplayComponent, FormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
  encapsulation: ViewEncapsulation.None, 
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ],
})

export class PlannerComponent implements OnInit, OnDestroy {
  public loggedInUser: User | undefined;
  title = 'trip-planner';
  fromValue: PlaceSearchResult | undefined;
  // toValue: PlaceSearchResult | undefined;
  isInputVisible = false;
  isAdd: boolean = false;
  isEdit: boolean = false;
  isCost: boolean = false;
  tripId: number = 0;
  userId: string = '';
  email: string = '';
  
  selectedTripType?: TripType;
  tripDetails:  Record<number, { name: string, icon: string }> = TripTypeDetails;
  TripTypes: object = TripType;
  tripTypes: (number)[] = Object.values(TripType).filter(value => typeof value === 'number').map(value => value as number);
  
  currencySymbols: Record<number, string> = CurrencySymbols;
  Currencies: object = Currency;
  currencies: (number |Currency)[] = Object.values(Currency).filter(value => typeof value === 'string').map(value => Currency[value as keyof typeof Currency]);

  trip: Trip = { id: 0, name: "", type: TripType.Other, location: "", image: "", cost: {id: 0,amount:100, currency: 0}, start: new Date(NaN), end:new Date(NaN), isPublic: false, activities: [], userId: '', users : [{ email : '', tripId : 0, id: 0, picture: ''}], count: 0 };

  cost: Cost | null = { id: 0, amount: 0, currency: Currency.EUR}


  isSubmitted: boolean = false;
  errorMessage: string = "";

  postTrip$: Subscription = new Subscription();

  constructor(private router: Router, private tripService: TripService, public auth: AuthService, private snackBar: MatSnackBar ) {
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.['mode'] === 'add';

    // Retrieve user ID from Auth0
    this.auth.user$.subscribe((user) => {
      if (user) {
        // Extract user ID from the ID token
        this.userId = user.sub || ''; // 'sub' is the user ID in the token
      }
    });

    this.isAdd = true;
  }

  toggleInputVisibility() {
    this.isInputVisible = !this.isInputVisible;
  }

  selectCurrency(event: Event): void {
    const selectedValue = (event?.target as HTMLSelectElement)?.value ?? '';
    const numericValue = Number(selectedValue);
    if (!isNaN(numericValue)) {
      this.cost!.currency = numericValue;
    } else {
    console.error('Invalid numeric value:', selectedValue);
    }
  }

  ngOnInit(): void {
    if(this.auth.user$){
      this.auth.user$.subscribe((data) => {
        if (data) this.loggedInUser = data;
      })
    }
  }

  ngOnDestroy(): void {
    this.postTrip$.unsubscribe();
  }

  loginAndContinue(): void {
    // Use switchMap to switch to the login observable and wait for it to complete
    this.auth.loginWithPopup().pipe(
      switchMap(() => this.auth.isAuthenticated$),
      take(1) // Take only the first emitted value (true/false)
    ).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Continue with your logic after successful authentication
        // For example, you might submit the form here
        this.submitForm();
      }
    });
  }

  
  selectTripType(event: Event): void {
    const selectedValue = (event?.target as HTMLSelectElement)?.value ?? '';
    const numericValue = Number(selectedValue);
    if (!isNaN(numericValue)) {
      this.selectedTripType = numericValue;
    } else {
      this.selectedTripType = undefined;
    }
    this.trip.type = this.selectedTripType
    
  }

  submitForm(): void {
    if(this.fromValue?.imageUrl == "" || this.fromValue?.imageUrl == undefined){
      this.trip.image = "../../../assets/images/default-trip.jpg";
    }
    else{
      this.trip.image = this.fromValue?.imageUrl;
    }
    
    this.trip.type = Number(this.trip.type);
    this.isSubmitted = true;

    this.trip.type = this.selectedTripType;

    this.trip.users![0].email = this.email;

    this.trip.userId = this.userId;
    
    this.trip.cost!.currency = Number(this.trip.cost!.currency);
    if (!this.isCost) this.trip.cost = undefined;
      if (this.isAdd) {
        this.postTrip$ = this.tripService.postTrip(this.trip).subscribe({
          next: (v) => {
            this.router.navigateByUrl("/trip/" + v.id);

            this.snackBar.open('Successfully created trip', undefined, {
              duration: 4000, // 4 seconds
              verticalPosition: 'top',
              horizontalPosition: 'end', 
              panelClass: ['success-snackbar'],
            });
          },
          // error: (e) => this.errorMessage = e.message
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
  }
  
  Capitalize(str: string | undefined) {
    if (str) return str.charAt(0).toUpperCase() + str.slice(1);
    return "";
  }

  // // Function to validate the email the user wants to put in
  // validateEmail() {
  //   // Use a regular expression to check for a valid email format
  //   const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  //   if (this.trip.users && this.trip.users.length > 0) {
  //     const isValidEmail = emailPattern.test(this.trip.users[0].email!);

  //     if (this.trip.users[0].email! === '') {
  //       return true;
  //     } else if (!isValidEmail) {
  //       // set the error message if the email is not valid
  //       this.errorMessage = "Please enter a valid email address";
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   return;
  // }

  // Function to clear the error message
  clearError() {
    this.errorMessage = "";
  }
}
