import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, LogOut, User, Settings } from "lucide-react";

interface HeaderProps {
  isAdminView: boolean;
  toggleAdminView: () => void;
}

export function Header({ isAdminView, toggleAdminView }: HeaderProps) {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/auth");
  };

  return (
    <header className={`relative z-10 shadow-sm ${isAdminView ? 'bg-[#1E293B] text-white' : 'bg-white text-[#212121]'}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <svg className={`h-8 w-8 ${isAdminView ? 'text-[#FF4081]' : 'text-[#1976D2]'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                  </svg>
                  {!isAdminView && (
                    <span className="ml-2 text-xl font-semibold">AppName</span>
                  )}
                  {isAdminView && (
                    <span className="ml-2 text-xl font-semibold">Admin Panel</span>
                  )}
                </a>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {!isAdminView ? (
                <div className="flex space-x-8">
                  <Link href="/">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/" ? 'border-b-2 border-[#1976D2] text-[#1976D2]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/features">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/features" ? 'border-b-2 border-[#1976D2] text-[#1976D2]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}>
                      Features
                    </a>
                  </Link>
                  <Link href="/resources">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/resources" ? 'border-b-2 border-[#1976D2] text-[#1976D2]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}>
                      Resources
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="flex space-x-8">
                  <Link href="/admin">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/admin" ? 'border-b-2 border-[#FF4081] text-[#FF4081]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}>
                      Overview
                    </a>
                  </Link>
                  <Link href="/admin/users">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/admin/users" ? 'border-b-2 border-[#FF4081] text-[#FF4081]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}>
                      Users
                    </a>
                  </Link>
                  <Link href="/admin/content">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/admin/content" ? 'border-b-2 border-[#FF4081] text-[#FF4081]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}>
                      Content
                    </a>
                  </Link>
                  <Link href="/admin/settings">
                    <a className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location === "/admin/settings" ? 'border-b-2 border-[#FF4081] text-[#FF4081]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}>
                      Settings
                    </a>
                  </Link>
                </div>
              )}
            </nav>
          </div>
          
          {/* User Controls */}
          {user ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={user.fullName || user.username} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={isAdminView ? "bg-[#1E293B] border-[#334155] text-white" : ""}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Your Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {user.role === "admin" && (
                <Button 
                  onClick={toggleAdminView} 
                  variant={isAdminView ? "secondary" : "default"}
                  className={`ml-3 ${isAdminView ? 'bg-[#FF4081] hover:bg-opacity-90 text-white' : 'bg-[#424242] hover:bg-opacity-90 text-white'}`}
                >
                  {isAdminView ? 'View User Interface' : 'Switch to Admin'}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/auth">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button className="bg-[#1976D2] hover:bg-opacity-90">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
