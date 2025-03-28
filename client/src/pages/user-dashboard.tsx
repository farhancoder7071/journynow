import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Document } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityList } from "@/components/dashboard/activity-list";
import { DocumentList } from "@/components/dashboard/document-list";
import { BarChart3, FileText, Bell, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function UserDashboard() {
  const { user } = useAuth();
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Toggle admin view when button is clicked
  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };
  
  // Redirect to admin dashboard if in admin view
  useEffect(() => {
    if (isAdminView) {
      window.location.href = "/admin";
    }
  }, [isAdminView]);
  
  // Fetch user activities
  const { 
    data: activities = [], 
    isLoading: activitiesLoading 
  } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    enabled: !!user,
  });
  
  // Fetch user documents
  const { 
    data: documents = [], 
    isLoading: documentsLoading 
  } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Header isAdminView={false} toggleAdminView={toggleAdminView} />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Activities"
              value={activities.length || 0}
              icon={<BarChart3 className="text-[#1976D2]" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            
            <StatsCard
              title="Documents"
              value={documents.length || 0}
              icon={<FileText className="text-green-600" />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            
            <StatsCard
              title="Notifications"
              value={3}
              icon={<Bell className="text-blue-600" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            
            <StatsCard
              title="Favorites"
              value={7}
              icon={<Star className="text-yellow-600" />}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <ActivityList 
              activities={activities} 
              isLoading={activitiesLoading} 
            />
          </div>
          
          {/* Documents Section */}
          <div className="mt-8">
            <DocumentList 
              documents={documents} 
              isLoading={documentsLoading} 
            />
          </div>
        </div>
      </main>
      
      <Footer isAdminView={false} />
    </div>
  );
}
