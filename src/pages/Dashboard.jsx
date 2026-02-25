import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import SupportButton from "../components/common/SupportButton";
import RequestDocumentButton from "../components/common/RequestDocumentButton";

const Dashboard = () => {
  return (
    <div className="flex bg-dark-900 text-silver-200">
      <DashboardSidebar />

      <div className="flex-1 p-6 bg-dark-800 md:ml-0 mt-16 md:mt-0">
        <Outlet />
      </div>

      <RequestDocumentButton />
      <SupportButton />
    </div>
  );
};

export default Dashboard;