import { useState, useEffect } from "react";
import { SearchHeader } from "./components/SearchHeader";
import { Navigation } from "./components/Navigation";
import { PersonalDashboard } from "./components/PersonalDashboard";
import { AppCatalog } from "./components/AppCatalog";
import { RequestsView } from "./components/RequestsView";
import { DepartmentTransitionNotification } from "./components/DepartmentTransitionNotification";
import { LoginScreen } from "./components/LoginScreen";
import { AppRequestModal } from "./components/AppRequestModal";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { apps, App } from "./data/apps";

interface User {
  name: string;
  email: string;
  department: string;
  role: string;
}

interface Request {
  id: string;
  appName: string;
  appIcon: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'provisioning' | 'complete';
  justification: string;
  duration?: string;
  approver?: string;
  notes?: string;
  estimatedCompletion?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'catalog' | 'requests'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [showTransitionNotification, setShowTransitionNotification] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [myApps, setMyApps] = useState<App[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [requests, setRequests] = useState<Request[]>([
    // Sample existing requests for demo
    {
      id: 'req1',
      appName: 'Salesforce',
      appIcon: '',
      requestDate: '2 days ago',
      status: 'approved',
      justification: 'Need CRM access for new client onboarding process',
      duration: '1 year',
      approver: 'Sarah Chen (Sales Manager)',
      notes: 'Approved for full access. Training session scheduled for next week.'
    },
    {
      id: 'req2', 
      appName: 'Figma',
      appIcon: '',
      requestDate: '1 week ago',
      status: 'provisioning',
      justification: 'Required for UI design collaboration with engineering team',
      duration: '6 months',
      approver: 'Mike Johnson (Design Lead)',
      estimatedCompletion: 'Within 24 hours'
    }
  ]);

  // Simulate automatic status updates for requests
  useEffect(() => {
    const timer = setInterval(() => {
      setRequests(prevRequests => 
        prevRequests.map(request => {
          if (request.status === 'pending') {
            // Randomly approve some pending requests
            if (Math.random() < 0.3) {
              toast.success(`${request.appName} request approved! 🎉`);
              return { 
                ...request, 
                status: 'approved' as const,
                approver: 'John Smith (Manager)',
                notes: 'Approved based on business justification.'
              };
            }
          } else if (request.status === 'approved') {
            // Move approved to provisioning
            if (Math.random() < 0.2) {
              return { 
                ...request, 
                status: 'provisioning' as const,
                estimatedCompletion: 'Within 24 hours'
              };
            }
          } else if (request.status === 'provisioning') {
            // Complete provisioning
            if (Math.random() < 0.1) {
              toast.success(`${request.appName} is now available! You can launch it from your dashboard.`);
              
              // Add to myApps
              const app = apps.find(a => a.name === request.appName);
              if (app) {
                setMyApps(prev => [...prev, { ...app, status: 'owned' }]);
              }
              
              return { ...request, status: 'complete' as const };
            }
          }
          return request;
        })
      );
    }, 5000); // Check every 5 seconds

    return () => clearInterval(timer);
  }, []);

  // Initialize user's apps based on department
  useEffect(() => {
    if (user && myApps.length === 0) {
      // Give user some initial apps based on their department
      const departmentApps = apps.filter(app => 
        app.department.includes(user.department) && 
        ['owned', 'available'].includes(app.status)
      ).slice(0, 3);
      
      setMyApps(departmentApps.map(app => ({ ...app, status: 'owned' })));
      setSelectedDepartment(user.department);
      setIsNewUser(departmentApps.length === 0);
    }
  }, [user, myApps.length]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const handleAppAction = (appId: string, action: 'launch' | 'request') => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    if (action === 'launch') {
      toast.success(`Launching ${app.name}...`);
      // Update last used
      setMyApps(prev => prev.map(a => 
        a.id === appId ? { ...a, lastUsed: 'Just now' } : a
      ));
    } else if (action === 'request') {
      if (app.status === 'restricted') {
        toast.error(`${app.name} access is restricted. Contact your IT administrator.`);
        return;
      }
      setSelectedApp(app);
      setShowRequestModal(true);
    }
  };

  const handleRequestSubmit = (requestData: {
    appId: string;
    justification: string;
    duration: string;
    urgency: string;
    businessCase: string;
  }) => {
    const app = apps.find(a => a.id === requestData.appId);
    if (!app) return;

    // Add to pending requests
    setPendingRequests(prev => [...prev, requestData.appId]);
    
    // Create new request
    const newRequest: Request = {
      id: `req-${Date.now()}`,
      appName: app.name,
      appIcon: '',
      requestDate: 'Just now',
      status: 'pending',
      justification: requestData.justification,
      duration: requestData.duration
    };
    
    setRequests(prev => [newRequest, ...prev]);
    toast.success(`Access request submitted for ${app.name}`);
    
    // Auto-switch to requests view
    setCurrentView('requests');
  };

  const handleExploreCatalog = () => {
    setCurrentView('catalog');
    if (user) {
      setSelectedDepartment(user.department);
    }
  };

  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleTransitionDismiss = () => {
    setShowTransitionNotification(false);
  };

  const handleViewNewApps = () => {
    setShowTransitionNotification(false);
    setCurrentView('catalog');
    setSelectedDepartment('Engineering');
  };

  const handleCancelRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    toast.success('Request cancelled');
  };

  // Filter apps based on pending requests and user's owned apps
  const appsWithStatus = apps.map(app => {
    if (myApps.some(myApp => myApp.id === app.id)) {
      return { ...app, status: 'owned' as const };
    }
    if (pendingRequests.includes(app.id)) {
      return { ...app, status: 'pending' as const };
    }
    return app;
  });

  const filteredCatalogApps = searchQuery 
    ? appsWithStatus 
    : appsWithStatus;

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={showTransitionNotification}
        userDepartment={user?.department || 'Marketing'}
        onDepartmentChange={() => setShowTransitionNotification(!showTransitionNotification)}
      />

      {showTransitionNotification && (
        <DepartmentTransitionNotification
          oldDepartment="Sales"
          newDepartment="Engineering"
          daysUntilDeprovisioning={7}
          newAppsCount={5}
          onDismiss={handleTransitionDismiss}
          onViewNewApps={handleViewNewApps}
        />
      )}

      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        pendingRequestsCount={requests.filter(r => r.status === 'pending').length}
      />

      {searchQuery ? (
        <AppCatalog
          apps={filteredCatalogApps}
          onAppAction={handleAppAction}
          selectedDepartment="All"
          onDepartmentFilter={handleDepartmentFilter}
          searchQuery={searchQuery}
        />
      ) : currentView === 'dashboard' ? (
        <PersonalDashboard
          myApps={myApps}
          onAppAction={handleAppAction}
          onExploreCatalog={handleExploreCatalog}
          isNewUser={isNewUser}
          userDepartment={user?.department || 'Marketing'}
        />
      ) : currentView === 'catalog' ? (
        <AppCatalog
          apps={filteredCatalogApps}
          onAppAction={handleAppAction}
          selectedDepartment={selectedDepartment}
          onDepartmentFilter={handleDepartmentFilter}
        />
      ) : (
        <RequestsView
          requests={requests}
          onCancelRequest={handleCancelRequest}
        />
      )}

      <AppRequestModal
        app={selectedApp}
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSelectedApp(null);
        }}
        onSubmit={handleRequestSubmit}
      />

      <Toaster />
    </div>
  );
}