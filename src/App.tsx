import { Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "sonner";

import Root from "./pages/Root";
import TasksPage from "./pages/TasksPage";
import TaskDetails from "./pages/TaskDetails";
import SessionsPage from "./pages/SessionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LandingPage from "./pages/LandingPage";

import SignupPage from "./app/signup/page";
import LoginPage from "./app/login/page";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const hasToken = localStorage.getItem("token");
  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


const App = () => {
  return (
    <>   
      <Toaster />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected, but NO navbar */}
        <Route
          path="/dashboard/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        />

        {/* Protected WITH navbar/root */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Root />
            </ProtectedRoute>
          }
        >
          
            <Route index element={<TasksPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          
        </Route>
      </Routes>
  </>
  );
};

export default App;