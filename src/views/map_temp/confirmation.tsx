'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const Confirmation: React.FC = () => {
  const searchParams = useSearchParams();

  // Initialize states for each field with their initial values from query params
  const [country, setCountry] = useState<string | null>(searchParams.get('country') || null);
  const [route, setRoute] = useState<string | null>(searchParams.get('route') || null);
  const [locality, setLocality] = useState<string | null>(searchParams.get('locality') || null);
  const [administrative_area_level_1, setAdministrativeAreaLevel1] = useState<string | null>(
    searchParams.get('administrative_area_level_1') || null
  );
  const [postal_code, setPostalCode] = useState<string | null>(searchParams.get('postal_code') || null);
  const [lat, setLat] = useState<string | null>(searchParams.get('lat') || null);
  const [lng, setLng] = useState<string | null>(searchParams.get('lng') || null);
  const [campus, setCampus] = useState<string | null>(null);
  // Function to handle changes in each input field
  useEffect(() => {
    const fetchCampusInfo = async () => {
      console.log("lat at this time: ", lat);
      console.log("lng at this time: ", lng);
      if (lat && lng) {
        try {
          const response = await fetch(`http://localhost:3000/api/data?lat=${lat}&lng=${lng}`);
          console.log(response);
          const data = await response.json();
          console.log(data);
          setCampus(data.campus);
        } catch (error) {
          console.error('Error fetching campus info:', error);
        }
      }
    };

    fetchCampusInfo();
  }, [lat, lng]);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Confirm your address</h1>
      <form style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Country/Region: </label>
          <input
            type="text"
            value={country || ''}
            onChange={handleInputChange(setCountry)}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Street Address: </label>
          <input
            type="text"
            value={route || ''}
            onChange={handleInputChange(setRoute)}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>City/Town: </label>
          <input
            type="text"
            value={locality || ''}
            onChange={handleInputChange(setLocality)}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Province/State: </label>
          <input
            type="text"
            value={administrative_area_level_1 || ''}
            onChange={handleInputChange(setAdministrativeAreaLevel1)}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Zip Code: </label>
          <input
            type="text"
            value={postal_code || ''}
            onChange={handleInputChange(setPostalCode)}
          />
        </div>
      </form>
      {campus && (
        <div style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Campus: {campus}
        </div>
      )}
    </div>
  );
};

export default Confirmation;