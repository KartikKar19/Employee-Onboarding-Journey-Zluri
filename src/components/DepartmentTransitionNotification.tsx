import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, ArrowRight, Clock, CheckCircle } from "lucide-react";

interface DepartmentTransitionNotificationProps {
  oldDepartment: string;
  newDepartment: string;
  daysUntilDeprovisioning: number;
  newAppsCount: number;
  onDismiss: () => void;
  onViewNewApps: () => void;
}

export function DepartmentTransitionNotification({
  oldDepartment,
  newDepartment,
  daysUntilDeprovisioning,
  newAppsCount,
  onDismiss,
  onViewNewApps
}: DepartmentTransitionNotificationProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <Alert className="border-blue-200 bg-blue-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">
                Welcome to {newDepartment}!
              </h4>
            </div>
            
            <AlertDescription className="text-blue-800 mb-4">
              Your profile has been updated and you now have access to {newAppsCount} core {newDepartment} applications.
            </AlertDescription>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {newDepartment} Apps Added
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {oldDepartment} Apps: {daysUntilDeprovisioning} days remaining
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={onViewNewApps} className="gap-2">
                Explore {newDepartment} Tools
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                View Transition Details
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="text-blue-600 hover:bg-blue-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}