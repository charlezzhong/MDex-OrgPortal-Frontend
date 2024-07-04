import { Organization } from "./org.interface";

export interface Staff {
    _id:          string;
    organization: Organization[];
    address:      string;
    name:         string;
    email:        string;
    role:         string;
    bio:          string;
    jobTitle:     string;
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
    office?:      Office;
}

export interface Office {
    _id:            string;
    officeBuilding: string;
    roomNumber :    string;
    hours: {
        sunday:{
            start:string,
            end:string
        },
        monday:{
            start:string,
            end:string
        },
        tuesday:{
            start:string,
            end:string
        },
        wednesday:{
            start:string,
            end:string
        },
        thursday:{
            start:string,
            end:string
        },
        friday:{
            start:string,
            end:string
        },
        saturday:{
            start:string,
            end:string
        },
    };
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
}
