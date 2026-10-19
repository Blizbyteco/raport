import React, { useState } from "react";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  BookOpen,
  UserPlus,
  FileSpreadsheet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Headphones,
  GraduationCap,
  SportShoe,
  Presentation,
  CalendarClock,
  Trophy,
  HomeIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuth from "@/features/auth/hooks/useAuth";

const contactSupp =
  "https://wa.me/6281333745705?text=Halo+tim+support.+Saya+ingin+melaporkan+kendala+terkait:...";

const menuList = [
  {
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        roles: ["admin"],
      },
    ],
  },
  {
    sectionTitle: "Master Data",
    items: [
      {
        label: "Data Siswa",
        icon: GraduationCap,
        path: "/dashboard/students",
        roles: ["admin"],
      },
      {
        label: "Data Guru",
        icon: UserCheck,
        path: "/dashboard/teachers",
        roles: ["admin"],
      },
      {
        label: "Data Kelas",
        icon: Users,
        path: "/dashboard/classes",
        roles: ["admin"],
      },
      {
        label: "Mata Pelajaran",
        icon: BookOpen,
        path: "/dashboard/subjects",
        roles: ["admin"],
      },
      {
        label: "Ekstrakurikuler",
        icon: SportShoe,
        path: "/dashboard/extracurriculars",
        roles: ["admin"],
      },
    ],
  },
  {
    sectionTitle: "Kelola",
    items: [
      {
        label: "Tahun Akademik",
        icon: CalendarClock,
        path: "/dashboard/academic-year",
        roles: ["admin"],
      },
      {
        label: "Penempatan Siswa",
        icon: UserPlus,
        path: "/dashboard/student-placement",
        roles: ["admin"],
      },
      {
        label: "Penempatan Guru",
        icon: Presentation,
        path: "/dashboard/teacher-placement",
        roles: ["admin"],
      },
    ],
  },
  {
    items: [
      {
        label: "Beranda",
        icon: HomeIcon,
        path: "/teacher",
        roles: ["teacher"],
      },
      {
        label: "Ekstrakurikuler",
        icon: Trophy,
        path: "/teacher/extracurricular",
        roles: ["teacher"],
      },
    ],
  },
];

const Sidebar = ({ collapsed, onToggle, isMobileOpen, onNavigation }) => {
  const { pathname: currentLocation } = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const isCollapsed = isMobileOpen ? false : collapsed;
  const { user, logout } = useAuth();

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-64 shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-6 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <GraduationCap className="size-5" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="truncate text-sm font-bold leading-tight text-dark">
                    An Nidhomiyah
                  </h1>
                  <p className="mt-0.5 text-xs text-muted">School Management</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden items-center justify-center rounded-lg p-1.5 text-muted transition-colors hover:bg-primary/10 hover:text-primary sm:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="size-5" />
              ) : (
                <ChevronLeft className="size-5" />
              )}
            </button>
          </div>

          <nav className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto px-3">
            {menuList.map((section) => {
              const filteredItems = section.items.filter((item) =>
                item.roles.includes(user.role),
              );

              if (!filteredItems.length) return null;

              return (
                <div key={section.sectionTitle} className="space-y-1">
                  {!isCollapsed && (
                    <h2 className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                      {section.sectionTitle}
                    </h2>
                  )}

                  <ul className="space-y-1">
                    {filteredItems.map((menu) => {
                      const Icon = menu.icon;
                      const hasChildren = menu.children?.length > 0;
                      const isOpen = openMenus[menu.label];
                      const isParentActive =
                        menu.path === "/dashboard"
                          ? currentLocation === menu.path
                          : currentLocation === menu.path ||
                            currentLocation.startsWith(`${menu.path}/`);
                      const isChildActive =
                        hasChildren &&
                        menu.children.some(
                          (child) => child.path === currentLocation,
                        );

                      const isActive = isParentActive || isChildActive;

                      return (
                        <React.Fragment key={menu.label}>
                          <li>
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!isCollapsed) {
                                    toggleSubMenu(menu.label);
                                  }
                                }}
                                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                  isCollapsed ? "justify-center" : ""
                                } ${
                                  isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon
                                    className={`size-5 shrink-0 ${
                                      isActive ? "text-white" : "text-muted"
                                    }`}
                                  />
                                  {!isCollapsed && <span>{menu.label}</span>}
                                </div>

                                {!isCollapsed && (
                                  <ChevronDown
                                    className={`size-4 transition-transform duration-200 ${
                                      isOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                )}
                              </button>
                            ) : (
                              <Link
                                to={menu.path}
                                onClick={onNavigation}
                                className={`group flex items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                                  isCollapsed ? "justify-center" : "gap-3"
                                } ${
                                  isActive
                                    ? "bg-primary font-bold text-white shadow-lg shadow-primary/20"
                                    : "text-muted hover:bg-primary/10 hover:text-primary"
                                }`}
                              >
                                <Icon
                                  className={`size-5 shrink-0 ${
                                    isActive ? "text-white" : "text-muted"
                                  }`}
                                />
                                {!isCollapsed && <span>{menu.label}</span>}
                              </Link>
                            )}
                          </li>

                          {!isCollapsed && hasChildren && isOpen && (
                            <li>
                              <ul className="ml-5 space-y-1 border-l-2 border-primary/20 pl-3">
                                {menu.children.map((child) => {
                                  const isSubActive =
                                    currentLocation === child.path;

                                  return (
                                    <li key={child.path}>
                                      <Link
                                        to={child.path}
                                        onClick={onNavigation}
                                        className={`block rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                          isSubActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
                                        }`}
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 border-t border-border px-3 pb-4 pt-4">
          <button
            onClick={logout}
            type="button"
            className={`flex w-full items-center rounded-xl px-3 py-2.5 text-danger transition-colors hover:bg-error/10 ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <LogOut className="size-5 shrink-0 text-danger" />
            {!isCollapsed && <span className="text-xs font-bold">Keluar</span>}
          </button>

          <a
            href={contactSupp}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center rounded-xl px-3 py-2.5 text-dark transition-colors hover:bg-primary/10 hover:text-primary ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <Headphones className="size-5 shrink-0 text-muted" />
            {!isCollapsed && (
              <span className="text-xs font-semibold">Bantuan Support</span>
            )}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
