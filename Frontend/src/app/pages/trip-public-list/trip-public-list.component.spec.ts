import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPublicListComponent } from './trip-public-list.component';

describe('TripPublicListComponent', () => {
  let component: TripPublicListComponent;
  let fixture: ComponentFixture<TripPublicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripPublicListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripPublicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
