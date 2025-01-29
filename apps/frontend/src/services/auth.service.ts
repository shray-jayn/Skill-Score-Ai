import { LoginRequest, LoginResponce } from "../models/auth/login.model";
import { SignInResponce, SignUpRequest } from "../models/auth/signup.model";
import apiClient from "./api.service";

export const authService = {
  async register(payload: SignUpRequest): Promise<SignInResponce> {
    try {
      const response = await apiClient.post("/register", payload);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Unable to register. Please try again.");
    }
  },

  async login(payload: LoginRequest): Promise<LoginResponce> {
    try {
      const response = await apiClient.post("/sign-in", payload);

      if (response.status !== 200) {
        throw new Error("Invalid credentials");
      }

      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response && error.response.status === 401) {
        throw new Error("Email or password is incorrect!");
      }
      throw new Error("Unable to login. Please try again later.");
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
