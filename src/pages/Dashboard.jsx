import React from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHome from "../components/dashboard/DashboardHome";
import SupportButton from "../components/common/SupportButton";

const Dashboard = () => {
  return (
    <div className="flex bg-dark-900 text-silver-200">
      <DashboardSidebar />

      <div className="flex-1 p-6 bg-dark-800 md:ml-0 mt-16 md:mt-0">
        <DashboardHome />
      </div>
      <SupportButton/>
    </div>
  );
};

export default Dashboard;
