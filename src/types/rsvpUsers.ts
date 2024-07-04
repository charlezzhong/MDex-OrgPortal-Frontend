import { IUser } from "./user.interface";

export interface RsvpUsers {
    _id:       string;
    userId:    IUser;
    rsvpId:    string;
    answers:   Answers;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}

export interface Answers {
    optional1: string;
    optional2: string;
    optional3: string;
}