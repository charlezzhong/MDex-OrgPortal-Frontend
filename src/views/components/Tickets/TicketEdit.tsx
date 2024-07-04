// components/AddEditTicket.tsx
import React, { useState, useEffect } from 'react';

interface Ticket {
  _id:                string;
  name:               string;
  available:          string;
  price:              string;
  salePeriod?:        boolean;
  startDate?:         string;
  endDate?:           string;
  validFrom?:         boolean;
  startTime?:         string;
  endTime?:           string;
  description?:       string;
  limitQty?:          boolean;
  minQty?:            number;
  maxQty?:            number;
  hideTier?:          boolean;
  hidePrice?:         boolean;
  disableTicket?:     boolean;
  requireApproval?:   boolean;
  passwordProtected?: boolean;
  password?:          string;
}

export interface AddEditTicketProps {
  onClose: () => void;
  isEdit?: boolean;
  ticketData?: Partial<Ticket>;
  onSave: (ticket: Ticket) => void;
}

const AddEditTicket: React.FC<AddEditTicketProps> = ({ onClose, isEdit = false, ticketData = {}, onSave }) => {
  const [ticketName, setTicketName] = useState(ticketData.name || '');
  const [ticketAvailability, setTicketAvailability] = useState(ticketData.available || '');
  const [price, setPrice] = useState(ticketData.price || '');
  const [salePeriod, setSalePeriod] = useState(ticketData.salePeriod || false);
  const [startDate, setStartDate] = useState(ticketData.startDate || '');
  const [endDate, setEndDate] = useState(ticketData.endDate || '');
  const [validFrom, setValidFrom] = useState(ticketData.validFrom || false);
  const [startTime, setStartTime] = useState(ticketData.startTime || '');
  const [endTime, setEndTime] = useState(ticketData.endTime || '');
  const [description, setDescription] = useState(ticketData.description || '');
  const [limitQty, setLimitQty] = useState(ticketData.limitQty || false);
  const [minQty, setMinQty] = useState(ticketData.minQty || 1);
  const [maxQty, setMaxQty] = useState(ticketData.maxQty || 10);
  const [hideTier, setHideTier] = useState(ticketData.hideTier || false);
  const [hidePrice, setHidePrice] = useState(ticketData.hidePrice || false);
  const [disableTicket, setDisableTicket] = useState(ticketData.disableTicket || false);
  const [requireApproval, setRequireApproval] = useState(ticketData.requireApproval || false);
  const [passwordProtected, setPasswordProtected] = useState(ticketData.passwordProtected || false);
  const [password, setPassword] = useState(ticketData.password || '');

  const [showTicketOptions, setShowTicketOptions] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  const [priceError, setPriceError] = useState<string | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    const checkRequiredFields = () => {
      const isPriceValid = !priceError && price !== '';
      const isNameValid = ticketName.trim() !== '';
      setIsSaveDisabled(!(isPriceValid && isNameValid));
    };

    checkRequiredFields();
  }, [ticketName, price, priceError]);

  const handleSave = () => {

    if (isSaveDisabled) {
      return;
    }

    const newTicket: Ticket = {
      _id: ticketData._id || '',
      name: ticketName,
      available: ticketAvailability,
      price: price,
      salePeriod: salePeriod,
      startDate: startDate,
      endDate: endDate,
      validFrom: validFrom,
      startTime: startTime,
      endTime: endTime,
      description: description,
      limitQty: limitQty,
      minQty: minQty,
      maxQty: maxQty,
      hideTier: hideTier,
      hidePrice: hidePrice,
      disableTicket: disableTicket,
      requireApproval: requireApproval,
      passwordProtected: passwordProtected,
      password: password
    };
    onSave(newTicket);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPrice(value);
    
      // Check for commas
      if (value.includes(',')) {
        setPriceError("Invalid price. Remove any commas.");
        return;
      }
    
      // Check for invalid characters
      const isValidCharacters = /^-?\d*\.?\d*$/.test(value);
      if (!isValidCharacters) {
        setPriceError("Invalid characters in price.");
        return;
      }
    
      // Check for multiple decimal points
      const decimalCount = (value.match(/\./g) || []).length;
      if (decimalCount > 1) {
        setPriceError("Too many decimals.");
        return;
      }
    
      // Check for more than 2 decimal places
      const decimalPart = value.split('.')[1];
      if (decimalPart && decimalPart.length > 2) {
        setPriceError("Invalid format. Too many decimal places.");
        return;
      }
    
      // Check for negative values
      if (value.includes('-')) {
        setPriceError("No negative values.");
        return;
      }
    
      // Check if value is less than 0
      if (parseFloat(value) < 0) {
        setPriceError("Price must be greater than or equal to 0");
        return;
      }
    
      setPriceError(null);
    };
    
  

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      overflowY: 'scroll'
    }}>
      <div style={{ backgroundColor: 'black', padding: '1rem', borderRadius: '1.2rem', borderColor: '#635bff', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'scroll' }}>
        <h2>{isEdit ? 'Edit Ticket' : 'Add Ticket'}</h2>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
              <div style={{ flexBasis: '70%', flexGrow: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input
                  placeholder="Ticket Name*"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white', width: '100%' }}
                />
              </div>
              <div style={{ flexBasis: '30%', flexGrow: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Qty</label>
                <input
                  placeholder="Unlimited"
                  type="string"
                  value={ticketAvailability}
                  onChange={(e) => setTicketAvailability((e.target.value))}
                  style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white', width: '100%' }}
                />
              </div>
            </div>


            <div style={{ flexBasis: '90%', flexGrow: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price</label>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.7rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>$</div>
                <input
                  placeholder="0"
                  type="string"
                  value={price}
                  onChange={handlePriceChange}
                  style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white', width: '100%' }}
                />
              </div>
              {priceError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{priceError}</div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={salePeriod}
                onChange={(e) => setSalePeriod(e.target.checked)}
                style={{ marginRight: '0.1rem', marginTop: '0.3rem' }}
              />
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sale Period</label>
              {salePeriod && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={validFrom}
                onChange={(e) => setValidFrom(e.target.checked)}
                style={{ marginRight: '0.1rem', marginTop: '0.3rem' }}
              />
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Valid From</label>
              {validFrom && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <input
                    type="time"
                    placeholder="Start Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}
                  />
                  <input
                    type="time"
                    placeholder="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white', width: '100%', height: '5rem' }}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ cursor: 'pointer' }} onClick={() => setShowTicketOptions(!showTicketOptions)}>
            Ticket Options {showTicketOptions ? '▲' : '▼'}
          </h3>
          {showTicketOptions && (
            <div>
              <div>
                <label>
                  <input type="checkbox" checked={limitQty} onChange={(e) => setLimitQty(e.target.checked)} />
                  Limit Purchase Qty
                </label>
                {limitQty && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minQty}
                      onChange={(e) => setMinQty(Number(e.target.value))}
                      style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxQty}
                      onChange={(e) => setMaxQty(Number(e.target.value))}
                      style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={hideTier} onChange={(e) => setHideTier(e.target.checked)} />
                  Hide Tier
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={hidePrice} onChange={(e) => setHidePrice(e.target.checked)} />
                  Hide Price
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={disableTicket} onChange={(e) => setDisableTicket(e.target.checked)} />
                  Disable Ticket
                </label>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ cursor: 'pointer' }} onClick={() => setShowPrivacySettings(!showPrivacySettings)}>
            Ticket Privacy Settings {showPrivacySettings ? '▲' : '▼'}
          </h3>
          {showPrivacySettings && (
            <div>
              <div>
                <label>
                  <input type="checkbox" checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)} />
                  Require Approval
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={passwordProtected} onChange={(e) => setPasswordProtected(e.target.checked)} />
                  Password Protected
                </label>
                {passwordProtected && (
                  <input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: '#333', padding: '0.5rem', borderRadius: '0.5rem', color: 'white', width: '100%', marginTop: '0.5rem' }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }} onClick={onClose}>Cancel</button>
          <button onClick={handleSave} style={{
                backgroundColor: isSaveDisabled ? '#999' : '#635bff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                color: '#ffffff',
                fontWeight: 'bold',
                border: 'none',
                cursor: isSaveDisabled ? 'not-allowed' : 'pointer'
              }} disabled={isSaveDisabled}>
                {isEdit ? 'Save Changes' : 'Create Ticket'}
              </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTicket;
