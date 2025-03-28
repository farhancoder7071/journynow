import { Content } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, User, Settings } from "lucide-react";

interface ContentGridProps {
  contents: Content[];
  isLoading?: boolean;
}

export function ContentGrid({ contents, isLoading = false }: ContentGridProps) {
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'public':
        return <span className="bg-green-500 bg-opacity-20 text-green-500 text-xs rounded-full px-2 py-1">Public</span>;
      case 'internal':
        return <span className="bg-yellow-500 bg-opacity-20 text-yellow-500 text-xs rounded-full px-2 py-1">Internal</span>;
      case 'draft':
        return <span className="bg-gray-500 bg-opacity-20 text-gray-500 text-xs rounded-full px-2 py-1">Draft</span>;
      default:
        return <span className="bg-blue-500 bg-opacity-20 text-blue-500 text-xs rounded-full px-2 py-1">{status}</span>;
    }
  };
  
  // Function to format published date
  const formatPublishedDate = (isoString: string) => {
    const date = new Date(isoString);
    return `Published on ${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  };

  return (
    <Card className="bg-[#334155] shadow-sm">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-white">Latest Content</CardTitle>
          <Button variant="link" className="text-[#FF4081] hover:text-[#FF4081] flex items-center text-sm">
            Manage All
            <Settings className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="text-center text-gray-300 py-4">Loading content...</div>
        ) : contents.length === 0 ? (
          <div className="text-center text-gray-300 py-4">No content found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contents.map(content => (
              <div key={content.id} className="bg-[#0F172A] rounded-lg p-3 hover:bg-opacity-70 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{content.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{formatPublishedDate(content.publishedDate)}</p>
                  </div>
                  {getStatusBadge(content.status)}
                </div>
                <div className="mt-3 text-sm text-gray-300">
                  {content.summary}
                </div>
                <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {content.views} views
                  </span>
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {content.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
