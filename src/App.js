import { BrowserRouter, Routes, Route } from "react-router-dom";

import Client from "./pages/Client";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import DashboardHome from "./components/dashboard/DashboardHome";
import Users from "./pages/dashboard/Users";
import Receipts from "./pages/dashboard/Receipts";
import Group from "./pages/dashboard/group";

import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Client" element={<Client />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="group" element={<Group />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;