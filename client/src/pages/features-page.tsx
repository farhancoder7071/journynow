import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  Bus, 
  Users, 
  MapPin, 
  Bell, 
  Clock, 
  Smartphone, 
  Info, 
  Calendar, 
  CreditCard,
  ChevronRight
} from "lucide-react";

export default function FeaturesPage() {
  const { user } = useAuth();
  const [isAdminView, setIsAdminView] = useState(false);
  
  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Header isAdminView={false} toggleAdminView={toggleAdminView} />
      
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">Transit App Features</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our transit application enhances your travel experience
              with real-time information and community-powered features.
            </p>
          </div>
          
          {/* Key Features Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="Real-time Transit Updates" 
                description="Get up-to-the-minute information on trains and buses, including delays and schedule changes."
                icon={<Clock className="h-12 w-12 text-blue-600" />}
                badges={["Real-time", "Updates"]}
              />
              
              <FeatureCard 
                title="Crowd-sourced Reports" 
                description="Contribute and view crowd reports at stations to better plan your journey and avoid congestion."
                icon={<Users className="h-12 w-12 text-blue-600" />}
                badges={["Community", "Reports"]}
              />
              
              <FeatureCard 
                title="Multi-modal Transit" 
                description="Seamlessly switch between train and bus information, with comprehensive route details."
                icon={<Train className="h-12 w-12 text-blue-600" />}
                badges={["Trains", "Buses"]}
              />
              
              <FeatureCard 
                title="Route Planning" 
                description="Plan your journey with detailed information on routes, stations, and departure times."
                icon={<MapPin className="h-12 w-12 text-blue-600" />}
                badges={["Planning", "Routes"]}
              />
              
              <FeatureCard 
                title="Personalized Alerts" 
                description="Receive notifications about your frequent routes and schedule changes that affect your commute."
                icon={<Bell className="h-12 w-12 text-blue-600" />}
                badges={["Alerts", "Personalized"]}
              />
              
              <FeatureCard 
                title="Mobile Accessibility" 
                description="Access all features on your smartphone or tablet with our responsive, mobile-friendly design."
                icon={<Smartphone className="h-12 w-12 text-blue-600" />}
                badges={["Mobile", "Responsive"]}
              />
            </div>
          </div>
          
          {/* How It Works Section */}
          <div className="mb-16 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Info className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Get Information</h3>
                  <p className="text-gray-600">Access real-time information on train and bus routes, schedules, and crowd levels at stations.</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Contribute Reports</h3>
                  <p className="text-gray-600">Help others by submitting crowd reports at stations to improve community awareness.</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Plan Your Journey</h3>
                  <p className="text-gray-600">Make informed decisions for your travel based on real-time data and community reports.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pricing Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Pricing Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">Basic</CardTitle>
                  <CardDescription>Free</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <FeatureItem text="Real-time transit information" available={true} />
                    <FeatureItem text="View crowd reports" available={true} />
                    <FeatureItem text="Basic route planning" available={true} />
                    <FeatureItem text="Submit crowd reports" available={false} />
                    <FeatureItem text="Personalized alerts" available={false} />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#1976D2] hover:bg-[#1565C0]">Sign Up Free</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-blue-500 shadow-lg">
                <CardHeader className="bg-blue-50">
                  <Badge className="self-start mb-2 bg-blue-500">Popular</Badge>
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <CardDescription>$4.99/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <FeatureItem text="All Basic features" available={true} />
                    <FeatureItem text="Submit unlimited crowd reports" available={true} />
                    <FeatureItem text="Personalized route alerts" available={true} />
                    <FeatureItem text="Ad-free experience" available={true} />
                    <FeatureItem text="Priority customer support" available={false} />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Premium</Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">Business</CardTitle>
                  <CardDescription>$12.99/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <FeatureItem text="All Premium features" available={true} />
                    <FeatureItem text="Team accounts (up to 5)" available={true} />
                    <FeatureItem text="API access" available={true} />
                    <FeatureItem text="Advanced analytics" available={true} />
                    <FeatureItem text="24/7 priority support" available={true} />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#1976D2] hover:bg-[#1565C0]">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg py-12 px-6">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your transit experience?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of commuters who have improved their daily journeys with real-time
              information and community-driven insights.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-blue-700 hover:bg-blue-50">
              Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer isAdminView={false} />
    </div>
  );
}

// Helper Component for Feature Cards
function FeatureCard({ title, description, icon, badges }: { 
  title: string, 
  description: string, 
  icon: React.ReactNode,
  badges: string[]
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full bg-blue-50 mb-4">
            {icon}
          </div>
          <CardTitle className="text-center">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center mb-4">{description}</p>
        <div className="flex justify-center gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50">{badge}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper Component for Feature List Items
function FeatureItem({ text, available }: { text: string, available: boolean }) {
  return (
    <li className="flex items-start">
      <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 ${available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
        {available ? '✓' : '×'}
      </span>
      <span className={available ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
    </li>
  );
}