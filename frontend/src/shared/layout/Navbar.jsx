import { useEffect, useState } from "react";
import { Menu, User, LogOut, Sun, Moon } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";

const Navbar = ({ onMobileMenuToggle }) => {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            aria-label="Open sidebar"
            className="flex size-9 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={darkMode}
            className="relative flex h-10 w-[68px] items-center rounded-full border border-border bg-card p-1 transition-all duration-300 hover:border-primary/30"
          >
            <span
              className={`absolute top-1 size-7 rounded-full bg-primary shadow-md shadow-primary/20 transition-transform duration-300 ease-in-out ${darkMode ? "translate-x-7" : "translate-x-0"}`}
            />
            <span
              className={`relative z-10 flex size-7 items-center justify-center transition-colors duration-300 ${darkMode ? "text-muted" : "text-white"}`}
            >
              <Sun className="size-4" />
            </span>

            {/* Moon */}
            <span
              className={`relative z-10 flex size-7 items-center justify-center transition-colors duration-300 ${darkMode ? "text-white" : "text-muted"}`}
            >
              <Moon className="size-4" />
            </span>
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

          <div className="relative">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-primary/10 [&::-webkit-details-marker]:hidden">
                {/* Avatar */}
                <div className="size-8 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/10">
                  <img
                    className="size-full object-cover"
                    src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                    alt="Profile"
                  />
                </div>

                {/* User Info */}
                <div className="hidden flex-col text-left lg:flex">
                  <span className="text-sm font-bold leading-tight text-dark capitalize">
                    {user.full_name}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {user.role}
                  </span>
                </div>

                {/* Dropdown Indicator */}
                <span className="hidden text-muted transition-transform duration-200 group-open:rotate-180 lg:block">
                  <svg
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <div className="absolute right-0 top-full z-50 mt-3 w-56 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-2xl">
                {/* Mobile User Info */}
                <div className="border-b border-border px-3 py-2.5 lg:hidden">
                  <p className="text-xs font-bold text-foreground">
                    {user.full_name}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-primary">
                    {user.role}
                  </p>
                </div>

                {/* Profile */}
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <User className="size-4 shrink-0 text-primary" />
                  <span>Profile Saya</span>
                </button>

                {/* Divider */}
                <div className="my-1 border-t border-border" />

                {/* Logout */}
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-600 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
