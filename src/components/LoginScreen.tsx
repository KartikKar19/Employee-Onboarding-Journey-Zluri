import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Building2, Shield, Users, Chrome } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string; department: string; role: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Sales", "Marketing", "Engineering", "HR", "Finance", "Legal", "Design", "Operations"
  ];

  const roles = [
    "Manager", "Senior", "Lead", "Director", "Analyst", "Specialist", "Coordinator", "Associate"
  ];

  const handleLogin = async (loginType: 'sso' | 'credentials') => {
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      const user = {
        name: loginType === 'sso' ? "John Smith" : "Jane Doe",
        email: loginType === 'sso' ? "john.smith@company.com" : email,
        department: selectedDepartment || "Marketing",
        role: selectedRole || "Manager"
      };
      onLogin(user);
      setIsLoading(false);
    }, 1500);
  };

  const handleSSOLogin = (provider: string) => {
    handleLogin('sso');
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && selectedDepartment && selectedRole) {
      handleLogin('credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Panel - Branding */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Zluri AppCatalog</h1>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Enterprise App Discovery Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Discover, request, and manage enterprise applications with intelligent recommendations and automated provisioning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold">Secure</p>
                <p className="text-sm text-gray-600">SOC2 & GDPR Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold">Smart</p>
                <p className="text-sm text-gray-600">Role-based recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <Chrome className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-semibold">Integrated</p>
                <p className="text-sm text-gray-600">1000+ Apps</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Trusted by teams at:</p>
            <div className="flex items-center gap-6">
              <Badge variant="outline" className="px-3 py-1">Microsoft</Badge>
              <Badge variant="outline" className="px-3 py-1">Salesforce</Badge>
              <Badge variant="outline" className="px-3 py-1">Slack</Badge>
              <Badge variant="outline" className="px-3 py-1">Zoom</Badge>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your personalized app catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sso" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sso">SSO Login</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sso" className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleSSOLogin('microsoft')}
                    disabled={isLoading}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                    Continue with Microsoft
                  </Button>
                  
                  <Button 
                    onClick={() => handleSSOLogin('google')}
                    disabled={isLoading}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <div className="w-5 h-5 bg-red-500 rounded"></div>
                    Continue with Google
                  </Button>
                  
                  <Button 
                    onClick={() => handleSSOLogin('okta')}
                    disabled={isLoading}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <div className="w-5 h-5 bg-blue-500 rounded"></div>
                    Continue with Okta
                  </Button>
                </div>
                
                <p className="text-sm text-center text-gray-500">
                  Demo: Click any SSO option to continue
                </p>
              </TabsContent>
              
              <TabsContent value="credentials">
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !email || !password || !selectedDepartment || !selectedRole}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <p className="text-sm text-center text-gray-500 mt-4">
                  Demo: Use any email/password combination
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}