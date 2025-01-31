export interface AuthResponse {
  message: string;
  token: string;
  user: {
    userId: string;
    name: string;
    email: string;
    designation: string;
    image: string;
  };
}
