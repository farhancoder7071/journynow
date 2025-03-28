import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  Eye
} from "lucide-react";

interface SidebarProps {
  toggleUserView: () => void;
}

export function AdminSidebar({ toggleUserView }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="mr-3 h-5 w-5" />,
    },
    {
      href: "/admin/content",
      label: "Content",
      icon: <FolderOpen className="mr-3 h-5 w-5" />,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart3 className="mr-3 h-5 w-5" />,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="mr-3 h-5 w-5" />,
    },
  ];

  return (
    <aside className="bg-[#0F172A] text-white w-64 min-h-screen flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-[#FF4081]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
          </svg>
          <span className="ml-2 text-xl font-semibold">Admin Panel</span>
        </div>
      </div>
      <nav className="mt-2 flex-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center px-6 py-3 text-gray-300 hover:bg-[#334155] hover:text-white transition-colors",
                location === item.href && "bg-[#334155] text-white"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      <div className="p-6">
        <Button 
          onClick={toggleUserView}
          className="w-full bg-[#FF4081] hover:bg-opacity-90 text-white flex items-center justify-center"
        >
          <Eye className="mr-2 h-5 w-5" />
          View User Interface
        </Button>
      </div>
    </aside>
  );
}
