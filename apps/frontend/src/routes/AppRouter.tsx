import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

import Home from "../pages/Home.page";
import Login from "../pages/Login.page";
import SignUp from "../pages/SignUp.page";
import NotFound from "../pages/NotFound.page";
import Favourite from "../pages/Favourite.page";
import Report from "../pages/Report.page";

// Component to protect private routes
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useRecoilValue(authState);

  // Redirect to login if not authenticated
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
         <Route
          path="/favourites"
          element={
            <RequireAuth>
              <Favourite />
            </RequireAuth>
          }
        />
          <Route
            path="/report/:coaching_round_id"
            element={
                <RequireAuth>
                    <Report />
                </RequireAuth>
            }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
