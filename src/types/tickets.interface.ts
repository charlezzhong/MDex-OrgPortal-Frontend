
// TODO: Create ticket schema with data from interface below
// TODO: Create controllers adding/ deleting/ 
export interface Ticket {
    _id:                string;
    createdAt:          Date;
    post:               string;
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

export interface AdmissionSettingsProps {
    onClose: () => void;
    onDone: () => void;
    tickets: Ticket[];
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  }

export interface TicketsComponentProps {
    tickets: Ticket[];
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  }