import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@shared/schema";
import {
  Clock,
  User,
  FileText,
  Shield,
  Activity as ActivityIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityListProps {
  activities: Activity[];
  isLoading?: boolean;
}

export function ActivityList({ activities, isLoading = false }: ActivityListProps) {
  // Map for determining icon by category
  const getCategoryIcon = (category: string) => {
    const mapping: Record<string, React.ReactNode> = {
      "Account settings": <User className="text-sm mr-1" />,
      "Annual Report": <FileText className="text-sm mr-1" />,
      "Security": <Shield className="text-sm mr-1" />,
      "Account": <User className="text-sm mr-1" />,
    };
    
    return mapping[category] || <ActivityIcon className="text-sm mr-1" />;
  };
  
  // Function to format timestamp
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs} ${diffHrs === 1 ? 'hour' : 'hours'} ago`;
    if (diffHrs < 48) return 'Yesterday';
    return `${Math.floor(diffHrs / 24)} days ago`;
  };
  
  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'Warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'Error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No recent activities</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#1976D2] truncate">{activity.action}</p>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {getCategoryIcon(activity.category)}
                          {activity.category}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="text-sm mr-1" />
                        <p>{formatTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
