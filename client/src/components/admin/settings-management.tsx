import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  Save,
  Globe,
  Mail,
  BellRing,
  ShieldAlert,
  UploadCloud,
  Database,
  Smartphone,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

// Define settings form schemas
const generalSettingsSchema = z.object({
  siteName: z.string().min(3, { message: "Site name must be at least 3 characters" }),
  siteDescription: z.string().min(10, { message: "Site description must be at least 10 characters" }),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  faviconUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  primaryColor: z.string().min(4, { message: "Please enter a valid color" }),
  enableMaintenance: z.boolean().default(false),
  maintenanceMessage: z.string().optional(),
});

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(3, { message: "SMTP server is required" }),
  smtpPort: z.coerce.number().min(1, { message: "SMTP port is required" }),
  smtpUsername: z.string().min(3, { message: "SMTP username is required" }),
  smtpPassword: z.string(),
  fromEmail: z.string().email({ message: "Please enter a valid email" }),
  fromName: z.string().min(2, { message: "From name is required" }),
  enableEmailNotifications: z.boolean().default(true),
});

const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean().default(true),
  enablePushNotifications: z.boolean().default(true),
  enableInAppNotifications: z.boolean().default(true),
  newUserNotification: z.boolean().default(true),
  newReportNotification: z.boolean().default(true),
  systemAlertNotification: z.boolean().default(true),
  dailyDigest: z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
});

const securitySettingsSchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  passwordMinLength: z.coerce.number().min(6, { message: "Password must be at least 6 characters" }),
  passwordRequireUpper: z.boolean().default(true),
  passwordRequireNumber: z.boolean().default(true),
  passwordRequireSpecial: z.boolean().default(false),
  sessionTimeout: z.coerce.number().min(15, { message: "Session timeout must be at least 15 minutes" }),
  maxLoginAttempts: z.coerce.number().min(3, { message: "Max login attempts must be at least 3" }),
});

const storageSettingsSchema = z.object({
  maxUploadSize: z.coerce.number().min(1, { message: "Max upload size must be at least 1MB" }),
  allowedFileTypes: z.string().min(3, { message: "Please specify allowed file types" }),
  storageProvider: z.string().min(3, { message: "Storage provider is required" }),
  bucketName: z.string().optional(),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  region: z.string().optional(),
});

// Define typed form values
type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
type StorageSettingsValues = z.infer<typeof storageSettingsSchema>;

export function SettingsManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Setup form for general settings
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "Transit App",
      siteDescription: "Real-time transit information and crowd reporting platform",
      logoUrl: "https://example.com/logo.png",
      faviconUrl: "https://example.com/favicon.ico",
      primaryColor: "#1976D2",
      enableMaintenance: false,
      maintenanceMessage: "Our site is currently undergoing scheduled maintenance. Please check back soon.",
    },
  });

  // Setup form for email settings
  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.example.com",
      smtpPort: 587,
      smtpUsername: "notifications@example.com",
      smtpPassword: "",
      fromEmail: "no-reply@transitapp.com",
      fromName: "Transit App",
      enableEmailNotifications: true,
    },
  });

  // Setup form for notification settings
  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableInAppNotifications: true,
      newUserNotification: true,
      newReportNotification: true,
      systemAlertNotification: true,
      dailyDigest: false,
      weeklyDigest: true,
    },
  });

  // Setup form for security settings
  const securityForm = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      enableTwoFactor: false,
      passwordMinLength: 8,
      passwordRequireUpper: true,
      passwordRequireNumber: true,
      passwordRequireSpecial: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
    },
  });

  // Setup form for storage settings
  const storageForm = useForm<StorageSettingsValues>({
    resolver: zodResolver(storageSettingsSchema),
    defaultValues: {
      maxUploadSize: 10,
      allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx",
      storageProvider: "local",
      bucketName: "",
      apiKey: "",
      secretKey: "",
      region: "",
    },
  });

  // Load settings when component mounts
  const { data: generalSettings } = useQuery({
    queryKey: ['/api/admin/app-settings/general'],
    enabled: activeTab === "general"
  });
  
  const { data: emailSettings } = useQuery({
    queryKey: ['/api/admin/app-settings/email'],
    enabled: activeTab === "email"
  });
  
  const { data: notificationSettings } = useQuery({
    queryKey: ['/api/admin/app-settings/notifications'],
    enabled: activeTab === "notifications"
  });
  
  const { data: securitySettings } = useQuery({
    queryKey: ['/api/admin/app-settings/security'],
    enabled: activeTab === "security"
  });
  
  const { data: storageSettings } = useQuery({
    queryKey: ['/api/admin/app-settings/storage'],
    enabled: activeTab === "storage"
  });
  
  // Settings update mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ category, key, value }: { category: string; key: string; value: string }) => {
      const res = await apiRequest('POST', '/api/admin/app-settings', {
        category,
        key,
        value
      });
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/app-settings/${variables.category}`] });
      toast({
        title: "Setting saved",
        description: `${variables.category.charAt(0).toUpperCase() + variables.category.slice(1)} settings have been updated successfully.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save settings",
        description: error.message || "An error occurred while saving settings. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete setting mutation
  const deleteSettingMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/app-settings/${id}`);
    },
    onSuccess: (_, id) => {
      toast({
        title: "Setting deleted",
        description: "The setting has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete setting",
        description: error.message || "An error occurred while deleting the setting. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle save settings
  const handleSaveSettings = async (tab: string, data: any) => {
    setIsLoading(true);
    try {
      // Create an array of promises for each setting update
      const updatePromises = Object.entries(data).map(([key, value]) => {
        return updateSettingMutation.mutateAsync({
          category: tab,
          key,
          value: typeof value === 'boolean' ? String(value) : String(value)
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
    } catch (error) {
      // Error handling is handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset settings
  const handleResetSettings = async () => {
    setIsLoading(true);
    try {
      // Reset forms to their default values
      generalForm.reset();
      emailForm.reset();
      notificationForm.reset();
      securityForm.reset();
      storageForm.reset();
      
      setIsConfirmResetOpen(false);
      
      toast({
        title: "Settings reset",
        description: "All settings have been reset to their default values in the form. Click Save to apply these changes.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to reset settings",
        description: "An error occurred while resetting settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submissions
  const onSubmitGeneral = (data: GeneralSettingsValues) => {
    handleSaveSettings('general', data);
  };

  const onSubmitEmail = (data: EmailSettingsValues) => {
    handleSaveSettings('email', data);
  };

  const onSubmitNotification = (data: NotificationSettingsValues) => {
    handleSaveSettings('notification', data);
  };

  const onSubmitSecurity = (data: SecuritySettingsValues) => {
    handleSaveSettings('security', data);
  };

  const onSubmitStorage = (data: StorageSettingsValues) => {
    handleSaveSettings('storage', data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">System Settings</h2>
          <p className="text-gray-600">Configure global application settings and preferences</p>
        </div>
        
        <AlertDialog open={isConfirmResetOpen} onOpenChange={setIsConfirmResetOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset All Settings
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all settings to their default values. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetSettings}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Settings
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 bg-[#F7FAFC] p-1">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <BellRing className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Storage
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic application settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form id="general-form" onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Transit App" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your application shown in the title bar and emails
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="#1976D2" {...field} />
                            </FormControl>
                            <div 
                              className="w-10 h-10 rounded border" 
                              style={{ backgroundColor: field.value }}
                            />
                          </div>
                          <FormDescription>
                            Primary brand color in hex format (#RRGGBB)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Real-time transit information and crowd reporting platform" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description used for SEO and social sharing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your application logo (recommended size: 200×50px)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="faviconUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/favicon.ico" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your favicon (recommended size: 32×32px)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <FormField
                    control={generalForm.control}
                    name="enableMaintenance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Maintenance Mode</FormLabel>
                          <FormDescription>
                            Put the application in maintenance mode
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
                  
                  {generalForm.watch("enableMaintenance") && (
                    <FormField
                      control={generalForm.control}
                      name="maintenanceMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maintenance Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Our site is currently undergoing scheduled maintenance. Please check back soon." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Message to display to users during maintenance
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => generalForm.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                form="general-form"
                className="bg-[#1976D2] hover:bg-[#1565C0]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email delivery settings and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form id="email-form" onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Server</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="587" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input placeholder="no-reply@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email address shown as the sender
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Transit App" {...field} />
                          </FormControl>
                          <FormDescription>
                            Name shown as the sender
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={emailForm.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Email Notifications</FormLabel>
                          <FormDescription>
                            Allow the system to send email notifications to users
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
                  
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-md">
                    <p className="text-sm">
                      <strong>Tip:</strong> After saving these settings, we recommend sending a test email
                      to verify your configuration.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => emailForm.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  disabled={isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
                <Button
                  type="submit"
                  form="email-form"
                  className="bg-[#1976D2] hover:bg-[#1565C0]"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure user notification preferences and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form id="notification-form" onSubmit={notificationForm.handleSubmit(onSubmitNotification)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    
                    <FormField
                      control={notificationForm.control}
                      name="enableEmailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Send notifications via email to users
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
                    
                    <FormField
                      control={notificationForm.control}
                      name="enablePushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Push Notifications</FormLabel>
                            <FormDescription>
                              Send push notifications to mobile devices
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
                    
                    <FormField
                      control={notificationForm.control}
                      name="enableInAppNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">In-App Notifications</FormLabel>
                            <FormDescription>
                              Display notifications within the application
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
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    
                    <FormField
                      control={notificationForm.control}
                      name="newUserNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New User Registration</FormLabel>
                            <FormDescription>
                              Notify administrators when a new user registers
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
                    
                    <FormField
                      control={notificationForm.control}
                      name="newReportNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New Crowd Reports</FormLabel>
                            <FormDescription>
                              Notify administrators when new crowd reports are submitted
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
                    
                    <FormField
                      control={notificationForm.control}
                      name="systemAlertNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">System Alerts</FormLabel>
                            <FormDescription>
                              Send notifications about system events and errors
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
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Digest Settings</h3>
                    
                    <FormField
                      control={notificationForm.control}
                      name="dailyDigest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Daily Digest</FormLabel>
                            <FormDescription>
                              Send a daily summary of activity to administrators
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
                    
                    <FormField
                      control={notificationForm.control}
                      name="weeklyDigest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Weekly Digest</FormLabel>
                            <FormDescription>
                              Send a weekly summary of activity to administrators
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
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => notificationForm.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                form="notification-form"
                className="bg-[#1976D2] hover:bg-[#1565C0]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form id="security-form" onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Authentication</h3>
                    
                    <FormField
                      control={securityForm.control}
                      name="enableTwoFactor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Require two-factor authentication for all admin users
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Time before users are automatically logged out
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="maxLoginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Login Attempts</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Number of failed login attempts before lockout
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password Policy</h3>
                    
                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Password Length</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum required number of characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={securityForm.control}
                        name="passwordRequireUpper"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
                            <div className="space-y-0.5">
                              <FormLabel>Require Uppercase</FormLabel>
                              <FormDescription>
                                At least one uppercase letter
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
                      
                      <FormField
                        control={securityForm.control}
                        name="passwordRequireNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
                            <div className="space-y-0.5">
                              <FormLabel>Require Number</FormLabel>
                              <FormDescription>
                                At least one number
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
                      
                      <FormField
                        control={securityForm.control}
                        name="passwordRequireSpecial"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
                            <div className="space-y-0.5">
                              <FormLabel>Require Special</FormLabel>
                              <FormDescription>
                                At least one special character
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
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => securityForm.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                form="security-form"
                className="bg-[#1976D2] hover:bg-[#1565C0]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Storage Settings */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure file storage and upload settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...storageForm}>
                <form id="storage-form" onSubmit={storageForm.handleSubmit(onSubmitStorage)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={storageForm.control}
                      name="maxUploadSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Upload Size (MB)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum file size in megabytes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={storageForm.control}
                      name="allowedFileTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allowed File Types</FormLabel>
                          <FormControl>
                            <Input placeholder="jpg, png, pdf, doc" {...field} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of allowed extensions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={storageForm.control}
                    name="storageProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="local">Local Storage</SelectItem>
                            <SelectItem value="s3">Amazon S3</SelectItem>
                            <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                            <SelectItem value="azure">Azure Blob Storage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Storage service provider for file uploads
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {storageForm.watch("storageProvider") !== "local" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={storageForm.control}
                          name="bucketName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bucket Name</FormLabel>
                              <FormControl>
                                <Input placeholder="my-app-bucket" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storageForm.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Region</FormLabel>
                              <FormControl>
                                <Input placeholder="us-east-1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={storageForm.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key / Access Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storageForm.control}
                          name="secretKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secret Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-md">
                    <p className="text-sm">
                      <strong>Note:</strong> Changing the storage provider will not migrate existing files.
                      You'll need to manually transfer files if you change providers.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => storageForm.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  disabled={isLoading}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button
                  type="submit"
                  form="storage-form"
                  className="bg-[#1976D2] hover:bg-[#1565C0]"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}