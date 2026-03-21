"use client";
import { useState } from "react";
import { PageType } from "./types";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import OnboardingPage from "./components/OnboardingPage";
import PoliciesPage from "./components/PoliciesPage";
import ClaimsPage from "./components/ClaimsPage";
import AlertsPage from "./components/AlertsPage";
import TriggerCenterPage from "./components/TriggerCenterPage";
import AnalyticsPage from "./components/AnalyticsPage";
import AdminPage from "./components/AdminPage";
import ProfilePage from "./components/ProfilePage";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "onboarding":
        return <OnboardingPage onNavigate={handleNavigate} />;
      case "dashboard":
        return <DashboardPage />;
      case "policies":
        return <PoliciesPage />;
      case "claims":
        return <ClaimsPage />;
      case "alerts":
        return <AlertsPage />;
      case "triggers":
        return <TriggerCenterPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "admin":
        return <AdminPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-[var(--color-surface)]">
        {currentPage !== "landing" && currentPage !== "register" && (
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        )}
        {renderPage()}
      </div>
    </AppProvider>
  );
}
