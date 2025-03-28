import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Content } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminSidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UsersTable } from "@/components/admin/users-table";
import { ContentGrid } from "@/components/admin/content-grid";
import { useAuth } from "@/hooks/use-auth";
import { Users, UserPlus, FolderOpen, Laptop } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAdminView, setIsAdminView] = useState(true);
  
  // Toggle admin view when button is clicked
  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };
  
  // Redirect to user dashboard if not in admin view
  useEffect(() => {
    if (!isAdminView) {
      window.location.href = "/";
    }
  }, [isAdminView]);
  
  // Fetch admin data - users
  const { 
    data: users = [], 
    isLoading: usersLoading 
  } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });
  
  // Fetch admin data - content
  const { 
    data: contents = [], 
    isLoading: contentsLoading 
  } = useQuery<Content[]>({
    queryKey: ["/api/admin/contents"],
    enabled: !!user && user.role === "admin",
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#1E293B] text-white">
      <Header isAdminView={true} toggleAdminView={toggleAdminView} />
      
      <div className="flex flex-1">
        <AdminSidebar toggleUserView={toggleAdminView} />
        
        <main className="flex-1 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-white bg-[#334155] p-2 rounded-full">
                  <span className="material-icons">notifications</span>
                </button>
                <span className="absolute top-0 right-0 bg-[#FF4081] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Users"
              value={users.length}
              icon={<Users className="text-[#FF4081]" />}
              iconBgColor="bg-[#FF4081] bg-opacity-20"
              iconColor="text-[#FF4081]"
              isAdmin={true}
              trend={{
                value: "12%",
                isPositive: true,
                label: "vs last month"
              }}
            />
            
            <StatsCard
              title="New Users"
              value={users.filter(u => u.id > users.length - 3).length || 0}
              icon={<UserPlus className="text-green-500" />}
              iconBgColor="bg-green-500 bg-opacity-20"
              iconColor="text-green-500"
              isAdmin={true}
              trend={{
                value: "18%",
                isPositive: true,
                label: "vs last month"
              }}
            />
            
            <StatsCard
              title="Content Items"
              value={contents.length}
              icon={<FolderOpen className="text-blue-500" />}
              iconBgColor="bg-blue-500 bg-opacity-20"
              iconColor="text-blue-500"
              isAdmin={true}
              trend={{
                value: "7%",
                isPositive: true,
                label: "vs last month"
              }}
            />
            
            <StatsCard
              title="Active Sessions"
              value={32}
              icon={<Laptop className="text-yellow-500" />}
              iconBgColor="bg-yellow-500 bg-opacity-20"
              iconColor="text-yellow-500"
              isAdmin={true}
              trend={{
                value: "3%",
                isPositive: false,
                label: "vs last month"
              }}
            />
          </div>
          
          {/* Recent Users Table */}
          <div className="mb-6">
            <UsersTable 
              users={users} 
              isLoading={usersLoading} 
            />
          </div>
          
          {/* Content Grid */}
          <ContentGrid 
            contents={contents} 
            isLoading={contentsLoading} 
          />
        </main>
      </div>
      
      <Footer isAdminView={true} />
    </div>
  );
}
