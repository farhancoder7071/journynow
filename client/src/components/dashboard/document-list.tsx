import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Document } from "@shared/schema";
import { Folder, Clock, File, FileText, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
}

export function DocumentList({ documents, isLoading = false }: DocumentListProps) {
  // Map for determining icon by type
  const getTypeIcon = (type: string) => {
    const mapping: Record<string, React.ReactNode> = {
      "PDF": <FileText className="text-sm mr-1" />,
      "DOC": <File className="text-sm mr-1" />,
      "XLS": <FileCode className="text-sm mr-1" />,
    };
    
    return mapping[type] || <File className="text-sm mr-1" />;
  };
  
  // Function to get type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'PDF':
        return <Badge className="bg-blue-100 text-blue-800">{type}</Badge>;
      case 'DOC':
        return <Badge className="bg-green-100 text-green-800">{type}</Badge>;
      case 'XLS':
        return <Badge className="bg-yellow-100 text-yellow-800">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  // Function to format lastUpdated timestamp
  const formatLastUpdated = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Updated today';
    if (diffDays < 7) return `Updated ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
    return `Updated ${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'month' : 'months'} ago`;
  };

  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Your Documents</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No documents found</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {documents.map((document) => (
              <li key={document.id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#1976D2] truncate">{document.title}</p>
                      <div className="ml-2 flex-shrink-0">
                        {getTypeBadge(document.type)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Folder className="text-sm mr-1" />
                          {document.category}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="text-sm mr-1" />
                        <p>{formatLastUpdated(document.lastUpdated)}</p>
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
