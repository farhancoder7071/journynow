import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CrowdReport, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle, RefreshCw, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CrowdReports() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CrowdReport | null>(null);

  // Fetch all crowd reports
  const {
    data: reports = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<CrowdReport[]>({
    queryKey: ["/api/admin/crowd-reports"],
  });

  // Fetch all users for displaying names
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Approve report mutation
  const approveReportMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/admin/crowd-reports/${id}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crowd-reports"] });
      toast({
        title: "Success",
        description: "Report approved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to approve report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Function to get user name by ID
  const getUserName = (userId: number): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName || user.username : `User #${userId}`;
  };

  // Function to get crowd level badge
  const getCrowdLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return <Badge className="bg-green-600">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600">Medium</Badge>;
      case "high":
        return <Badge className="bg-red-600">High</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };

  // Function to get transport type badge
  const getTransportTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "train":
        return <Badge className="bg-[#1976D2]">Train</Badge>;
      case "bus":
        return <Badge className="bg-[#43A047]">Bus</Badge>;
      case "metro":
        return <Badge className="bg-[#9C27B0]">Metro</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to approve report
  const handleApprove = (report: CrowdReport) => {
    approveReportMutation.mutate(report.id);
  };

  // Filter and search reports
  const filteredReports = reports
    .filter(report => {
      if (filter === "all") return true;
      if (filter === "approved") return report.isApproved;
      if (filter === "pending") return !report.isApproved;
      if (filter === "train") return report.transportType.toLowerCase() === "train";
      if (filter === "bus") return report.transportType.toLowerCase() === "bus";
      if (filter === "metro") return report.transportType.toLowerCase() === "metro";
      return true;
    })
    .filter(report => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        report.stationName.toLowerCase().includes(searchLower) ||
        report.crowdLevel.toLowerCase().includes(searchLower) ||
        report.transportType.toLowerCase().includes(searchLower) ||
        getUserName(report.userId).toLowerCase().includes(searchLower)
      );
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF4081]" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load crowd reports.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-[#0F172A] text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Crowd Reports Management</CardTitle>
            <CardDescription className="text-gray-300">
              Review and approve crowd level reports submitted by users
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="metro">Metro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#1E293B]">
              <TableRow>
                <TableHead className="text-white">Reported By</TableHead>
                <TableHead className="text-white">Station Name</TableHead>
                <TableHead className="text-white">Crowd Level</TableHead>
                <TableHead className="text-white">Transport Type</TableHead>
                <TableHead className="text-white">Timestamp</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No crowd reports found. Users can submit reports from the app.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-[#FF4081] text-white">
                            {getUserName(report.userId)?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{getUserName(report.userId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.stationName}</TableCell>
                    <TableCell>{getCrowdLevelBadge(report.crowdLevel)}</TableCell>
                    <TableCell>{getTransportTypeBadge(report.transportType)}</TableCell>
                    <TableCell>{formatDate(report.timestamp)}</TableCell>
                    <TableCell>
                      {report.isApproved ? (
                        <Badge className="bg-green-600">Approved</Badge>
                      ) : (
                        <Badge className="bg-yellow-600">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!report.isApproved && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 hover:text-green-700 border-green-200 hover:border-green-300"
                          onClick={() => handleApprove(report)}
                          disabled={approveReportMutation.isPending}
                        >
                          {approveReportMutation.isPending &&
                            approveReportMutation.variables === report.id && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="ml-2">Approve</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}