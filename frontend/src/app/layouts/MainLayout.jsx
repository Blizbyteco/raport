import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "@/shared/layout/Navbar";
import Sidebar from "@/shared/layout/Sidebar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[40] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onNavigation={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="p-6 sm:p-8 flex-1 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
