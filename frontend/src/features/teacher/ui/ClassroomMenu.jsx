import { BookOpen, FileText, GraduationCap } from "lucide-react";
import { NavLink } from "react-router";

const menuItems = [
  {
    label: "Pembelajaran",
    icon: BookOpen,
    to: "",
  },
  {
    label: "Siswa",
    icon: GraduationCap,
    to: "students",
  },
  {
    label: "Laporan",
    icon: FileText,
    to: "reports",
  },
];

const ClassroomMenu = () => {
  return (
    <nav className="sticky top-0">
      <ul className="flex items-center gap-6 overflow-x-auto">
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              end={item.to === ""}
              className={({ isActive }) => `
                flex items-center gap-1.5
                border-b-2
                px-1 py-3
                text-xs sm:text-sm font-medium
                whitespace-nowrap
                transition
                ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }
              `}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ClassroomMenu;
