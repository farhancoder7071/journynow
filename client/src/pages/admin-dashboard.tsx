import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  User, Content, TrainRoute, BusRoute, 
  CrowdReport, AdSetting 
} from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminSidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UsersTable } from "@/components/admin/users-table";
import { ContentGrid } from "@/components/admin/content-grid";
import { TrainRoutes } from "@/components/admin/train-routes";
import { BusRoutes } from "@/components/admin/bus-routes";
import { CrowdReports } from "@/components/admin/crowd-reports";
import { AdSettings } from "@/components/admin/ad-settings";
import { UsersManagement } from "@/components/admin/users-management";
import { ContentManagement } from "@/components/admin/content-management";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { SettingsManagement } from "@/components/admin/settings-management";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, UserPlus, FolderOpen, Laptop, Train, 
  Bus, Users2, BellRing, LineChart, Settings, 
  BarChart3, Briefcase
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [isAdminView, setIsAdminView] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Set active tab based on URL
  useEffect(() => {
    if (location.includes('/admin/users')) {
      setActiveTab('users');
    } else if (location.includes('/admin/content')) {
      setActiveTab('content');
    } else if (location.includes('/admin/analytics')) {
      setActiveTab('analytics');
    } else if (location.includes('/admin/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('overview');
    }
  }, [location]);
  
  // Toggle admin view when button is clicked
  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };
  
  // Redirect to user dashboard if not in admin view
  useEffect(() => {
    if (!isAdminView) {
      setLocation("/");
    }
  }, [isAdminView, setLocation]);
  
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
  
  // Fetch admin data - train routes
  const { 
    data: trainRoutes = [], 
    isLoading: trainRoutesLoading 
  } = useQuery<TrainRoute[]>({
    queryKey: ["/api/admin/train-routes"],
    enabled: !!user && user.role === "admin" && activeTab === "trains",
  });
  
  // Fetch admin data - bus routes
  const { 
    data: busRoutes = [], 
    isLoading: busRoutesLoading 
  } = useQuery<BusRoute[]>({
    queryKey: ["/api/admin/bus-routes"],
    enabled: !!user && user.role === "admin" && activeTab === "buses",
  });
  
  // Fetch admin data - crowd reports
  const { 
    data: crowdReports = [], 
    isLoading: crowdReportsLoading 
  } = useQuery<CrowdReport[]>({
    queryKey: ["/api/admin/crowd-reports"],
    enabled: !!user && user.role === "admin" && activeTab === "crowds",
  });
  
  // Fetch admin data - ad settings
  const { 
    data: adSettings = [], 
    isLoading: adSettingsLoading 
  } = useQuery<AdSetting[]>({
    queryKey: ["/api/admin/ad-settings"],
    enabled: !!user && user.role === "admin" && activeTab === "ads",
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#1E293B] text-white">
      <Header isAdminView={true} toggleAdminView={toggleAdminView} />
      
      <div className="flex flex-1">
        <AdminSidebar toggleUserView={toggleAdminView} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-white bg-[#334155] p-2 rounded-full">
                  <BellRing className="h-5 w-5" />
                </button>
                <span className="absolute top-0 right-0 bg-[#FF4081] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-[#0F172A] w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#1976D2]">
                <LineChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1976D2]">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-[#1976D2]">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-[#1976D2]">
                <FolderOpen className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="trains" className="data-[state=active]:bg-[#1976D2]">
                <Train className="h-4 w-4 mr-2" />
                Train Routes
              </TabsTrigger>
              <TabsTrigger value="buses" className="data-[state=active]:bg-[#1976D2]">
                <Bus className="h-4 w-4 mr-2" />
                Bus Routes
              </TabsTrigger>
              <TabsTrigger value="crowds" className="data-[state=active]:bg-[#1976D2]">
                <Users2 className="h-4 w-4 mr-2" />
                Crowd Reports
              </TabsTrigger>
              <TabsTrigger value="ads" className="data-[state=active]:bg-[#1976D2]">
                <Laptop className="h-4 w-4 mr-2" />
                Ad Settings
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#1976D2]">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#253349] rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Recent User Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 border-b border-gray-700 pb-4">
                        <div className="h-10 w-10 rounded-full bg-[#334155] flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#FF4081]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">User {users[i]?.username || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">
                            {i === 1 ? 'Submitted crowd report' : i === 2 ? 'Logged in' : 'Updated profile'}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-xs text-gray-400">{i * 10} minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#253349] rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Database Connection</span>
                      </div>
                      <span className="text-green-500 text-sm">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span>API Services</span>
                      </div>
                      <span className="text-green-500 text-sm">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Email Service</span>
                      </div>
                      <span className="text-yellow-500 text-sm">Partially Degraded</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Storage</span>
                      </div>
                      <span className="text-green-500 text-sm">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="bg-white text-gray-900 p-6 rounded-lg shadow">
                <AnalyticsDashboard />
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="bg-white text-gray-900 p-6 rounded-lg shadow">
                <UsersManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <div className="bg-white text-gray-900 p-6 rounded-lg shadow">
                <ContentManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white text-gray-900 p-6 rounded-lg shadow">
                <SettingsManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="trains">
              <TrainRoutes />
            </TabsContent>
            
            <TabsContent value="buses">
              <BusRoutes />
            </TabsContent>
            
            <TabsContent value="crowds">
              <CrowdReports />
            </TabsContent>
            
            <TabsContent value="ads">
              <AdSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Footer isAdminView={true} />
    </div>
  );
}
