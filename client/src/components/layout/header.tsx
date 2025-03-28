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
import { JourneyNowLogo } from "./logo";

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
                <JourneyNowLogo size={36} isAdminView={isAdminView} />
                {!isAdminView && (
                  <span className="ml-2 text-xl font-semibold">JourneyNow</span>
                )}
                {isAdminView && (
                  <span className="ml-2 text-xl font-semibold">JourneyNow Admin</span>
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
