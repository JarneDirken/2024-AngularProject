import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { Trip } from '../../model/Trip';
import { Subscription } from 'rxjs';
import { TripService } from '../../services/trip.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {TripType, TripTypeDetails } from '../../model/TripType';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-trip-public-list',
  providers: [DatePipe],
  standalone: true,
  imports: [CommonModule,MatTooltipModule, RouterModule,FormsModule],
  templateUrl: './trip-public-list.component.html',
  styleUrl: './trip-public-list.component.css'
})
export class TripPublicListComponent implements OnInit, OnDestroy {
  searchTerm: string = "";
  publicTrips: Trip[] = [];
  publicTrips$: Subscription = new Subscription();
  loading: boolean = true;
  errorMessage: string = '';
  selectedTripType?: TripType;
  
  tripDetails:  Record<number, { name: string, icon: string }> = TripTypeDetails;
  TripTypes: Record<number, { name: string, icon: string }> = TripTypeDetails;
  tripTypes: (number)[] = Object.values(TripType).filter(value => typeof value === 'number').map(value => value as number);

  constructor(private tripService: TripService, private datePipe: DatePipe, private location: Location, private router: Router) {}

  ngOnInit(): void {
    this.getPublicTrips();
  }

  ngOnDestroy(): void {
    this.publicTrips$.unsubscribe();
  }

  getPublicTrips() {
    this.loading = true;
    this.publicTrips$ = this.tripService.getPublicTrips().subscribe(
      result => {
        this.publicTrips = result;
        this.loading = false;
      },
      error => {
        console.error('Error fetching trips:', error);
        this.loading = false;
      }
    );
  }

  formatDate(date:Date) {
    return this.datePipe.transform(date, 'dd/MM/yy');
  }

  filterTripType(event: Event): void {
    const selectedValue = (event?.target as HTMLSelectElement)?.value ?? '';
    const numericValue = Number(selectedValue);
    if (!isNaN(numericValue)) {
      this.selectedTripType = numericValue;
    } else {
      this.selectedTripType = undefined;
    }
    this.searchTrips();
    
  }

  searchTrips() {
    this.publicTrips$ = this.tripService.searchPublicTrips(this.searchTerm,this.selectedTripType?.toString()).subscribe(result => this.publicTrips = result);
  }

  back() {
    this.location.back();
  }
}
