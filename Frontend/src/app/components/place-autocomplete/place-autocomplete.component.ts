import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import {} from '@angular/google-maps'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface PlaceSearchResult{
  address: string;
  location?: google.maps.LatLng;
  imageUrl?: string;
  iconUrl?: string;
  name?: string;
}

@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlaceAutocompleteComponent),
      multi: true,
    },
  ],
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css']
})
export class PlaceAutocompleteComponent implements OnInit, ControlValueAccessor {

  @ViewChild('placeInputField') placeInputField!: ElementRef; 

  @Input() placeholder = ''

  @Output() placeChanged = new EventEmitter<PlaceSearchResult>

  autocomplete: google.maps.places.Autocomplete | undefined;

  private onChange: (value: string | undefined) => void = () => {};

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (typeof window['google'] !== 'undefined') {
      const googleMaps = window['google'] as any;

      this.autocomplete = new window['google'].maps.places.Autocomplete(this.placeInputField.nativeElement);

      this.autocomplete.addListener('place_changed', () => {
        this.handlePlaceChanged();
      });
  
      this.placeInputField.nativeElement.addEventListener('input', () => {
        this.handleInput();
      });
    } else {
      // Handle the case where the Google Maps API is not yet loaded or available.
      console.error('Google Maps API is not loaded.');
    }
  }

  private handleInput() {
    // Reset isPlaceSelected when the user manually types or removes characters
    // Notify Angular Forms about the value change
    this.onChange(this.placeInputField.nativeElement.value);
  }

  private handlePlaceChanged() {
    const place = this.autocomplete?.getPlace();
  
    const result: PlaceSearchResult = {
      address: this.placeInputField.nativeElement.value,
      name: place?.name,
      location: place?.geometry?.location,
      imageUrl: this.getPhotoUrl(place),
      iconUrl: place?.icon,
    };
  
    this.ngZone.run(() => {
      this.placeChanged.emit(result);
      this.onChange(result.name); // Notify Angular Forms about the value change
    });
  }

  getPhotoUrl(place: google.maps.places.PlaceResult | undefined): string | undefined {
    return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 500 }) : undefined;
  }

  // Implement ControlValueAccessor methods
  writeValue(value: string): void {
    this.placeInputField.nativeElement.value = value;
  }

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.placeInputField.nativeElement.disabled = isDisabled;
  }
}
