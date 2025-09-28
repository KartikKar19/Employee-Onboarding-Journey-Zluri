import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AppCard } from "./AppCard";
import { Plus, ArrowRight, Sparkles } from "lucide-react";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  lastUsed?: string;
  status: 'owned' | 'available' | 'pending';
  logoUrl: string;
  tags: string[];
}

interface PersonalDashboardProps {
  myApps: App[];
  onAppAction: (appId: string, action: 'launch' | 'request') => void;
  onExploreCatalog: () => void;
  isNewUser?: boolean;
  userDepartment: string;
}

export function PersonalDashboard({ 
  myApps, 
  onAppAction, 
  onExploreCatalog, 
  isNewUser = false,
  userDepartment 
}: PersonalDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome to your workspace</h2>
        <p className="text-gray-600">
          {isNewUser 
            ? `Get started by exploring apps recommended for ${userDepartment}`
            : `Manage your apps and discover new tools for ${userDepartment}`
          }
        </p>
      </div>

      {/* My Apps Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">My Apps</h3>
          {myApps.length > 0 && (
            <Button variant="outline" size="sm">
              View All ({myApps.length})
            </Button>
          )}
        </div>

        {myApps.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="mb-2">No apps yet</CardTitle>
              <CardDescription className="text-center mb-6 max-w-md">
                You haven't been granted access to any apps yet. 
                Explore our catalog to find tools that will help you be more productive.
              </CardDescription>
              <Button onClick={onExploreCatalog} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Explore Catalog
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myApps.slice(0, 8).map((app) => (
              <AppCard key={app.id} app={app} onAction={onAppAction} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onExploreCatalog}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Explore Apps</CardTitle>
                <CardDescription>
                  Browse our catalog of {userDepartment.toLowerCase()} tools
                </CardDescription>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>
                  View your app usage and requests
                </CardDescription>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Department Recommendations */}
      {isNewUser && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">
              Recommended for {userDepartment}
            </CardTitle>
            <CardDescription className="text-blue-700">
              These apps are commonly used by your department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onExploreCatalog} className="gap-2">
              View {userDepartment} Apps
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}