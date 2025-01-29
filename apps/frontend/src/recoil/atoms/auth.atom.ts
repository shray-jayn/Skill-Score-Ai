// src/recoil/atoms/authAtom.ts
import { atom } from "recoil";
import { User } from "../../models/user/user.model"; 

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Utility function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode payload from JWT
    return payload.exp * 1000 < Date.now(); // Check if token is expired
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Treat invalid or malformed token as expired
  }
};

// Function to initialize auth state from localStorage
const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    if (isTokenExpired(token)) {
      // If token is expired, clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }

    // If token is valid, return the authenticated state
    return {
      isAuthenticated: true,
      user: JSON.parse(user),
      token,
    };
  }

  // Default unauthenticated state
  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
};

// Recoil atom for auth state
export const authState = atom<AuthState>({
  key: "authState",
  default: getInitialAuthState(), // Initialize from localStorage
});
