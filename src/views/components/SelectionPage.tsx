// components/SelectionComponent.js
import React from 'react';

interface Option {
    label: string;
    value: boolean;
    isSelected: boolean;
  }
  
  interface SelectionComponentProps {
    options: Option[];
    onSelect: (value: boolean) => void;
    onContinue: () => void;
  }

  const SelectionPage: React.FC<SelectionComponentProps> = ({ options, onSelect, onContinue }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', justifyContent: 'center', flex: 1 }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold'}}>Let's launch your event</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {options.map((option, index) => (
          <button
            key={index}
            style={{
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                backgroundColor: option.isSelected ? '#635bff' : 'white',
                borderColor: '#635bff',
                color: option.isSelected ? 'white' : '#635bff',
                borderWidth: '1px',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button style={{
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          backgroundColor: 'gray',
          color: 'white',
          marginTop: '1rem',
        }} onClick={onContinue}>

        Continue
      </button>
      <button
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'transparent',
          color: 'gray',
          marginTop: '0.5rem',
          textDecoration: 'underline'
        }}>
        Cancel
      </button>
    </div>
  );
};

export default SelectionPage;