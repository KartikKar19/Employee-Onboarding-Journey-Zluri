import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, MessageSquare } from "lucide-react";

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

interface RequestsViewProps {
  requests: Request[];
  onCancelRequest: (requestId: string) => void;
}

export function RequestsView({ requests, onCancelRequest }: RequestsViewProps) {
  const [selectedTab, setSelectedTab] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'provisioning':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Waiting for Approval', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', variant: 'secondary' as const, className: 'bg-red-100 text-red-800' },
      provisioning: { label: 'Provisioning', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      complete: { label: 'Complete', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const filterRequests = (status?: string) => {
    if (!status || status === 'all') return requests;
    return requests.filter(request => request.status === status);
  };

  const getTabCount = (status?: string) => {
    return filterRequests(status).length;
  };

  const RequestCard = ({ request }: { request: Request }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {request.appName.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg">{request.appName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Requested {request.requestDate}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Justification:</p>
            <p className="text-sm text-gray-600">{request.justification}</p>
          </div>

          {request.duration && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Duration:</p>
              <p className="text-sm text-gray-600">{request.duration}</p>
            </div>
          )}

          {request.approver && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Approved by {request.approver}</span>
            </div>
          )}

          {request.notes && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
              </div>
            </div>
          )}

          {request.estimatedCompletion && request.status === 'provisioning' && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Estimated completion:</strong> {request.estimatedCompletion}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {request.status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onCancelRequest(request.id)}
              >
                Cancel Request
              </Button>
            )}
            {request.status === 'complete' && (
              <Button size="sm">
                Launch App
              </Button>
            )}
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">App Requests</h2>
        <p className="text-gray-600">
          Track your application access requests and their approval status
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({getTabCount()})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getTabCount('pending')})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({getTabCount('approved')})
          </TabsTrigger>
          <TabsTrigger value="provisioning">
            Provisioning ({getTabCount('provisioning')})
          </TabsTrigger>
          <TabsTrigger value="complete">
            Complete ({getTabCount('complete')})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({getTabCount('rejected')})
          </TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'provisioning', 'complete', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterRequests(status === 'all' ? undefined : status).length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    No {status === 'all' ? '' : status} requests
                  </h3>
                  <p className="text-gray-500">
                    {status === 'all' 
                      ? "You haven't made any app requests yet." 
                      : `No requests with ${status} status.`
                    }
                  </p>
                </div>
              ) : (
                filterRequests(status === 'all' ? undefined : status).map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="font-semibold">{getTabCount('pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Provisioning</p>
                <p className="font-semibold">{getTabCount('provisioning')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Complete</p>
                <p className="font-semibold">{getTabCount('complete')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-semibold">{requests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}