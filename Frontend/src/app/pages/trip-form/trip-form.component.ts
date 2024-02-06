import { Component, Injectable, OnDestroy, OnInit, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Subscription } from 'rxjs';
import { Trip } from '../../model/Trip';
import { TripType } from '../../model/TripType';
import { AuthService } from '@auth0/auth0-angular';
import { Currency, CurrencySymbols } from '../../model/Currency';
import { Cost } from '../../model/Cost';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import { PlaceAutocompleteComponent, PlaceSearchResult } from '../../components/place-autocomplete/place-autocomplete.component';
import { PlaceDetailsComponent } from '../../components/place-details/place-details.component';
import { MapDisplayComponent } from '../../components/map-display/map-display.component';
import { Location, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { TripTypeDetails} from '../../model/TripType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';



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
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, MatTooltipModule,PlaceAutocompleteComponent, PlaceDetailsComponent, MapDisplayComponent, FormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ],
})
export class TripFormComponent implements OnInit, OnDestroy {
  tripId: number = 0;
  email: string = '';
  currency: number = 0;
  userId: string = '';
  fromValue: PlaceSearchResult | undefined;
  newFriendEmail = "";
  usersToAdd: string[] = [];

  selectedTripType?: TripType;
  tripDetails:  Record<number, { name: string, icon: string }> = TripTypeDetails;
  TripTypes: object = TripType;
  tripTypes: (number)[] = Object.values(TripType).filter(value => typeof value === 'number').map(value => value as number);

  trip: Trip = { id: 0, name: "", location: "", image: "", cost: {id: 0,amount:0, currency: 0},start: new Date(), end:new Date(), activities: [], userId: '', isPublic: false, users : [{ email : '', tripId : 0, id : 0, picture: ''}], count: 0 };


  isSubmitted: boolean = false;
  isCost: boolean = false;
  shouldDelete: boolean = false;
  errorMessage: string = "";
  
  cost: Cost = { id: 0, amount: 100, currency: Currency.EUR}
  currencySymbols: Record<number, string> = CurrencySymbols;
  Currencies: object = Currency;
  currencies: (number |Currency)[] = Object.values(Currency).filter(value => typeof value === 'string').map(value => Currency[value as keyof typeof Currency]);


  trip$: Subscription = new Subscription();
  putTrip$: Subscription = new Subscription(); 
  putCost$: Subscription = new Subscription();
  deleteCost$: Subscription = new Subscription();

  constructor(private router: Router, private tripService: TripService, public auth: AuthService, private location: Location, private confirmationModalService: ConfirmationModalService,  private snackBar: MatSnackBar) {
    this.tripId = +this.router.getCurrentNavigation()?.extras.state?.['id'];

    // Retrieve user ID from Auth0
    this.auth.user$.subscribe((user) => {
      if (user) {
        // Extract user ID from the ID token
        this.userId = user.sub || ''; // 'sub' is the user ID in the token
      }
    });

    if (this.tripId != null && this.tripId > 0) {
      this.trip$ = this.tripService.getTripById(this.tripId).subscribe(
        {
          next: result => {
            this.trip = result;
            this.selectedTripType = result.type;
            if (result.cost != null) {
              this.isCost = true;
              this.shouldDelete = true;
            }
          }
        });
    }
  }

  ngOnInit(): void {
  }

  ifDelete($event: Event) {
    if (!this.isCost) {
      this.confirmationModalService
      .openConfirmationModal('Confirm Deletion', 'Are you sure you want to remove the budget? This will also delete all the activity costs!')
      .subscribe((result) => {
        if (result) {
          this.isCost = false;
        }
        else {
          this.isCost = true;
        }
      });
    }
    
  }

  ngOnDestroy(): void {
    this.trip$.unsubscribe();
    this.putTrip$.unsubscribe();
    this.putCost$.unsubscribe();
    this.deleteCost$.unsubscribe();
  }

  selectCurrency(event: Event): void {
    const selectedValue = (event?.target as HTMLSelectElement)?.value ?? '';
    const numericValue = Number(selectedValue);
    if (!isNaN(numericValue)) {
      this.cost.currency = numericValue;
    } else {
    console.error('Invalid numeric value:', selectedValue);
    }
  }

  updateTrip(n:number, t: Trip) {
    this.putTrip$ = this.tripService.putTrip(n, t).subscribe({
      next: (v) => {this.router.navigateByUrl("/trips/all"), this.snackBar.open('Successfully updated trip', undefined, {
        duration: 4000, // 4 seconds
        verticalPosition: 'top',
        horizontalPosition: 'end', 
        panelClass: ['success-snackbar'],
      });},
      error: (e) => this.errorMessage = e.message
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

  onSubmit() {
    this.isSubmitted = true;
    this.trip.userId = this.userId;
    var costTodelete: number | undefined = undefined;

    this.trip.type = this.selectedTripType;

    if (this.fromValue?.imageUrl != undefined){
      this.trip.image = this.fromValue?.imageUrl;
    }
    

    if (this.shouldDelete && !this.isCost && this.trip.cost ) costTodelete = this.trip.cost.id
    if (!this.isCost) this.trip.cost = undefined;
    else {
      if (this.trip.cost == null) this.trip.cost = this.cost;
      this.trip.cost!.currency = Number(this.trip.cost!.currency);
    }
      
    if (costTodelete) {
      this.deleteCost$ = this.tripService.deleteCost(costTodelete).subscribe({
        next: (v) => this.updateTrip(this.tripId,this.trip),
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
    } else this.updateTrip(this.tripId,this.trip);
  }
  
  addFriend() {
    if (this.newFriendEmail) {
      this.usersToAdd.push(this.newFriendEmail);
      this.newFriendEmail = ''; // Clear the input field after adding a friend
    }
  }

  removeFriend(index: number) {
    this.usersToAdd.splice(index, 1);
  }

  back(): void{
    this.location.back();
  }
}