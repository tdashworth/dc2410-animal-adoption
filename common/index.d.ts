export declare enum UserType {
    Internal = 0,
    External = 1
}
export interface IUser {
    id?: any;
    username: string;
    passwordHash: string;
    salt?: string;
    displayName: string;
    type?: UserType;
}
export interface IUserApi {
    login: (username: string, password: string) => Promise<{
        token: string;
        expiry: string;
        user: IUser;
    }>;
    profile: () => Promise<IUser>;
}
export declare enum AnimalType {
    Cat = 0,
    Dog = 1,
    Bird = 2,
    Pig = 3
}
export declare enum Gender {
    Male = 0,
    Female = 1
}
export interface IAnimal {
    id?: any;
    name: string;
    type: AnimalType;
    dob: Date;
    description: string;
    gender: Gender;
    picture?: string;
    adoptedBy?: string;
}
export interface IAnimalApi {
    create: (animal: IAnimal) => IAnimal;
    get: (id: IAnimal['id']) => IAnimal;
}
export declare enum AdoptionRequestStatus {
    Pending = 0,
    Approved = 1,
    Denied = 2
}
export interface IAdoptionRequest {
    id?: any;
    user: IUser['id'];
    animal: IAnimal['id'];
    status: AdoptionRequestStatus;
}
export interface IAdoptionRequestApi {
    create: (request: IAdoptionRequest) => Promise<IAdoptionRequest>;
    get: (id: IAdoptionRequest['id']) => Promise<IAdoptionRequest | null>;
    approve: (id: IAdoptionRequest['id']) => IAdoptionRequest | null;
    deny: (id: IAdoptionRequest['id']) => IAdoptionRequest | null;
    listAll: () => IAdoptionRequest[];
    listAllMine: () => IAdoptionRequest[];
    listAnimals: (id: IAnimal['id']) => IAdoptionRequest[] | [];
}
export interface AuthToken {
    id: any;
    username: string;
    expiry: number;
}