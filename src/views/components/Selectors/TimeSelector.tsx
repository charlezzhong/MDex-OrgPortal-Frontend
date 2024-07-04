import React, { useState, useRef, useEffect } from 'react';

const TimeSelector: React.FC = () => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('Start Time');
  const selectorRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
      setShowSelector(false);
    }
  };

  // Add/remove event listener for clicking outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Adjust the height dynamically on resize and on dropdown display
  useEffect(() => {
    if (showSelector) {
      const adjustHeight = () => {
        const screenHeight = window.innerHeight;
        const topOffset = selectorRef.current?.getBoundingClientRect().top || 0;
        const maxHeight = screenHeight - topOffset - 20;  // 20px margin from the bottom
        selectorRef.current!.style.maxHeight = `${maxHeight}px`;
      };

      adjustHeight();
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }
  }, [showSelector]);

  // Time slots for selection
  const times = {
    'Opening Times': ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM'],
    'Morning-Afternoon': ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'],
    'Evening': ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']
  };

  // Handle time selection
  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setShowSelector(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Overlay for dimming the background when dropdown is active */}
      {showSelector && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 998
      }} onClick={() => setShowSelector(false)}></div>}

      {/* Dropdown button */}
      <button onClick={() => setShowSelector(!showSelector)} style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        background: '#fff',
        border: showSelector ? '3px solid orange' : '1px solid #ccc',
        borderTopRightRadius: '12px',  // Applied to top right corner
        borderBottomRightRadius: '12px',  // Applied to bottom right corner
        transition: 'border-color 0.2s'
      }}>
        {selectedTime}
      </button>

      {/* Dropdown menu */}
      {showSelector && (
        <div ref={selectorRef} style={{
          display: 'block',
          position: 'absolute',
          top: '50px',
          left: '0',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          width: '340px',  // Increased width
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          padding: '0px',  // No padding here
          borderRadius: '12px',
          overflowY: 'auto'
        }}>
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            backgroundColor: 'white', 
            padding: '20px 20px 10px', 
            borderBottom: '1px solid #ddd', 
            zIndex: 10 
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '18px', 
              margin: '0' 
            }}>Select Pickup Time</h2>
          </div>
          <div style={{ padding: '20px' }}>
            {Object.entries(times).map(([period, timeArray]) => (
              <div key={period} style={{ marginBottom: '20px' }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  padding: '5px 0',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {period}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',  // Adjusted spacing between grid items
                }}>
                  {timeArray.map((time) => (
                    <div
                      key={time}
                      onClick={() => handleTimeClick(time)}
                      style={{
                        padding: '12px 0',  // Adjusted padding
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: selectedTime === time ? 'white' : '#333',
                        border: '1px solid',
                        borderColor: selectedTime === time ? 'orange' : '#ccc',
                        borderRadius: '12px',
                        textAlign: 'center',
                        backgroundColor: selectedTime === time ? 'orange' : '#f9f9f9',
                        transition: 'background-color 0.2s, border-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTime !== time) e.currentTarget.style.backgroundColor = '#e0e0e0';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTime !== time) e.currentTarget.style.backgroundColor = '#f9f9f9';
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
