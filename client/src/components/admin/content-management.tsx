import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Content } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PlusCircle,
  FileEdit,
  Trash2,
  Search,
  Loader2,
  RefreshCw,
  Image,
  File,
  FileText,
  Video,
  MoveUp,
  Link as LinkIcon
} from "lucide-react";

// Define content form schema
const contentFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.string().min(1, { message: "Content type is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(3, { message: "Content is required" }),
  imageUrl: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  tags: z.string().optional(),
  status: z.string().min(1, { message: "Status is required" }),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  // Fetch content data
  const { data: contents = [], isLoading: isLoadingContents, refetch: refetchContents } = useQuery({
    queryKey: ['/api/admin/contents'],
    queryFn: async () => {
      const res = await fetch('/api/admin/contents');
      if (!res.ok) throw new Error('Failed to fetch contents');
      return res.json();
    }
  });

  // Filter contents based on search query and content type
  const filteredContents = contents.filter((content: Content) => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (content.tags && content.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = contentTypeFilter === "all" || content.type === contentTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Add content mutation
  const addContentMutation = useMutation({
    mutationFn: async (contentData: ContentFormValues) => {
      const res = await apiRequest('POST', '/api/admin/contents', contentData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contents'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Content added",
        description: "New content has been added successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, contentData }: { id: number; contentData: Partial<ContentFormValues> }) => {
      const res = await apiRequest('PATCH', `/api/admin/contents/${id}`, contentData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contents'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Content updated",
        description: "Content has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/contents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contents'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Content deleted",
        description: "Content has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Setup form for adding content
  const addForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      type: "article",
      description: "",
      content: "",
      imageUrl: "",
      category: "general",
      tags: "",
      status: "draft",
    },
  });

  // Setup form for editing content
  const editForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      content: "",
      imageUrl: "",
      category: "",
      tags: "",
      status: "",
    },
  });

  // Handle add content form submission
  const onAddSubmit = (values: ContentFormValues) => {
    addContentMutation.mutate(values);
  };

  // Handle edit content form submission
  const onEditSubmit = (values: ContentFormValues) => {
    if (selectedContent) {
      updateContentMutation.mutate({
        id: selectedContent.id,
        contentData: values,
      });
    }
  };

  // Open edit dialog with content data
  const openEditDialog = (content: Content) => {
    setSelectedContent(content);
    editForm.reset({
      title: content.title,
      type: content.type,
      description: content.description,
      content: content.content,
      imageUrl: content.imageUrl || "",
      category: content.category,
      tags: content.tags || "",
      status: content.status,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog with content data
  const openDeleteDialog = (content: Content) => {
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };

  // Handle content deletion
  const handleDeleteContent = () => {
    if (selectedContent) {
      deleteContentMutation.mutate(selectedContent.id);
    }
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'file':
        return <File className="h-4 w-4" />;
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      case 'scheduled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-[#F7FAFC] border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-800">Content Management</CardTitle>
            <CardDescription className="text-gray-600">
              Manage articles, images, videos and other content
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              addForm.reset();
              setIsAddDialogOpen(true);
            }}
            className="bg-[#1976D2] hover:bg-[#1565C0]"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search content..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="link">Links</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => refetchContents()} 
            disabled={isLoadingContents}
          >
            {isLoadingContents ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        
        {isLoadingContents ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-4 text-gray-500">Loading content...</p>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <File className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No content found</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery || contentTypeFilter !== "all" 
                ? "Try adjusting your search or filter criteria." 
                : "Get started by adding some content."}
            </p>
            <Button 
              onClick={() => {
                addForm.reset();
                setIsAddDialogOpen(true);
              }}
              className="mt-4 bg-[#1976D2] hover:bg-[#1565C0]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content: Content) => (
              <Card key={content.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {content.imageUrl ? (
                    <div 
                      className="w-full h-full bg-center bg-cover" 
                      style={{ backgroundImage: `url(${content.imageUrl})` }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      {getContentTypeIcon(content.type)}
                      <p className="mt-2 text-gray-500 text-xs uppercase">{content.type} content</p>
                    </div>
                  )}
                </div>
                <CardHeader className="py-4 px-4">
                  <div className="flex justify-between items-start">
                    <Badge className="mb-2">{content.category}</Badge>
                    <Badge className={getStatusBadgeColor(content.status)}>
                      {content.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {content.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  {content.tags && (
                    <div className="flex flex-wrap gap-1 mb-3 mt-1">
                      {content.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="p-4 border-t flex justify-between">
                  <p className="text-xs text-gray-500 flex items-center">
                    {getContentTypeIcon(content.type)}
                    <span className="ml-1 capitalize">{content.type}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(content)}
                      className="h-8 px-2 text-blue-600"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteDialog(content)}
                      className="h-8 px-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {content.status !== 'published' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateContentMutation.mutate({
                          id: content.id, 
                          contentData: { status: 'published' }
                        })}
                        className="h-8 px-2 text-green-600"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Content Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>
              Create and publish new content for your users.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter content title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="file">File</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a short description" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter content" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image for this content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="tag1, tag2, tag3" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#1976D2] hover:bg-[#1565C0]"
                  disabled={addContentMutation.isPending}
                >
                  {addContentMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Content
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Update existing content details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter content title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="file">File</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a short description" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter content" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image for this content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="tag1, tag2, tag3" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#1976D2] hover:bg-[#1565C0]"
                  disabled={updateContentMutation.isPending}
                >
                  {updateContentMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Content
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Content Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the content "{selectedContent?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContent}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteContentMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Content
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}