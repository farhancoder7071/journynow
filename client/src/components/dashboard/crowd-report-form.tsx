import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, AlertTriangle } from 'lucide-react';

// Form validation schema
const crowdReportSchema = z.object({
  stationName: z.string().min(2, { message: 'Station name is required' }),
  crowdLevel: z.string().min(1, { message: 'Crowd level is required' }),
  transportType: z.string().min(1, { message: 'Transport type is required' }),
  routeId: z.coerce.number(),
});

type CrowdReportFormValues = z.infer<typeof crowdReportSchema>;

export function CrowdReportForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<CrowdReportFormValues>({
    resolver: zodResolver(crowdReportSchema),
    defaultValues: {
      stationName: '',
      crowdLevel: '',
      transportType: '',
      routeId: 1 // Default value, should be updated based on actual route IDs
    },
  });
  
  // Submit crowd report mutation
  const submitCrowdReportMutation = useMutation({
    mutationFn: async (values: CrowdReportFormValues) => {
      const res = await apiRequest('POST', '/api/crowd-reports', values);
      return await res.json();
    },
    onSuccess: () => {
      // Reset form and show success toast
      form.reset();
      setIsSubmitting(false);
      toast({
        title: 'Crowd report submitted',
        description: 'Thank you for your contribution. Your report is pending approval.',
        variant: 'default',
      });
      
      // Invalidate crowd reports queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/transit/crowd-reports'] });
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: CrowdReportFormValues) => {
    setIsSubmitting(true);
    submitCrowdReportMutation.mutate(values);
  };

  return (
    <Card className="bg-white shadow">
      <CardHeader className="bg-[#F7FAFC] border-b">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Submit Crowd Report
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter station name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="crowdLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crowd Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crowd level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="routeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter route ID" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-blue-50 p-3 rounded-md flex items-start text-sm">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800">
                Your report will be reviewed by our administrators before being published.
                Thank you for helping keep other travelers informed!
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#1976D2] hover:bg-opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}