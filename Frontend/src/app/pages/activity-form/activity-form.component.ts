import { Component, OnDestroy, OnInit, Injectable, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { CommonModule } from '@angular/common';
import { Activity } from '../../model/Activity';
import { Subscription } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import { ActivityType } from '../../model/ActivityType';
import { Cost } from '../../model/Cost';
import { Currency, CurrencySymbols } from '../../model/Currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import { PlaceAutocompleteComponent, PlaceSearchResult } from '../../components/place-autocomplete/place-autocomplete.component';
import { PlaceDetailsComponent } from '../../components/place-details/place-details.component';
import { MapDisplayComponent } from '../../components/map-display/map-display.component';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
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
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, MatTooltipModule,PlaceAutocompleteComponent, PlaceDetailsComponent, MapDisplayComponent, FormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.css',
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ],
})
export class ActivityFormComponent implements OnInit, OnDestroy {
  isAdd: boolean = false;
  isEdit: boolean = false;
  tripId: number = 0;
  currency: Currency = 0;
  userId: string = '';
  activityId: number = 0;
  activityCostAmount: number = 0;
  activityTypes: ActivityType[] = [];
  fromValue: PlaceSearchResult | undefined;
  toValue: PlaceSearchResult | undefined;
  activity: Activity = { id: 0, name: "",cost: {id: 0,amount:0, currency: this.currency}, activityType: {id: 0, name: ''}, description: '', location: '', start: new Date(NaN), end:new Date(NaN) };
  isSubmitted: boolean = false;
  errorMessage: string = "";
  cost: Cost = { id: 0, amount: 0, currency: Currency.EUR};
  
  currencySymbols: Record<number, string> = CurrencySymbols;
  Currencies: object = Currency;
  currencies: (number |Currency)[] = Object.values(Currency).filter(value => typeof value === 'string').map(value => Currency[value as keyof typeof Currency]);

  activity$: Subscription = new Subscription();
  postActivity$: Subscription = new Subscription();
  putCost$: Subscription = new Subscription();
  putActivity$: Subscription = new Subscription();

  constructor(private router: Router, private tripService: TripService, public auth: AuthService, private location: Location, private snackBar: MatSnackBar) {
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.['mode'] === 'add';
    this.isEdit = this.router.getCurrentNavigation()?.extras.state?.['mode'] === 'edit';
    this.tripId = this.router.getCurrentNavigation()?.extras.state?.['tripId'];
    this.currency = this.router.getCurrentNavigation()?.extras.state?.['currency'];
    this.activityId = this.router.getCurrentNavigation()?.extras.state?.['activityId'];

    if (!this.isAdd && !this.isEdit) {
      this.isAdd = true;
    }

    if (this.activityId != null && this.tripId > 0) {
      this.activity$ = this.tripService.getActivityById(this.activityId).subscribe( 
        {
          next: result => {
            this.activity = result;
            if (this.activity.cost?.amount) this.activityCostAmount = this.activity.cost?.amount;
          },
          error: error => {
            console.error('Error fetching activity:', error);
          }});
    }
  }

  ngOnInit(): void {
    this.activity.cost!.currency = this.currency;
    this.tripService.getActivityTypes().subscribe({
      next: activityTypes => {
        this.activityTypes = activityTypes;
      },
      error: error => {
        console.error('Error fetching activity types:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.activity$.unsubscribe();
    this.postActivity$.unsubscribe();
    this.putCost$.unsubscribe();
    this.putActivity$.unsubscribe();
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

  OnSubmit() {
    this.isSubmitted = true;
    if (this.currency != undefined) {
      this.activity.cost = { id: 0,
        amount: this.activityCostAmount,
        currency: this.currency }
    }
    if (this.activityCostAmount) this.activity.cost!.amount = this.activityCostAmount;
    if (this.currency == undefined)  this.activity.cost = undefined;
    if (this.isAdd) {
      this.postActivity$ = this.tripService.postActivity(this.tripId, this.activity).subscribe({
        next: (v) => {this.router.navigateByUrl("/trip/" + this.tripId),this.snackBar.open('Successfully created activity', undefined, {
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
            this.router.navigate(['error'], { state: { message: "You are not allowed to see that! 😡" } });
            // this.loading = false;
          } else {
            // Handle other errors as needed
            this.router.navigate(['error'], { state: { message: "Oops, something went wrong 😢" } });
            // this.loading = false;
          }
        }
      });
    }
    if (this.isEdit) {
      this.putActivity$ = this.tripService.putActivity(this.activityId, this.activity).subscribe({
        next: (v) => {this.router.navigateByUrl("/trip/" + this.tripId),this.snackBar.open('Successfully edited activity', undefined, {
          duration: 4000, // 4 seconds
          verticalPosition: 'top',
          horizontalPosition: 'end', 
          panelClass: ['success-snackbar', 'red-snackbar'],
        });},
        // error: (e) => this.errorMessage = e.message
        error: error => {
          if (error.status === 404) {
            // Redirect to home page when the resource is not found
            this.router.navigate(['error'], { state: { message: "What you were looking for doesn't exist 😢" } });
            // this.loading = false;
          } else if (error.status === 401) {
            // Redirect to error page (still need to make) if the user isn't authorized
            this.router.navigate(['error'], { state: { message: "You are not allowed to see that! 😡" } });
            // this.loading = false;
          } else {
            // Handle other errors as needed
            this.router.navigate(['error'], { state: { message: "Oops, something went wrong 😢" } });
            // this.loading = false;
          }
        }
      })
    }
  }

  back(): void{
    this.location.back();
  }
}
