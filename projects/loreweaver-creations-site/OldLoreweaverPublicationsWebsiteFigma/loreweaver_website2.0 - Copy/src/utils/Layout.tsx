import { Outlet } from "react-router";
import { NavigationBanner } from "../components/NavigationBanner";
import { FooterBanner } from "../components/FooterBanner";
import { ChatbotWidget } from "../components/ChatbotWidget";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBanner />
      <Outlet />
      <FooterBanner />
      <ChatbotWidget />
    </div>
  );
}
