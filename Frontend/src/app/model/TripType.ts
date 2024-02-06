export enum TripType {
    City,
    Road,
    Beach,
    Historical,
    Cruise,
    Hiking,
    Biking,
    Other,
}

export const TripTypeDetails: Record<number, { name: string, icon: string }> = {
    [TripType.City]: { name: 'City', icon: 'fa-city' },
    [TripType.Road]: { name: 'Road', icon: 'fa-road' },
    [TripType.Beach]: { name: 'Beach', icon: 'fa-umbrella-beach' },
    [TripType.Historical]: { name: 'Historical', icon: 'fa-building-columns' },
    [TripType.Cruise]: { name: 'Cruise', icon: 'fa-ship' },
    [TripType.Hiking]: { name: 'Hiking', icon: 'fa-person-hiking' },
    [TripType.Biking]: { name: 'Biking', icon: 'fa-person-biking' },
    [TripType.Other]: { name: 'Other', icon: 'fa-location-dot' },
};
  