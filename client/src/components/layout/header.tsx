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
    <header className={`relative z-10 shadow-sm ${isAdminView ? 'bg-[#1E1E3F] text-white' : 'bg-white text-[#212121]'}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
                <svg className={`h-8 w-8 ${isAdminView ? 'text-[#8B5CF6]' : 'text-[#6366F1]'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.92 12.62C20.67 12.14 17.75 7 12 7C6.25 7 3.33 12.14 3.08 12.62C3.03 12.71 3 12.81 3 12.91C3 13.01 3.03 13.11 3.08 13.2C3.33 13.68 6.25 19 12 19C17.75 19 20.67 13.68 20.92 13.2C20.97 13.11 21 13.01 21 12.91C21 12.81 20.97 12.71 20.92 12.62ZM12 17C9.03 17 6.15 14.23 5.14 12.91C6.15 11.59 9.03 8.83 12 8.83C14.97 8.83 17.85 11.59 18.86 12.91C17.85 14.23 14.97 17 12 17Z"></path>
                  <path d="M12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10ZM12 14.5C11.17 14.5 10.5 13.83 10.5 13C10.5 12.17 11.17 11.5 12 11.5C12.83 11.5 13.5 12.17 13.5 13C13.5 13.83 12.83 14.5 12 14.5Z"></path>
                </svg>
                {!isAdminView && (
                  <span className="ml-2 text-xl font-semibold">Journey</span>
                )}
                {isAdminView && (
                  <span className="ml-2 text-xl font-semibold">Journey Admin</span>
                )}
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {!isAdminView ? (
                <div className="flex space-x-8">
                  <div 
                    onClick={() => navigate("/")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/" ? 'border-b-2 border-[#6366F1] text-[#6366F1]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}
                  >
                    Dashboard
                  </div>
                  <div 
                    onClick={() => navigate("/features")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/features" ? 'border-b-2 border-[#6366F1] text-[#6366F1]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}
                  >
                    Features
                  </div>
                  <div 
                    onClick={() => navigate("/resources")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/resources" ? 'border-b-2 border-[#6366F1] text-[#6366F1]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}
                  >
                    Resources
                  </div>
                </div>
              ) : (
                <div className="flex space-x-8">
                  <div 
                    onClick={() => navigate("/admin")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/admin" ? 'border-b-2 border-[#8B5CF6] text-[#8B5CF6]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}
                  >
                    Overview
                  </div>
                  <div 
                    onClick={() => navigate("/admin/users")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/admin/users" ? 'border-b-2 border-[#8B5CF6] text-[#8B5CF6]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}
                  >
                    Users
                  </div>
                  <div 
                    onClick={() => navigate("/admin/content")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/admin/content" ? 'border-b-2 border-[#8B5CF6] text-[#8B5CF6]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}
                  >
                    Content
                  </div>
                  <div 
                    onClick={() => navigate("/admin/settings")} 
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${location === "/admin/settings" ? 'border-b-2 border-[#8B5CF6] text-[#8B5CF6]' : 'border-b-2 border-transparent hover:border-gray-300 text-gray-300 hover:text-white'}`}
                  >
                    Settings
                  </div>
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
                <DropdownMenuContent align="end" className={isAdminView ? "bg-[#1E1E3F] border-[#2D2B55] text-white" : ""}>
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
                  className={`ml-3 ${isAdminView ? 'bg-[#8B5CF6] hover:bg-opacity-90 text-white' : 'bg-[#6366F1] hover:bg-opacity-90 text-white'}`}
                >
                  {isAdminView ? 'View User Interface' : 'Switch to Admin'}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
              >
                Log in
              </Button>
              <Button 
                className="bg-[#6366F1] hover:bg-opacity-90"
                onClick={() => navigate("/auth?tab=register")}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
