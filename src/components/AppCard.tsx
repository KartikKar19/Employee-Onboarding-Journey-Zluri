import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Users, Calendar, Shield, TrendingUp, Sparkles, Lock } from "lucide-react";

interface AppCardProps {
  app: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating: number;
    reviewCount: number;
    lastUsed?: string;
    status: 'owned' | 'available' | 'pending' | 'restricted';
    logoUrl: string;
    tags: string[];
    complianceBadges?: string[];
    usageStats?: string;
    trending?: boolean;
    recommended?: boolean;
    securityLevel?: 'high' | 'medium' | 'low';
  };
  onAction: (appId: string, action: 'launch' | 'request') => void;
}

export function AppCard({ app, onAction }: AppCardProps) {
  const getStatusBadge = () => {
    switch (app.status) {
      case 'owned':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Owned</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'restricted':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 gap-1">
          <Lock className="w-3 h-3" />
          Restricted
        </Badge>;
      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (app.status) {
      case 'owned':
        return (
          <Button 
            onClick={() => onAction(app.id, 'launch')}
            className="w-full"
          >
            Launch
          </Button>
        );
      case 'pending':
        return (
          <Button 
            disabled
            variant="outline"
            className="w-full"
          >
            Access Requested
          </Button>
        );
      case 'restricted':
        return (
          <Button 
            disabled
            variant="outline"
            className="w-full opacity-50"
          >
            Restricted Access
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => onAction(app.id, 'request')}
            variant="outline"
            className="w-full"
          >
            Request Access
          </Button>
        );
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold relative">
              {app.name.charAt(0)}
              {app.trending && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              {app.recommended && !app.trending && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {app.name}
                {app.securityLevel === 'high' && (
                  <Shield className="w-4 h-4 text-green-600" />
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {app.rating.toFixed(1)} ({app.reviewCount})
                  </span>
                </div>
                {getStatusBadge()}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-4 line-clamp-2">
          {app.description}
        </CardDescription>
        
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-1">
            {app.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {app.complianceBadges && app.complianceBadges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {app.complianceBadges.slice(0, 3).map((badge) => (
                <Badge key={badge} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {app.lastUsed && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last used {app.lastUsed}
            </div>
          )}
          
          {app.usageStats && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {app.usageStats}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {getActionButton()}
          <p className="text-xs text-muted-foreground text-center">
            Category: {app.category}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}