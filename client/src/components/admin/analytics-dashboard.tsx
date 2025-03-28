import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  Calendar, 
  Download, 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Loader2,
  RefreshCw
} from "lucide-react";

// Sample data for analytics (in a real app, this would come from the API)
const generateSampleData = () => {
  // User registration data
  const userRegistrationData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      value: Math.floor(Math.random() * 20) + 5,
    };
  });

  // Traffic source data
  const trafficSourceData = [
    { name: 'Direct', value: 4000 },
    { name: 'Search', value: 3000 },
    { name: 'Social', value: 2000 },
    { name: 'Email', value: 1500 },
    { name: 'Referral', value: 1000 },
  ];

  // Transit usage data by type
  const transitUsageData = [
    { name: 'Train', users: 4000, reports: 2400 },
    { name: 'Bus', users: 3000, reports: 1398 },
    { name: 'Subway', users: 2000, reports: 9800 },
    { name: 'Ferry', users: 1500, reports: 3908 },
    { name: 'Tram', users: 1000, reports: 4800 },
  ];

  // User activity by hour
  const userActivityByHour = Array.from({ length: 24 }, (_, i) => {
    return {
      hour: i,
      users: Math.floor(Math.random() * 200) + 50,
    };
  });

  // Platform usage data
  const platformUsageData = [
    { name: 'Web', value: 45 },
    { name: 'Android', value: 30 },
    { name: 'iOS', value: 25 },
  ];

  return {
    userRegistrationData,
    trafficSourceData,
    transitUsageData,
    userActivityByHour,
    platformUsageData,
  };
};

// Custom colors for charts
const CHART_COLORS = [
  '#1976D2', // Primary blue
  '#FF4081', // Accent pink
  '#4CAF50', // Green
  '#FFA726', // Orange
  '#9C27B0', // Purple
  '#607D8B', // Blue grey
];

export function AnalyticsDashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const sampleData = generateSampleData();

  // Fetch analytics data - in a real app, this would be from an API
  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/analytics', timeRange],
    queryFn: async () => {
      // Replace with actual API call
      // const res = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      // if (!res.ok) throw new Error('Failed to fetch analytics data');
      // return res.json();
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleData);
        }, 500);
      });
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Analytics refreshed",
        description: "The dashboard has been updated with the latest data.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Total Users",
      value: "2,845",
      icon: <Users className="h-8 w-8 text-white" />,
      change: "+12%",
      period: "vs. last month",
      positive: true,
      color: "bg-[#1976D2]",
    },
    {
      title: "Active Sessions",
      value: "489",
      icon: <Activity className="h-8 w-8 text-white" />,
      change: "+18%",
      period: "vs. last month",
      positive: true,
      color: "bg-[#4CAF50]",
    },
    {
      title: "Crowd Reports",
      value: "1,249",
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      change: "+8%",
      period: "vs. last month",
      positive: true,
      color: "bg-[#FF4081]",
    },
    {
      title: "Avg. Session Time",
      value: "8m 42s",
      icon: <Clock className="h-8 w-8 text-white" />,
      change: "-2%",
      period: "vs. last month",
      positive: false,
      color: "bg-[#FFA726]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          
          <Button className="bg-[#1976D2] hover:bg-[#1565C0]">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start mb-6 bg-[#F7FAFC] p-1">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="transit" className="flex items-center">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Transit Usage
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Platforms
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="mt-4 text-gray-500">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>User Registrations</CardTitle>
                    <CardDescription>New user sign-ups over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analyticsData?.userRegistrationData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name="New Users"
                            stroke="#1976D2"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where users are coming from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.trafficSourceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {analyticsData?.trafficSourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}`, 'Visits']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>User Activity by Hour</CardTitle>
                  <CardDescription>Number of active users throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData?.userActivityByHour}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" label={{ value: 'Hour of Day (24h)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Active Users', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${value}`, 'Users']} />
                        <Legend />
                        <Bar dataKey="users" name="Active Users" fill="#1976D2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Transit Tab */}
            <TabsContent value="transit" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Transit Usage by Type</CardTitle>
                  <CardDescription>Users and reports by transit type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData?.transitUsageData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" name="Users" fill="#1976D2" />
                        <Bar dataKey="reports" name="Crowd Reports" fill="#FF4081" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Platform Tab */}
            <TabsContent value="platform" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Platform Usage</CardTitle>
                    <CardDescription>Distribution of users by platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.platformUsageData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {analyticsData?.platformUsageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Platform Comparison</CardTitle>
                    <CardDescription>Key metrics by platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Session Duration (minutes)</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">10.2</p>
                            <p className="text-sm text-gray-500">Web</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">7.5</p>
                            <p className="text-sm text-gray-500">Android</p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-orange-600">8.3</p>
                            <p className="text-sm text-gray-500">iOS</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Avg. Reports Per User</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">2.1</p>
                            <p className="text-sm text-gray-500">Web</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">3.8</p>
                            <p className="text-sm text-gray-500">Android</p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-orange-600">3.2</p>
                            <p className="text-sm text-gray-500">iOS</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}