import { Ticket } from "./tickets.interface";
export interface IPost {
    _id:                      string;
    orgRefId:                 string;
    eligible:                 boolean;
    organization:             string;
    title:                    string;
    link:                     string;
    description:              string;
    website:                  string;
    instagram:                string;
    eventDate:                string;
    eventTime:                string;
    eventEndTime:             Date;
    eventLocation:            string;
    eventLocationDescription: string;
    verified:                 boolean;
    category:                 string;
    campus:                   string;
    image:                    string;
    createdAt:                Date;
    updatedAt:                Date;
    rsvp:                     IRsvp;
    ticket:                   Ticket;
    numOfSaves:               number;
    __v:                      number;
}

export interface IRsvp {
    createdAt:  Date;
    optionals:  Optionals;
    post:       string;
    rsvpLimit:  number;
    rsvpStatus: string;
    totalCount: number;
    updatedAt:  Date;
    _id:        string
    waitlist:   boolean;
}

export interface Optionals {
    optional1: string;
    optional2: string;
    optional3: string;
}



