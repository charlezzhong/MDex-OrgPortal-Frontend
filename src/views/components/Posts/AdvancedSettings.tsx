// AdvancedSettings.tsx
import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const AdvancedSettings = () => {
  const [isGuestlistVisible, setGuestlistVisibility] = useState(true);
  const [isActivityVisible, setActivityVisibility] = useState(true);

  const guestList = [
    { id: 1, name: 'Guest 1', imgSrc: 'https://www.bridgemi.com/sites/default/files/styles/full_width_image/public/2022-07/SJO-portrait-192-sq.jpg?itok=PyJhVoF1' },
    { id: 2, name: 'Guest 2', imgSrc: 'https://lsa.umich.edu/content/michigan-lsa/en/faculty-staff/office-of-the-dean/dean-curzan-s-biography/jcr:content/par/textimage/image.transform/bigfree/image.png' },
    { id: 3, name: 'Guest 3', imgSrc: 'https://lsa.umich.edu/content/michigan-lsa/globalscholars/en/people/faculty-staff/balexp/jcr:content/profileImage.transform/profile_portrait/image.jpg' },
    
  ];

  const activityList = [
    { id: 1, name: 'Santa Ono', imgSrc: 'https://www.bridgemi.com/sites/default/files/styles/full_width_image/public/2022-07/SJO-portrait-192-sq.jpg?itok=PyJhVoF1', comment: 'So excited for this event!!', time: '1hr' },
    { id: 2, name: 'Anne Curzan', imgSrc: 'https://lsa.umich.edu/content/michigan-lsa/en/faculty-staff/office-of-the-dean/dean-curzan-s-biography/jcr:content/par/textimage/image.transform/bigfree/image.png', comment: 'OMG you’re going Santa???', time: '29 min' },
    { id: 3, name: 'Benjamin Peters', imgSrc: 'https://lsa.umich.edu/content/michigan-lsa/globalscholars/en/people/faculty-staff/balexp/jcr:content/profileImage.transform/profile_portrait/image.jpg', comment: 'Anyone wanna meet up before the event?', time: '4 min' },
  ];
  //TODO: Add the following to the post schema: visibility, pp (short for password protect)
  //TODO: Create new schema for comments which has id, userID, postID, and comment
  //TODO:  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#333',
      color: '#fff',
      padding: '2rem',
      borderRadius: '1.2rem',
      width: '100%',
      marginTop: '2rem',
      borderColor: '#635bff'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '2px solid white', paddingBottom: '0.5rem' }}>Event Settings</h2>
      <p style={{marginTop: '0.7rem', fontSize: '1rem'}}>Increase sales by driving organic discovery and list your event in the MDex event feed</p>
      <div style={{ marginTop: '1rem' }}>
        {/*TODO: */}
        <label style={{ display: 'block', marginBottom: '0.7rem' }}>
          <input type="checkbox" /> Show on Explore
          <p style={{marginLeft: '1.0rem', fontSize: '0.8rem'}}>This promotes your event to the entire umich community</p>
        </label>
        <label style={{ display: 'block', marginBottom: '0.7rem' }}>
          <input type="checkbox" /> Password Protected Event
          <p style={{marginLeft: '1.0rem', fontSize: '0.8rem'}}>Attendees will need a password to access the event page</p>
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <div style={{ flex: 1, marginRight: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid white', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Guestlist</h3>
            <button
              onClick={() => setGuestlistVisibility(!isGuestlistVisible)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              {isGuestlistVisible ? <IoEyeOutline size={24} /> : <IoEyeOffOutline size={24} />}
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {isGuestlistVisible ? (
              <>
                <p style={{ marginBottom: '1.4rem' }}>Your guestlist will appear here</p>
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1.2rem' }}>
                  {guestList.map((guest) => (
                    <div key={guest.id}>
                      <img
                        src={guest.imgSrc}
                        alt={guest.name}
                        style={{ borderRadius: '50%', width: '95px', height: '95px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Guestlist is hidden</p>
            )}
          </div>
        </div>

        <div style={{ flex: 1, marginLeft: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid white', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Activity</h3>
            <button
              onClick={() => setActivityVisibility(!isActivityVisible)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              {isActivityVisible ? <IoEyeOutline size={24} /> : <IoEyeOffOutline size={24} />}
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {isActivityVisible ? (
              <>
                <p style={{ marginBottom: '1.4rem' }}>Your comments will appear here</p>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {activityList.map((activity) => (
                    <li key={activity.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <img
                        src={activity.imgSrc}
                        alt={activity.name}
                        style={{ borderRadius: '50%', width: '50px', height: '50px', objectFit: 'cover', marginRight: '1rem' }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '1rem' }}>{activity.name}</strong>
                        <p style={{ margin: '0.23rem 0' }}>{activity.comment}</p>
                        <small style={{ color: 'gray' }}>{activity.time}</small>
                      </div>
                    </li>

                  ))}
                </ul>
              </>
            ) : (
              <p>Activity is hidden</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
