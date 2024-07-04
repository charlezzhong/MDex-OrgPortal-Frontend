// components/AdmissionSettings.tsx
import React, { useState } from 'react';
import AddEditTicket from './TicketEdit';
//import { Ticket, AdmissionSettingsProps } from '../../../types/tickets.interface';
import { IoPencil, IoCopy, IoTrash } from 'react-icons/io5';
import styles from '../Animations/Button1.module.css'

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

interface AdmissionSettingsProps {
  onClose: () => void;
  onDone: () => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const AdmissionSettings: React.FC<AdmissionSettingsProps> = ({ onClose, onDone, tickets, setTickets }) => {
  const [showAddEditTicket, setShowAddEditTicket] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [ticketData, setTicketData] = useState<Partial<Ticket>>({});

  const handleEditTicket = (ticket: Ticket) => {
    setTicketData(ticket);
    setIsEdit(true);
    setShowAddEditTicket(true);
  };

  const handleCreateNewTicket = () => {
    setTicketData({});
    setIsEdit(false);
    setShowAddEditTicket(true);
  };

  const handleDuplicateTicket = (ticket: Ticket) => {
    const duplicateTicket = { ...ticket, _id: '12', name: `Duplicate of ${ticket.name}` };
    setTicketData(duplicateTicket);
    setIsEdit(false);
    setShowAddEditTicket(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket._id !== ticketId));
  };

  const handleSaveTicket = (newTicket: Ticket) => {
    if (isEdit) {
      setTickets(tickets.map(ticket => ticket._id === newTicket._id ? newTicket : ticket));
    } else {
      setTickets([...tickets, newTicket]);
    }
    setShowAddEditTicket(false);
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
      <div style={{ backgroundColor: '#000000', padding: '1rem', borderRadius: '1.2rem', borderColor: '#635bff', borderWidth: '3px',width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'scroll' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{fontSize: '18px', fontWeight: 'bold'}}>Admission Settings</h2>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{fontSize: '16px'}}>Tickets</h2>
          <hr style={{ borderColor: 'gray', margin: '1rem 0' }} />
        </div>
        <div style={{ marginBottom: '2.5rem' }}>
          {tickets.map((ticket) => (
            <div key={ticket._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#333', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{ticket.name} &nbsp;&nbsp; </span>
                <span>&nbsp;</span>
                {/* <span>${ticket.price.toFixed(2)}</span> */}
                <span>${ticket.price}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.7rem' }}>
                {tickets.length > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'red', cursor: 'pointer' }}>
                    <IoTrash style={{ fontSize: '18px', color: '#ffffff' }} onClick={() => handleDeleteTicket(ticket._id)} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ffffff', cursor: 'pointer' }}>
                  <IoCopy style={{ fontSize: '18px', color: '#000000' }} onClick={() => handleDuplicateTicket(ticket)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ffffff', cursor: 'pointer' }}>
                  <IoPencil style={{ fontSize: '18px', color: '#000000' }} onClick={() => handleEditTicket(ticket)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{justifyContent: 'space-between', display: 'flex' }}>
        {/* <button style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'gray', color: 'white' }} onClick={onClose}>Cancel</button> */}
          <button style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: '#635bff', color: 'white', fontWeight: 'bold'}} onClick={handleCreateNewTicket}>Create New Ticket</button>
          <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'white', color: 'black', fontWeight: 'bold' }} onClick={onDone}>Done</button>
        </div>
      </div>
      {showAddEditTicket && <AddEditTicket onClose={() => setShowAddEditTicket(false)} isEdit={isEdit} ticketData={ticketData} onSave={handleSaveTicket} />}
    </div>
  );
};

export default AdmissionSettings;
