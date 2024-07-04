'use client';

import React, {useState} from 'react';
import GoogleMapComponent from '../components/GoogleMap';
//import {useRouter} from 'next/router';
import { useRouter } from 'next/navigation';
import { path } from '@/helpers/path';
import { Address } from '../../types/address.interface'; // Import the Address type
import Link from 'next/link'
/*import { Address } from '@/types/address.interface';*/


const Home: React.FC = () => {
  const router = useRouter();
  //const [address, setAddress] = useState<any>(null);
  const [address, setAddress] = useState<Address | null>(null); // Use Address type
  const handleAddressSelect = (selectedAddress: Address) => {
    setAddress(selectedAddress);
  };
    
    const navigateToConfirmation = () => {
      if (address) {
        const { country, route, locality, administrative_area_level_1, postal_code } = address;
        const query = `?country=${country}&route=${route}&locality=${locality}&administrative_area_level_1=${administrative_area_level_1}&postal_code=${postal_code}`;
        router.push(`${path.map_temp.confirmation}${query}`);
      }
    };
  
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Where's your place located?</h1>
      <div style={{ height: '500px', width: '100%' }}>
        <GoogleMapComponent onSelectAddress={handleAddressSelect}/>
      </div>
      {address && (
        <button onClick={navigateToConfirmation} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Next
        </button>
      )}
    </div>
  );
};

export default Home;