import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
}

export function UsersTable({ users, isLoading = false }: UsersTableProps) {
  // Function to get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'user':
        return <Badge className="bg-green-100 text-green-800">User</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  // Mock status for demonstration - in real app would come from API
  const getUserStatus = (userId: number) => {
    // Just alternating statuses for demo purposes
    return userId % 2 === 0 ? 
      { status: 'active', color: 'text-green-400', bg: 'bg-green-400' } : 
      { status: 'away', color: 'text-yellow-500', bg: 'bg-yellow-500' };
  };

  // Mock user joined date - in real app would come from API
  const getJoinedDate = (userId: number) => {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - (userId % 6)); // Random date within last 6 months
    return `Joined ${baseDate.toLocaleString('default', { month: 'short' })} ${baseDate.getFullYear()}`;
  };

  return (
    <Card className="bg-[#334155] shadow overflow-hidden rounded-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-medium text-white flex justify-between items-center">
          <span>Users</span>
          <Button variant="link" className="text-[#FF4081] hover:text-[#FF4081] text-sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center text-gray-300">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-300">No users found</div>
        ) : (
          <ScrollArea className="custom-scrollbar">
            <Table>
              <TableHeader className="bg-[#0F172A]">
                <TableRow>
                  <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">Name</TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">Username</TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">Role</TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">Status</TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-[#334155] divide-y divide-gray-700">
                {users.map(user => {
                  const status = getUserStatus(user.id);
                  return (
                    <TableRow key={user.id} className="hover:bg-[#0F172A]">
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                              alt={user.fullName || user.username} 
                            />
                            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.fullName || user.username}
                            </div>
                            <div className="text-sm text-gray-400">
                              {getJoinedDate(user.id)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.username}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className={`flex items-center text-sm ${status.color}`}>
                          <span className={`h-2 w-2 rounded-full ${status.bg} mr-2`}></span>
                          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 p-1">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
