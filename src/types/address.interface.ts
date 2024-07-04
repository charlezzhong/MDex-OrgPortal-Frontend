
export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }
  
  export interface Address {
    address: string;
    lat: number;
    lng: number;
    buildingName?: string; // Add buildingName field
    [key: string]: any; // For additional address components
  }