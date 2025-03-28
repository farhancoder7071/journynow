import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdSetting } from "@shared/schema";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, Edit, Plus, RefreshCw } from "lucide-react";

// Form validation schema
const adSettingSchema = z.object({
  adType: z.string().min(1, "Ad type is required"),
  isActive: z.boolean().default(true),
  frequency: z.coerce.number().int().min(1, "Frequency must be at least 1"),
  position: z.string().min(1, "Position is required"),
});

type AdSettingFormValues = z.infer<typeof adSettingSchema>;

export function AdSettings() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<AdSetting | null>(null);

  // Fetch all ad settings
  const {
    data: adSettings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<AdSetting[]>({
    queryKey: ["/api/admin/ad-settings"],
  });

  // Add new ad setting mutation
  const addSettingMutation = useMutation({
    mutationFn: async (values: AdSettingFormValues) => {
      const res = await apiRequest("POST", "/api/admin/ad-settings", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-settings"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Ad setting created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create ad setting: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Edit ad setting mutation
  const editSettingMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: Partial<AdSettingFormValues> }) => {
      const res = await apiRequest("PUT", `/api/admin/ad-settings/${id}`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-settings"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Ad setting updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update ad setting: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Toggle ad status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/ad-settings/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-settings"] });
      toast({
        title: "Success",
        description: "Ad status toggled successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to toggle ad status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Add form
  const addForm = useForm<AdSettingFormValues>({
    resolver: zodResolver(adSettingSchema),
    defaultValues: {
      adType: "banner",
      isActive: true,
      frequency: 5,
      position: "bottom",
    },
  });

  // Edit form
  const editForm = useForm<AdSettingFormValues>({
    resolver: zodResolver(adSettingSchema),
    defaultValues: {
      adType: "",
      isActive: true,
      frequency: 5,
      position: "",
    },
  });

  // Handle add form submission
  const onAddSubmit = (values: AdSettingFormValues) => {
    addSettingMutation.mutate(values);
  };

  // Handle edit form submission
  const onEditSubmit = (values: AdSettingFormValues) => {
    if (selectedSetting) {
      editSettingMutation.mutate({ id: selectedSetting.id, values });
    }
  };

  // Function to open edit dialog with selected setting data
  const openEditDialog = (setting: AdSetting) => {
    setSelectedSetting(setting);
    editForm.reset({
      adType: setting.adType,
      isActive: setting.isActive,
      frequency: setting.frequency,
      position: setting.position,
    });
    setIsEditDialogOpen(true);
  };

  // Function to toggle ad status
  const toggleAdStatus = (setting: AdSetting) => {
    toggleStatusMutation.mutate({
      id: setting.id,
      isActive: !setting.isActive,
    });
  };

  // Function to format last updated date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9800]" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load ad settings.</CardDescription>
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
            <CardTitle>Ad Settings Management</CardTitle>
            <CardDescription className="text-gray-300">
              Configure and manage advertisement settings
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              addForm.reset();
              setIsAddDialogOpen(true);
            }}
            className="bg-[#FF9800] hover:bg-orange-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#1E293B]">
              <TableRow>
                <TableHead className="text-white">Ad Type</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Frequency</TableHead>
                <TableHead className="text-white">Position</TableHead>
                <TableHead className="text-white">Last Updated</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adSettings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No ad settings found. Create a new setting to get started.
                  </TableCell>
                </TableRow>
              ) : (
                adSettings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell className="capitalize font-medium">{setting.adType}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={setting.isActive}
                          onCheckedChange={() => toggleAdStatus(setting)}
                          disabled={toggleStatusMutation.isPending}
                          className="mr-2"
                        />
                        {setting.isActive ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-600">Inactive</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>Show every {setting.frequency} screens</TableCell>
                    <TableCell className="capitalize">{setting.position}</TableCell>
                    <TableCell>{formatDate(setting.lastUpdated)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(setting)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Ad Setting Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Ad Setting</DialogTitle>
            <DialogDescription>
              Create a new advertisement setting for your application.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
              <FormField
                control={addForm.control}
                name="adType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banner">Banner</SelectItem>
                          <SelectItem value="interstitial">Interstitial</SelectItem>
                          <SelectItem value="rewarded">Rewarded</SelectItem>
                          <SelectItem value="native">Native</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Frequency (Show every X screens)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this ad setting
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                  disabled={addSettingMutation.isPending}
                  className="bg-[#FF9800] hover:bg-orange-700"
                >
                  {addSettingMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Setting
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Ad Setting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Ad Setting</DialogTitle>
            <DialogDescription>
              Update the advertisement setting for your application.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="adType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banner">Banner</SelectItem>
                          <SelectItem value="interstitial">Interstitial</SelectItem>
                          <SelectItem value="rewarded">Rewarded</SelectItem>
                          <SelectItem value="native">Native</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Frequency (Show every X screens)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this ad setting
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                  disabled={editSettingMutation.isPending}
                  className="bg-[#FF9800] hover:bg-orange-700"
                >
                  {editSettingMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Setting
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}