import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  BookOpen,
  Video,
  Play,
  Download,
  Search,
  HelpCircle,
  PhoneCall,
  Mail,
  ExternalLink,
  Clock
} from "lucide-react";

export default function ResourcesPage() {
  const { user } = useAuth();
  const [isAdminView, setIsAdminView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };

  // Filter resources based on search query
  const filterResources = (resources: any[], query: string) => {
    if (!query) return resources;
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Resource Data
  const guides = [
    {
      id: 1,
      title: "Getting Started with Transit App",
      description: "Learn the basics of using our transit application for your daily commute.",
      icon: <BookOpen className="h-5 w-5" />,
      link: "#",
      category: "Beginner",
      timeToRead: "5 min"
    },
    {
      id: 2,
      title: "Advanced Route Planning",
      description: "Discover how to plan complex routes with multiple modes of transport.",
      icon: <FileText className="h-5 w-5" />,
      link: "#",
      category: "Advanced",
      timeToRead: "10 min"
    },
    {
      id: 3,
      title: "Contributing Crowd Reports",
      description: "How to submit accurate crowd reports and help the community.",
      icon: <FileText className="h-5 w-5" />,
      link: "#",
      category: "Intermediate",
      timeToRead: "7 min"
    },
    {
      id: 4,
      title: "Setting Up Alerts",
      description: "Configure personalized alerts for your frequent routes.",
      icon: <FileText className="h-5 w-5" />,
      link: "#",
      category: "Intermediate",
      timeToRead: "8 min"
    }
  ];
  
  const videos = [
    {
      id: 1,
      title: "Transit App Overview",
      description: "A comprehensive overview of all features in our transit application.",
      thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      link: "#",
      duration: "5:24"
    },
    {
      id: 2,
      title: "How to Submit Crowd Reports",
      description: "Step-by-step tutorial on submitting accurate crowd reports.",
      thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      link: "#",
      duration: "3:18"
    },
    {
      id: 3,
      title: "Tips for Efficient Commuting",
      description: "Expert advice on making your commute faster and more efficient.",
      thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      link: "#",
      duration: "8:42"
    }
  ];
  
  const faqs = [
    {
      id: 1,
      question: "How do I report a crowded station?",
      answer: "You can submit a crowd report by navigating to your dashboard, selecting the 'Submit Crowd Report' tab, and filling out the form with the station name, crowd level, and other details."
    },
    {
      id: 2,
      question: "Are the transit schedules updated in real-time?",
      answer: "Yes, our application connects to transit authority APIs to provide real-time updates on train and bus schedules, including delays and cancellations."
    },
    {
      id: 3,
      question: "How often are crowd reports updated?",
      answer: "Crowd reports are updated as soon as they are approved by our moderation team, which typically happens within 5-10 minutes of submission."
    },
    {
      id: 4,
      question: "Can I use the app offline?",
      answer: "The app requires an internet connection for real-time data, but some basic features like saved route information can be accessed offline."
    },
    {
      id: 5,
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security practices to protect all user data. We also have a strict privacy policy that prohibits sharing personal information with third parties."
    }
  ];
  
  const downloads = [
    {
      id: 1,
      title: "Transit App User Guide",
      description: "Complete PDF guide to all features in our transit application.",
      icon: <FileText className="h-5 w-5" />,
      link: "#",
      fileSize: "1.2 MB",
      fileType: "PDF"
    },
    {
      id: 2,
      title: "Mobile App for iOS",
      description: "Download our iOS app for on-the-go access to transit information.",
      icon: <Download className="h-5 w-5" />,
      link: "#",
      fileSize: "25 MB",
      fileType: "App"
    },
    {
      id: 3,
      title: "Mobile App for Android",
      description: "Download our Android app for on-the-go access to transit information.",
      icon: <Download className="h-5 w-5" />,
      link: "#",
      fileSize: "18 MB",
      fileType: "App"
    }
  ];

  // Filter resources based on search query
  const filteredGuides = filterResources(guides, searchQuery);
  const filteredVideos = filterResources(videos, searchQuery);
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs;
  const filteredDownloads = filterResources(downloads, searchQuery);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Header isAdminView={false} toggleAdminView={toggleAdminView} />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">Resources & Support</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find everything you need to make the most of our transit application,
              from tutorials and guides to FAQs and support resources.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Resources Tabs */}
          <Tabs defaultValue="guides" className="mb-16">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8">
              <TabsTrigger value="guides" className="flex items-center justify-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center justify-center">
                <Video className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="downloads" className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </TabsTrigger>
            </TabsList>
            
            {/* Guides Content */}
            <TabsContent value="guides">
              {filteredGuides.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No guides found matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGuides.map((guide) => (
                    <Card key={guide.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{guide.title}</CardTitle>
                          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{guide.category}</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{guide.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{guide.timeToRead} read</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Read Guide <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Videos Content */}
            <TabsContent value="videos">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No videos found matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <Card key={video.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      <div className="relative">
                        <div className="aspect-video bg-gray-200 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-blue-600 bg-opacity-75 flex items-center justify-center cursor-pointer">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{video.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{video.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Watch Video <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* FAQ Content */}
            <TabsContent value="faq">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No FAQs found matching your search criteria.</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <div className="space-y-6">
                    {filteredFaqs.map((faq) => (
                      <Card key={faq.id}>
                        <CardHeader>
                          <CardTitle className="text-xl flex items-start">
                            <HelpCircle className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-1" />
                            <span>{faq.question}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Downloads Content */}
            <TabsContent value="downloads">
              {filteredDownloads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No downloads found matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredDownloads.map((download) => (
                    <Card key={download.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{download.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{download.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{download.fileType}</span>
                          <span>{download.fileSize}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-[#1976D2] hover:bg-[#1565C0]">
                          Download <Download className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Contact Support Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our support team is ready to assist you with any questions or issues you may encounter
                while using our transit application.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <PhoneCall className="h-5 w-5 mr-2 text-blue-600" />
                    Call Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Available Monday to Friday, 9 AM - 5 PM</p>
                  <p className="text-lg font-medium">+1 (800) 555-1234</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Call Now
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">We'll respond within 24 hours</p>
                  <p className="text-lg font-medium">support@transitapp.com</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Send Email
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer isAdminView={false} />
    </div>
  );
}