import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Home, Grid3x3, FileText, Settings } from "lucide-react";

interface NavigationProps {
  currentView: 'dashboard' | 'catalog' | 'requests';
  onViewChange: (view: 'dashboard' | 'catalog' | 'requests') => void;
  pendingRequestsCount?: number;
}

export function Navigation({ currentView, onViewChange, pendingRequestsCount = 0 }: NavigationProps) {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-8 py-4">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => onViewChange('dashboard')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            My Dashboard
          </Button>
          
          <Button
            variant={currentView === 'catalog' ? 'default' : 'ghost'}
            onClick={() => onViewChange('catalog')}
            className="gap-2"
          >
            <Grid3x3 className="w-4 h-4" />
            App Catalog
          </Button>

          <Button
            variant={currentView === 'requests' ? 'default' : 'ghost'}
            onClick={() => onViewChange('requests')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Requests
            {pendingRequestsCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingRequestsCount}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
    </nav>
  );
}