import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isToday, isPast, subMonths, isBefore, startOfToday } from 'date-fns';
import useWindowDimensions from './useWindowDimensions';

interface DateSelectorProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, setSelectedDate }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [visibleMonths, setVisibleMonths] = useState(3);
  const selectorRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowDimensions();

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

  // Handle window resize to adjust the number of visible months
  useEffect(() => {
    if (width !== undefined) {
      if (width < 768) {
        setVisibleMonths(1);
      } else if (width < 1024) {
        setVisibleMonths(2);
      } else {
        setVisibleMonths(3);
      }
    }
  }, [width]);

  // Generate dates for the next few months based on visible months
  const generateDates = (startDate: Date) => {
    const months = Array.from({ length: visibleMonths }, (_, offset) => {
      const start = startOfMonth(addMonths(startDate, offset));
      const end = endOfMonth(start);
      const days = eachDayOfInterval({ start, end });
      return { month: format(start, 'MMMM yyyy'), days };
    });
    return months;
  };

  const handleDateClick = (date: Date) => {
    if (!isPast(date) || isToday(date)) {
      setSelectedDate(date);
      setShowSelector(false);
    }
  };

  const months = generateDates(currentMonth);

  const renderDaysOfWeek = () => {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days.map(day => (
      <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>{day}</div>
    ));
  };

  const renderEmptyDays = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} style={{ textAlign: 'center' }}></div>
    ));
  };

  const desktopView = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: height ?? '100%', padding: '10px' }}>
      <button
        onClick={() => !isBefore(startOfMonth(currentMonth), startOfToday()) && setCurrentMonth(subMonths(currentMonth, 1))}
        style={{
          background: 'none',
          border: 'none',
          cursor: isBefore(startOfMonth(currentMonth), startOfToday()) ? 'not-allowed' : 'pointer',
          fontSize: '20px',
          color: isBefore(startOfMonth(currentMonth), startOfToday()) ? '#ccc' : 'inherit',
          padding: '0 20px'
        }}
        disabled={isBefore(startOfMonth(currentMonth), startOfToday())}
      >
        &lt;
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Select a Date</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', border: '1px solid #ccc', borderRadius: '12px', padding: '10px' }}>
          {months.map(({ month, days }) => (
            <div key={month} style={{ flex: `0 0 calc((100% / ${visibleMonths}) - 10px)`, backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
              <h3 style={{
                textAlign: 'center',
                fontSize: '16px',
                margin: '0 0 10px'
              }}>{month}</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '10px'
              }}>
                {renderDaysOfWeek()}
                <div style={{ gridColumn: 'span 7', height: '2px', backgroundColor: '#ddd', margin: '10px 0' }}></div>
                {renderEmptyDays(getDay(days[0]))}
                {days.map((day) => (
                  <div
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    style={{
                      padding: '10px',
                      cursor: isPast(day) && !isToday(day) ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      color: selectedDate && isSameDay(selectedDate, day) ? 'white' : isToday(day) ? 'orange' : isPast(day) ? '#999' : '#333',
                      border: selectedDate && isSameDay(selectedDate, day) ? 'none' : '1px solid transparent',
                      backgroundColor: selectedDate && isSameDay(selectedDate, day) ? 'black' : 'transparent',
                      borderRadius: '12px',
                      textAlign: 'center',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedDate || !isSameDay(selectedDate, day)) {
                        e.currentTarget.style.border = '1px solid black';
                        e.currentTarget.style.borderRadius = '12px';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedDate || !isSameDay(selectedDate, day)) {
                        e.currentTarget.style.border = '1px solid transparent';
                      }
                    }}
                  >
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '0 20px' }}>
        &gt;
      </button>
    </div>
  );

  const mobileView = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 20px' }}>
        {months.map(({ month, days }) => (
          <div key={month} style={{ marginBottom: '20px' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '16px',
              margin: '0 0 10px'
            }}>{month}</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '10px'
            }}>
              {renderDaysOfWeek()}
              <div style={{ gridColumn: 'span 7', height: '2px', backgroundColor: '#ddd', margin: '10px 0' }}></div>
              {renderEmptyDays(getDay(days[0]))}
              {days.map((day) => (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  style={{
                    padding: '10px',
                    cursor: isPast(day) && !isToday(day) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    color: selectedDate && isSameDay(selectedDate, day) ? 'white' : isToday(day) ? 'orange' : isPast(day) ? '#999' : '#333',
                    border: selectedDate && isSameDay(selectedDate, day) ? 'none' : '1px solid transparent',
                    backgroundColor: selectedDate && isSameDay(selectedDate, day) ? 'black' : 'transparent',
                    borderRadius: '12px',
                    textAlign: 'center',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedDate || !isSameDay(selectedDate, day)) {
                      e.currentTarget.style.border = '1px solid black';
                      e.currentTarget.style.borderRadius = '12px';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedDate || !isSameDay(selectedDate, day)) {
                      e.currentTarget.style.border = '1px solid transparent';
                    }
                  }}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setShowSelector(false)} style={{
        width: '100%',
        padding: '20px',
        fontSize: '16px',
        background: 'orange',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'center'
      }}>
        Continue
      </button>
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {showSelector && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 998
      }} onClick={() => setShowSelector(false)}></div>}

      <button onClick={() => setShowSelector(!showSelector)} style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        background: '#fff',
        border: showSelector ? '1px solid orange' : '1px solid #ccc',
        borderRadius: '8px',
        transition: 'border-color 0.2s'
      }}>
        {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select Date'}
      </button>

      {showSelector && (
        <div ref={selectorRef} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          padding: '20px',
          borderRadius: '12px'
        }}>
          {width !== undefined && height !== undefined && (width < 768 ? mobileView : desktopView)}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
