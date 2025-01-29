import { User } from "../user/user.model";

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    designation: string;
    image: string;
}

export interface SignInResponce {
    message: string;
    user: User;
    token: string;
}