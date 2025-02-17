import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";
import { Spin } from "antd";

// Lazy Load Pages for Performance Optimization
const Home = lazy(() => import("../pages/Home.page"));
const Login = lazy(() => import("../pages/Login.page"));
const SignUp = lazy(() => import("../pages/SignUp.page"));
const NotFound = lazy(() => import("../pages/NotFound.page"));
const Report = lazy(() => import("../pages/Report.page"))
const Upload = lazy(() => import("../pages/Upload.page"))

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useRecoilValue(authState);
  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protected Layout for Private Routes
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RequireAuth>
    <>
      {children}
    </>
  </RequireAuth>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          {/* A card-like container for the spinner */}
          <div className="flex flex-col items-center p-6">
            <Spin size="large" tip="Loading..." />
            {/* <span className="mt-2 text-gray-600">Please wait while we load the page...</span> */}
          </div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Private Routes */}
          <Route path="/feedback" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/" element={<ProtectedLayout><Upload/></ProtectedLayout>} />
          <Route path="/report/:coaching_round_id" element={<ProtectedLayout><Report /></ProtectedLayout>} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;