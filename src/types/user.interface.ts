export interface IUser {
    _id:                 string;
    name:                string;
    email:               string;
    verified:            boolean;
    role:                string;
    verificationCode:    string;
    createdAt:           Date;
    updatedAt:           Date;
    __v:                 number;
    allow_notifications: boolean;
    notifications:       string[];
}
