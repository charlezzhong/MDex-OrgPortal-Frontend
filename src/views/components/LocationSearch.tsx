import React from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface LocationSearchProps {
  onSelect: (place: google.maps.places.PlaceResult) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect }) => {
  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      // Log some place details
    //console.log('Place details:', place);
    //console.log('Place name:', place.name);
    //console.log('Place address:', place.formatted_address);

    onSelect(place);
    } else {
      console.error('Autocomplete is not loaded yet!');
    }
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input type="text" placeholder="Enter a location" style={{ width: '100%', padding: '0.5rem' }} />
    </Autocomplete>
  );
};

export default LocationSearch;