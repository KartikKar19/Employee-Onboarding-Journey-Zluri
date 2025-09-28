import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Star, Users, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  complianceBadges: string[];
  usageStats: string;
  monthlyCost?: string;
  securityLevel: 'high' | 'medium' | 'low';
}

interface AppRequestModalProps {
  app: App | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: {
    appId: string;
    justification: string;
    duration: string;
    urgency: string;
    businessCase: string;
  }) => void;
}

export function AppRequestModal({ app, isOpen, onClose, onSubmit }: AppRequestModalProps) {
  const [justification, setJustification] = useState("");
  const [duration, setDuration] = useState("");
  const [urgency, setUrgency] = useState("");
  const [businessCase, setBusinessCase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !justification || !duration || !urgency) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({
        appId: app.id,
        justification,
        duration,
        urgency,
        businessCase
      });
      
      // Reset form
      setJustification("");
      setDuration("");
      setUrgency("");
      setBusinessCase("");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <Shield className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!app) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {app.name.charAt(0)}
            </div>
            <div>
              <span>Request Access to {app.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {app.rating.toFixed(1)} ({app.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Fill out this form to request access. Your manager will review and approve this request.
          </DialogDescription>
        </DialogHeader>

        {/* App Details */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-3">Application Details</h4>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{app.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {app.complianceBadges.map((badge) => (
                <Badge key={badge} variant="outline" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{app.usageStats}</span>
              </div>
              <div className="flex items-center gap-2">
                {getSecurityIcon(app.securityLevel)}
                <span className="text-gray-600 capitalize">{app.securityLevel} Security</span>
              </div>
              {app.monthlyCost && (
                <div className="text-gray-600">
                  Cost: {app.monthlyCost}/month
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="justification">
              Business Justification <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="justification"
              placeholder="Explain why you need access to this application and how it will help you perform your job responsibilities..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500">
              Be specific about your use case. This helps with faster approval.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">
                Access Duration <span className="text-red-500">*</span>
              </Label>
              <Select value={duration} onValueChange={setDuration} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-days">30 days</SelectItem>
                  <SelectItem value="90-days">90 days</SelectItem>
                  <SelectItem value="6-months">6 months</SelectItem>
                  <SelectItem value="1-year">1 year</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">
                Urgency Level <span className="text-red-500">*</span>
              </Label>
              <Select value={urgency} onValueChange={setUrgency} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait 1-2 weeks</SelectItem>
                  <SelectItem value="medium">Medium - Needed within a week</SelectItem>
                  <SelectItem value="high">High - Needed within 2-3 days</SelectItem>
                  <SelectItem value="critical">Critical - Needed today</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessCase">
              Additional Business Case (Optional)
            </Label>
            <Textarea
              id="businessCase"
              placeholder="Any additional context, project details, or expected outcomes..."
              value={businessCase}
              onChange={(e) => setBusinessCase(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Approval Process Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Approval Process</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. Your direct manager will review this request</p>
              <p>2. IT Security will perform a compliance check</p>
              <p>3. You'll receive an email notification with the decision</p>
              <p>4. If approved, the app will be provisioned automatically</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !justification || !duration || !urgency}
              className="flex-1"
            >
              {isSubmitting ? "Submitting Request..." : "Submit Request"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}