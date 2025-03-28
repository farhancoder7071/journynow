import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TrainRoute } from "@shared/schema";
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
const trainRouteSchema = z.object({
  routeName: z.string().min(3, "Route name must be at least 3 characters"),
  routeNumber: z.string().min(2, "Route number is required"),
  sourceStation: z.string().min(2, "Source station is required"),
  destinationStation: z.string().min(2, "Destination station is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  frequency: z.string().min(1, "Frequency is required"),
  trainType: z.string().default("express"),
  fare: z.string().min(1, "Fare is required"),
  isActive: z.boolean().default(true),
  hasWifi: z.boolean().default(false),
  hasCatering: z.boolean().default(false),
});

type TrainRouteFormValues = z.infer<typeof trainRouteSchema>;

export function TrainRoutes() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<TrainRoute | null>(null);

  // Fetch all train routes
  const {
    data: trainRoutes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<TrainRoute[]>({
    queryKey: ["/api/admin/train-routes"],
  });

  // Add new train route mutation
  const addRouteMutation = useMutation({
    mutationFn: async (values: TrainRouteFormValues) => {
      const res = await apiRequest("POST", "/api/admin/train-routes", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/train-routes"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Train route created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create train route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Edit train route mutation
  const editRouteMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: Partial<TrainRouteFormValues> }) => {
      const res = await apiRequest("PUT", `/api/admin/train-routes/${id}`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/train-routes"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Train route updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update train route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete train route mutation
  const deleteRouteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/train-routes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/train-routes"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Train route deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete train route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Add form
  const addForm = useForm<TrainRouteFormValues>({
    resolver: zodResolver(trainRouteSchema),
    defaultValues: {
      routeName: "",
      routeNumber: "",
      sourceStation: "",
      destinationStation: "",
      departureTime: "",
      arrivalTime: "",
      frequency: "hourly",
      trainType: "express",
      fare: "",
      isActive: true,
      hasWifi: false,
      hasCatering: false,
    },
  });

  // Edit form
  const editForm = useForm<TrainRouteFormValues>({
    resolver: zodResolver(trainRouteSchema),
    defaultValues: {
      routeName: "",
      routeNumber: "",
      sourceStation: "",
      destinationStation: "",
      departureTime: "",
      arrivalTime: "",
      frequency: "",
      trainType: "",
      fare: "",
      isActive: true,
      hasWifi: false,
      hasCatering: false,
    },
  });

  // Handle add form submission
  const onAddSubmit = (values: TrainRouteFormValues) => {
    addRouteMutation.mutate(values);
  };

  // Handle edit form submission
  const onEditSubmit = (values: TrainRouteFormValues) => {
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
  const openEditDialog = (route: TrainRoute) => {
    setSelectedRoute(route);
    editForm.reset({
      routeName: route.routeName,
      routeNumber: route.routeNumber,
      sourceStation: route.sourceStation,
      destinationStation: route.destinationStation,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      frequency: route.frequency,
      trainType: route.trainType,
      fare: route.fare,
      isActive: route.isActive,
      hasWifi: route.hasWifi,
      hasCatering: route.hasCatering,
    });
    setIsEditDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (route: TrainRoute) => {
    setSelectedRoute(route);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1976D2]" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load train routes.</CardDescription>
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
            <CardTitle>Train Routes Management</CardTitle>
            <CardDescription className="text-gray-300">
              Manage train routes, schedules, and fares
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              addForm.reset();
              setIsAddDialogOpen(true);
            }}
            className="bg-[#1976D2] hover:bg-blue-700"
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
                <TableHead className="text-white">Amenities</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-10">
                    No train routes found. Create a new route to get started.
                  </TableCell>
                </TableRow>
              ) : (
                trainRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.routeName}</TableCell>
                    <TableCell>{route.routeNumber}</TableCell>
                    <TableCell>{route.sourceStation}</TableCell>
                    <TableCell>{route.destinationStation}</TableCell>
                    <TableCell>{route.departureTime}</TableCell>
                    <TableCell>{route.arrivalTime}</TableCell>
                    <TableCell>{route.frequency}</TableCell>
                    <TableCell>{route.fare}</TableCell>
                    <TableCell className="capitalize">{route.trainType}</TableCell>
                    <TableCell>
                      {route.hasWifi && <Badge className="mr-1 bg-blue-600">WiFi</Badge>}
                      {route.hasCatering && <Badge className="bg-amber-600">Catering</Badge>}
                    </TableCell>
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

      {/* Add Train Route Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Train Route</DialogTitle>
            <DialogDescription>
              Create a new train route with schedule information.
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
                        <Input placeholder="Rajdhani Express" {...field} />
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
                        <Input placeholder="12301" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="sourceStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Station</FormLabel>
                      <FormControl>
                        <Input placeholder="New Delhi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="destinationStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Station</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
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
                        <Input placeholder="16:30" {...field} />
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
                        <Input placeholder="08:30" {...field} />
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
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="trainType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Train Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="express">Express</SelectItem>
                            <SelectItem value="superfast">Superfast</SelectItem>
                            <SelectItem value="passenger">Passenger</SelectItem>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="metro">Metro</SelectItem>
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
                        <Input placeholder="₹1245" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2 grid grid-cols-3 gap-4">
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
                  <FormField
                    control={addForm.control}
                    name="hasWifi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>WiFi Available</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="hasCatering"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Catering Services</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
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
                  className="bg-[#1976D2] hover:bg-blue-700"
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

      {/* Edit Train Route Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Train Route</DialogTitle>
            <DialogDescription>
              Update the train route information.
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
                  name="sourceStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Station</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="destinationStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Station</FormLabel>
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
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="trainType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Train Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="express">Express</SelectItem>
                            <SelectItem value="superfast">Superfast</SelectItem>
                            <SelectItem value="passenger">Passenger</SelectItem>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="metro">Metro</SelectItem>
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
                <div className="col-span-2 grid grid-cols-3 gap-4">
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
                  <FormField
                    control={editForm.control}
                    name="hasWifi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>WiFi Available</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="hasCatering"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Catering Services</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
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
                  className="bg-[#1976D2] hover:bg-blue-700"
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

      {/* Delete Train Route Dialog */}
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