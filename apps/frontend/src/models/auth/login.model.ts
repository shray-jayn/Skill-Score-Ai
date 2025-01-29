import { User } from "../user/user.model";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponce {
    message: string;
    user: User;
    token: string;
}