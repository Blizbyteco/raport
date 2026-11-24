import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "@/shared/layout/Navbar";
import Sidebar from "@/shared/layout/Sidebar";

const isDetailPage = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments[0] === "teacher" &&
    segments[1] === "class" &&
    segments.length === 3
  );
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const hideSidebar = isDetailPage(pathname);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isMobileOpen && !hideSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-[40] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {!hideSidebar && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          isMobileOpen={isMobileOpen}
          onNavigation={() => setIsMobileOpen(false)}
        />
      )}

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
