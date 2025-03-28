import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BusRoute } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash, Plus, RefreshCw } from "lucide-react";

// Form validation schema
const busRouteSchema = z.object({
  routeName: z.string().min(3, "Route name must be at least 3 characters"),
  routeNumber: z.string().min(2, "Route number is required"),
  sourceStop: z.string().min(2, "Source stop is required"),
  destinationStop: z.string().min(2, "Destination stop is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  frequency: z.string().min(1, "Frequency is required"),
  busType: z.string().default("regular"),
  fare: z.string().min(1, "Fare is required"),
  isActive: z.boolean().default(true),
});

type BusRouteFormValues = z.infer<typeof busRouteSchema>;

export function BusRoutes() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);

  // Fetch all bus routes
  const {
    data: busRoutes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<BusRoute[]>({
    queryKey: ["/api/admin/bus-routes"],
  });

  // Add new bus route mutation
  const addRouteMutation = useMutation({
    mutationFn: async (values: BusRouteFormValues) => {
      const res = await apiRequest("POST", "/api/admin/bus-routes", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bus-routes"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Bus route created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create bus route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Edit bus route mutation
  const editRouteMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: Partial<BusRouteFormValues> }) => {
      const res = await apiRequest("PUT", `/api/admin/bus-routes/${id}`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bus-routes"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Bus route updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update bus route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete bus route mutation
  const deleteRouteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/bus-routes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bus-routes"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Bus route deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete bus route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Add form
  const addForm = useForm<BusRouteFormValues>({
    resolver: zodResolver(busRouteSchema),
    defaultValues: {
      routeName: "",
      routeNumber: "",
      sourceStop: "",
      destinationStop: "",
      departureTime: "",
      arrivalTime: "",
      frequency: "every 15 min",
      busType: "regular",
      fare: "",
      isActive: true,
    },
  });

  // Edit form
  const editForm = useForm<BusRouteFormValues>({
    resolver: zodResolver(busRouteSchema),
    defaultValues: {
      routeName: "",
      routeNumber: "",
      sourceStop: "",
      destinationStop: "",
      departureTime: "",
      arrivalTime: "",
      frequency: "",
      busType: "",
      fare: "",
      isActive: true,
    },
  });

  // Handle add form submission
  const onAddSubmit = (values: BusRouteFormValues) => {
    addRouteMutation.mutate(values);
  };

  // Handle edit form submission
  const onEditSubmit = (values: BusRouteFormValues) => {
    if (selectedRoute) {
      editRouteMutation.mutate({ id: selectedRoute.id, values });
    }
  };

  // Handle delete confirmation
  const onDeleteConfirm = () => {
    if (selectedRoute) {
      deleteRouteMutation.mutate(selectedRoute.id);
    }
  };

  // Function to open edit dialog with selected route data
  const openEditDialog = (route: BusRoute) => {
    setSelectedRoute(route);
    editForm.reset({
      routeName: route.routeName,
      routeNumber: route.routeNumber,
      sourceStop: route.sourceStop,
      destinationStop: route.destinationStop,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      frequency: route.frequency,
      busType: route.busType,
      fare: route.fare,
      isActive: route.isActive,
    });
    setIsEditDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (route: BusRoute) => {
    setSelectedRoute(route);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#43A047]" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load bus routes.</CardDescription>
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
            <CardTitle>Bus Routes Management</CardTitle>
            <CardDescription className="text-gray-300">
              Manage bus routes, schedules, and fares
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              addForm.reset();
              setIsAddDialogOpen(true);
            }}
            className="bg-[#43A047] hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#1E293B]">
              <TableRow>
                <TableHead className="text-white">Route Name</TableHead>
                <TableHead className="text-white">Route Number</TableHead>
                <TableHead className="text-white">Source</TableHead>
                <TableHead className="text-white">Destination</TableHead>
                <TableHead className="text-white">Departure</TableHead>
                <TableHead className="text-white">Arrival</TableHead>
                <TableHead className="text-white">Frequency</TableHead>
                <TableHead className="text-white">Fare</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Active</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {busRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    No bus routes found. Create a new route to get started.
                  </TableCell>
                </TableRow>
              ) : (
                busRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.routeName}</TableCell>
                    <TableCell>{route.routeNumber}</TableCell>
                    <TableCell>{route.sourceStop}</TableCell>
                    <TableCell>{route.destinationStop}</TableCell>
                    <TableCell>{route.departureTime}</TableCell>
                    <TableCell>{route.arrivalTime}</TableCell>
                    <TableCell>{route.frequency}</TableCell>
                    <TableCell>{route.fare}</TableCell>
                    <TableCell className="capitalize">{route.busType}</TableCell>
                    <TableCell>
                      {route.isActive ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-600">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                          onClick={() => openDeleteDialog(route)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Bus Route Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Bus Route</DialogTitle>
            <DialogDescription>
              Create a new bus route with schedule information.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="routeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai Express" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="routeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Number</FormLabel>
                      <FormControl>
                        <Input placeholder="BUS-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="sourceStop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Stop</FormLabel>
                      <FormControl>
                        <Input placeholder="Dadar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="destinationStop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Stop</FormLabel>
                      <FormControl>
                        <Input placeholder="Sion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Time</FormLabel>
                      <FormControl>
                        <Input placeholder="07:30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="arrivalTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Time</FormLabel>
                      <FormControl>
                        <Input placeholder="08:45" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="every 10 min">Every 10 min</SelectItem>
                            <SelectItem value="every 15 min">Every 15 min</SelectItem>
                            <SelectItem value="every 30 min">Every 30 min</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="busType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="express">Express</SelectItem>
                            <SelectItem value="ac">AC</SelectItem>
                            <SelectItem value="minibus">Mini Bus</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="fare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fare</FormLabel>
                      <FormControl>
                        <Input placeholder="₹35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addRouteMutation.isPending}
                  className="bg-[#43A047] hover:bg-green-700"
                >
                  {addRouteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Route
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Bus Route Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bus Route</DialogTitle>
            <DialogDescription>
              Update the bus route information.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="routeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="routeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="sourceStop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Stop</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="destinationStop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Stop</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Time</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="arrivalTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Time</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="every 10 min">Every 10 min</SelectItem>
                            <SelectItem value="every 15 min">Every 15 min</SelectItem>
                            <SelectItem value="every 30 min">Every 30 min</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="busType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="express">Express</SelectItem>
                            <SelectItem value="ac">AC</SelectItem>
                            <SelectItem value="minibus">Mini Bus</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="fare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fare</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editRouteMutation.isPending}
                  className="bg-[#43A047] hover:bg-green-700"
                >
                  {editRouteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Route
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Bus Route Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the route '{selectedRoute?.routeName}'?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={deleteRouteMutation.isPending}
            >
              {deleteRouteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}