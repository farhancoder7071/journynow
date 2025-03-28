import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Document } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityList } from "@/components/dashboard/activity-list";
import { DocumentList } from "@/components/dashboard/document-list";
import { TransitRoutes } from "@/components/dashboard/transit-routes";
import { CrowdReportForm } from "@/components/dashboard/crowd-report-form";
import { BarChart3, FileText, Bell, Star, Train, Bus, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserDashboard() {
  const { user } = useAuth();
  // Admin toggle functionality removed for security
  // Empty function to satisfy header prop requirements
  const toggleAdminView = () => {};
  
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
              title="Train Routes"
              value={12}
              icon={<Train className="text-[#1976D2]" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              trend={{
                value: "+2",
                isPositive: true,
                label: "from last week"
              }}
            />
            
            <StatsCard
              title="Bus Routes"
              value={8}
              icon={<Bus className="text-yellow-600" />}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              trend={{
                value: "+1",
                isPositive: true,
                label: "from last week"
              }}
            />
          </div>
          
          {/* Transit System Section */}
          <div className="mt-8">
            <Tabs defaultValue="routes" className="w-full">
              <TabsList className="w-full justify-start mb-2 border-b">
                <TabsTrigger value="routes" className="flex items-center">
                  <Bus className="h-4 w-4 mr-2" />
                  Transit Routes
                </TabsTrigger>
                <TabsTrigger value="crowd" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Submit Crowd Report
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="routes">
                <TransitRoutes />
              </TabsContent>
              
              <TabsContent value="crowd">
                <CrowdReportForm />
              </TabsContent>
            </Tabs>
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
