import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Client from "./pages/Client";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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
          />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
