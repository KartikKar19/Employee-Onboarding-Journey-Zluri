import { useState } from "react";
import { AppCard } from "./AppCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Filter, Grid, List, SortAsc } from "lucide-react";

interface App {
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
  department: string[];
  complianceBadges?: string[];
  usageStats?: string;
  trending?: boolean;
  recommended?: boolean;
  securityLevel?: 'high' | 'medium' | 'low';
}

interface AppCatalogProps {
  apps: App[];
  onAppAction: (appId: string, action: 'launch' | 'request') => void;
  selectedDepartment?: string;
  onDepartmentFilter: (department: string) => void;
  searchQuery?: string;
}

export function AppCatalog({ 
  apps, 
  onAppAction, 
  selectedDepartment,
  onDepartmentFilter,
  searchQuery = ""
}: AppCatalogProps) {
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const departments = ["All", "Marketing", "Sales", "Engineering", "HR", "Finance", "Design", "Legal", "Operations"];
  const categories = [...new Set(apps.map(app => app.category))];
  const complianceOptions = ["all", "SOC2", "GDPR", "HIPAA", "ISO27001"];
  const statusOptions = ["all", "available", "owned", "restricted"];

  const filteredApps = apps.filter(app => {
    const matchesDepartment = !selectedDepartment || selectedDepartment === "All" || 
      app.department.includes(selectedDepartment);
    
    const matchesSearch = !searchQuery || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCompliance = complianceFilter === "all" || 
      (app.complianceBadges && app.complianceBadges.includes(complianceFilter));
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesDepartment && matchesSearch && matchesCompliance && matchesStatus;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    // Prioritize trending and recommended apps
    if (a.trending && !b.trending) return -1;
    if (!a.trending && b.trending) return 1;
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    
    switch (sortBy) {
      case "popular":
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return b.id.localeCompare(a.id); // Simple newest simulation
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {searchQuery ? `Search Results` : "App Catalog"}
            </h2>
            <p className="text-gray-600 mt-1">
              {searchQuery 
                ? `Found ${filteredApps.length} apps matching "${searchQuery}"`
                : `Discover and request access to ${filteredApps.length} business applications`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Department:</span>
              <div className="flex gap-2 flex-wrap">
                {departments.slice(0, 6).map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    size="sm"
                    onClick={() => onDepartmentFilter(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Compliance:</span>
              <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {complianceOptions.slice(1).map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {sortedApps.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Total Apps</p>
            <p className="text-2xl font-semibold">{sortedApps.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-semibold text-green-600">
              {sortedApps.filter(a => a.status === 'available').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Trending</p>
            <p className="text-2xl font-semibold text-orange-600">
              {sortedApps.filter(a => a.trending).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">High Security</p>
            <p className="text-2xl font-semibold text-blue-600">
              {sortedApps.filter(a => a.securityLevel === 'high').length}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {sortedApps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No apps found matching your criteria</p>
          <Button onClick={() => {
            onDepartmentFilter("All");
            setComplianceFilter("all");
            setStatusFilter("all");
          }} variant="outline">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
        }>
          {sortedApps.map((app) => (
            <AppCard key={app.id} app={app} onAction={onAppAction} />
          ))}
        </div>
      )}

      {/* Department Info */}
      {selectedDepartment && selectedDepartment !== "All" && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">
            {selectedDepartment} Department Apps
          </h4>
          <p className="text-blue-700 text-sm">
            These {filteredApps.length} applications are commonly used and recommended for {selectedDepartment} teams.
            Apps with high ratings indicate strong user satisfaction within your department.
          </p>
        </div>
      )}
    </div>
  );
}