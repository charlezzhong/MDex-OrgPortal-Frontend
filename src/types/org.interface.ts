import { Office } from "./staff.interface";

export interface Organization {
    _id:            string;
    orgEmail:       string;
    email:          string;
    orgLogo:        string;
    orgName:        string;
    orgOffice:      string;
    orgAddress:     string;
    orgWebsite:     string;
    orgInsta:       string;
    orgBio:         string;
    office:         Office;
    totalPosts:     number;
    totalFollowers: number;
    goal:           number;
    status:         string;
    media:          string[]
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
}
