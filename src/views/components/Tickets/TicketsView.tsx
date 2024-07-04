// components/TicketsComponent.js
import React, { useState } from 'react';
import AddEditTicket from './TicketEdit';
import AdmissionSettings from './TicketSettings';
//import { Ticket, TicketsComponentProps } from '../../../types/tickets.interface';
import { IoPencilSharp, IoTicketOutline } from "react-icons/io5";

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

interface TicketsComponentProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const TicketsComponent: React.FC<TicketsComponentProps> = ({ tickets, setTickets }) => {
  const [showAdmissionSettings, setShowAdmissionSettings] = useState(false);
  const [showAddEditTicket, setShowAddEditTicket] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [ticketData, setTicketData] = useState({});

  const handleEditTickets = () => {
    setShowAdmissionSettings(true);
  };

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

  const handleSaveTicket = (newTicket: Ticket) => {
    if (isEdit) {
      setTickets(tickets.map(ticket => ticket._id === newTicket._id ? newTicket : ticket));
    } else {
      setTickets([...tickets, newTicket]);
    }
    setShowAddEditTicket(false);
  };
  //TODO: Create ticket schema and controller (copy what the dev team did with rsvp in controller and models in server) and then add a controller for payment from stripe (research required)
  //TODO: Ticket schema should store an array/ list of all the ticket types for an event along with the information
  //TODO: 
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Tickets</h2>
        <button
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '2.5rem',
            backgroundColor: 'transparent',
            borderColor: '#000000',
            borderWidth: '1px',
            color: 'black',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={handleEditTickets}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Edit Tickets
            <IoTicketOutline style={{ marginLeft: '0.5rem'}} />
          </div>
        </button>
      </div>
      <hr style={{ borderColor: 'gray', margin: '1rem 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tickets.map((ticket) => (
          <div key={ticket._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#635bff', borderRadius: '0.5rem', alignItems: 'center', color: 'white' }}>
            <div>
              <span style={{ display: 'block' }}>{ticket.name}</span>
              <span>${ticket.price}</span>
            </div>
            <button
              style={{ padding: '0.5rem', borderRadius: '100px', backgroundColor: 'white', borderColor: 'white', borderWidth: '1px', color: 'black' }}
              onClick={() => handleEditTicket(ticket)}
            >
              <IoPencilSharp />
            </button>
          </div>
        ))}
      </div>
      {showAdmissionSettings && (
        <AdmissionSettings
          onClose={() => setShowAdmissionSettings(false)}
          onDone={() => setShowAdmissionSettings(false)}
          tickets={tickets}
          setTickets={setTickets}
        />
      )}
      {showAddEditTicket && (
        <AddEditTicket
          onClose={() => setShowAddEditTicket(false)}
          isEdit={isEdit}
          ticketData={ticketData}
          onSave={handleSaveTicket}
        />
      )}
    </div>
  );
};

export default TicketsComponent;
