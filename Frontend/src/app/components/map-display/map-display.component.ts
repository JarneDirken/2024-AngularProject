import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps'
import { PlaceSearchResult } from '../place-autocomplete/place-autocomplete.component';
import { map } from 'rxjs/internal/operators/map';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-map-display',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, MatCardModule],
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit{

  @ViewChild('map', { static: true })
  map!: GoogleMap;

  @Input() from : PlaceSearchResult | undefined;
  @Input() to : PlaceSearchResult | undefined;

  zoom = 5;

  directionsResult: google.maps.DirectionsResult | undefined ;

  markerPosition: google.maps.LatLng | undefined;

  constructor(private directionsService: MapDirectionsService) {}

  ngOnChanges() {
    const fromLocation = this.from?.location;
    const toLocation = this.to?.location;

    if (fromLocation && toLocation){
      this.getDirections(fromLocation, toLocation);
    } else if (fromLocation) {
      this.goToLocation(fromLocation);
    } else if (toLocation) {
      this.goToLocation(toLocation);
    }
  }

  goToLocation(location: google.maps.LatLng) {
    this.markerPosition = location;
    this.map.panTo(location);
    this.zoom = 8;
    this.directionsResult = undefined;
  }

  getDirections(from: google.maps.LatLng, to: google.maps.LatLng){
    const request: google.maps.DirectionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request).pipe(
      map(res => res.result)
    ).subscribe((result) => {
      this.directionsResult = result;
      this.markerPosition = undefined;
    })
  }

  ngOnInit(): void {}

}
