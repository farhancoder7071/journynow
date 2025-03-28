import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusRoute, TrainRoute, CrowdReport } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Train,
  Bus,
  Users,
  Clock,
  ChevronRight,
  CircleDot,
  Search,
} from "lucide-react";

export function TransitRoutes() {
  const [selectedTrainRouteId, setSelectedTrainRouteId] = useState<number | null>(null);
  const [selectedBusRouteId, setSelectedBusRouteId] = useState<number | null>(null);
  const [showCrowdReportDialog, setShowCrowdReportDialog] = useState(false);
  const [selectedTransportType, setSelectedTransportType] = useState<"train" | "bus" | null>(null);
  const [trainSearchQuery, setTrainSearchQuery] = useState("");
  const [busSearchQuery, setBusSearchQuery] = useState("");
  
  // Fetch train routes
  const { 
    data: trainRoutes = [], 
    isLoading: trainRoutesLoading 
  } = useQuery<TrainRoute[]>({
    queryKey: ["/api/transit/train-routes"],
  });
  
  // Fetch bus routes
  const { 
    data: busRoutes = [], 
    isLoading: busRoutesLoading 
  } = useQuery<BusRoute[]>({
    queryKey: ["/api/transit/bus-routes"],
  });

  // Fetch crowd reports when a route is selected
  const { 
    data: crowdReports = [], 
    isLoading: crowdReportsLoading 
  } = useQuery<CrowdReport[]>({
    queryKey: [
      "/api/transit/crowd-reports", 
      selectedTransportType, 
      selectedTransportType === "train" ? selectedTrainRouteId : selectedBusRouteId
    ],
    enabled: !!(selectedTransportType && (selectedTrainRouteId || selectedBusRouteId)),
  });
  
  // Function to handle train row click
  const handleTrainRouteClick = (routeId: number) => {
    setSelectedTrainRouteId(routeId);
    setSelectedTransportType("train");
    setShowCrowdReportDialog(true);
  };
  
  // Function to handle bus row click
  const handleBusRouteClick = (routeId: number) => {
    setSelectedBusRouteId(routeId);
    setSelectedTransportType("bus");
    setShowCrowdReportDialog(true);
  };
  
  // Function to convert crowd level to badge
  const renderCrowdLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  // Format time (e.g., "17:30" to "5:30 PM")
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      let hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      hour = hour ? hour : 12; // Convert 0 to 12 for 12 AM
      return `${hour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };
  
  // Format date for crowd reports
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };
  
  // Get the selected route details
  const getSelectedRouteDetails = () => {
    if (selectedTransportType === "train" && selectedTrainRouteId) {
      const route = trainRoutes.find(r => r.id === selectedTrainRouteId);
      return route ? `${route.routeName} (${route.sourceStation} to ${route.destinationStation})` : "";
    } else if (selectedTransportType === "bus" && selectedBusRouteId) {
      const route = busRoutes.find(r => r.id === selectedBusRouteId);
      return route ? `${route.routeName} (${route.sourceStop} to ${route.destinationStop})` : "";
    }
    return "";
  };
  
  // Filter train routes based on search query
  const filteredTrainRoutes = trainRoutes.filter(route => {
    if (!trainSearchQuery) return true;
    const query = trainSearchQuery.toLowerCase();
    return (
      route.routeName.toLowerCase().includes(query) ||
      route.sourceStation.toLowerCase().includes(query) ||
      route.destinationStation.toLowerCase().includes(query) ||
      route.trainNumber.toLowerCase().includes(query) ||
      route.trainType.toLowerCase().includes(query)
    );
  });
  
  // Filter bus routes based on search query
  const filteredBusRoutes = busRoutes.filter(route => {
    if (!busSearchQuery) return true;
    const query = busSearchQuery.toLowerCase();
    return (
      route.routeName.toLowerCase().includes(query) ||
      route.sourceStop.toLowerCase().includes(query) ||
      route.destinationStop.toLowerCase().includes(query) ||
      route.routeNumber.toLowerCase().includes(query) ||
      route.busType.toLowerCase().includes(query)
    );
  });

  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Transit Routes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="train">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="train" className="flex items-center">
              <Train className="h-4 w-4 mr-2" />
              Train Routes
            </TabsTrigger>
            <TabsTrigger value="bus" className="flex items-center">
              <Bus className="h-4 w-4 mr-2" />
              Bus Routes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="train">
            {trainRoutesLoading ? (
              <div className="py-4 text-center text-gray-500">Loading train routes...</div>
            ) : trainRoutes.length === 0 ? (
              <div className="py-4 text-center text-gray-500">No train routes available</div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search train routes, stations, or train types..."
                    value={trainSearchQuery}
                    onChange={(e) => setTrainSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                {filteredTrainRoutes.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">No results found for "{trainSearchQuery}"</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Departure</TableHead>
                          <TableHead>Arrival</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTrainRoutes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell className="font-medium">{route.routeName}</TableCell>
                            <TableCell>{route.sourceStation}</TableCell>
                            <TableCell>{route.destinationStation}</TableCell>
                            <TableCell>{formatTime(route.departureTime)}</TableCell>
                            <TableCell>{formatTime(route.arrivalTime)}</TableCell>
                            <TableCell>
                              <Badge className={
                                route.status === "On Time" ? "bg-green-100 text-green-800" :
                                route.status === "Delayed" ? "bg-yellow-100 text-yellow-800" :
                                route.status === "Cancelled" ? "bg-red-100 text-red-800" :
                                "bg-blue-100 text-blue-800"
                              }>
                                {route.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTrainRouteClick(route.id)}
                                className="flex items-center text-blue-600"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Crowd
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bus">
            {busRoutesLoading ? (
              <div className="py-4 text-center text-gray-500">Loading bus routes...</div>
            ) : busRoutes.length === 0 ? (
              <div className="py-4 text-center text-gray-500">No bus routes available</div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search bus routes, stops, or bus types..."
                    value={busSearchQuery}
                    onChange={(e) => setBusSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                {filteredBusRoutes.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">No results found for "{busSearchQuery}"</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Departure</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBusRoutes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell className="font-medium">{route.routeName}</TableCell>
                            <TableCell>{route.sourceStop}</TableCell>
                            <TableCell>{route.destinationStop}</TableCell>
                            <TableCell>{formatTime(route.departureTime)}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">
                                {route.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBusRouteClick(route.id)}
                                className="flex items-center text-blue-600"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Crowd
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Crowd Reports Dialog */}
        <Dialog open={showCrowdReportDialog} onOpenChange={setShowCrowdReportDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crowd Reports</DialogTitle>
              <DialogDescription>
                {getSelectedRouteDetails()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {crowdReportsLoading ? (
                <div className="text-center text-gray-500 py-4">Loading crowd reports...</div>
              ) : crowdReports.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No crowd reports available for this route</div>
              ) : (
                <div className="space-y-4">
                  {crowdReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{report.stationName}</div>
                        {renderCrowdLevelBadge(report.crowdLevel)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(report.timestamp)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CircleDot className="h-4 w-4 mr-1" />
                        {selectedTransportType === "train" ? "Train" : "Bus"} station
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                onClick={() => setShowCrowdReportDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}