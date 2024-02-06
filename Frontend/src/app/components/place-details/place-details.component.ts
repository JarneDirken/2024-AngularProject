import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import {} from '@angular/google-maps'
import { PlaceSearchResult } from '../place-autocomplete/place-autocomplete.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.css']
})
export class PlaceDetailsComponent implements OnInit{

  @Input() data: PlaceSearchResult | undefined;

  constructor() {}

  ngOnInit(): void {}

}
