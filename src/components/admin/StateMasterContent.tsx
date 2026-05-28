import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Edit, 
  Trash2, 
  Loader2, 
  Search, 
  Plus, 
  RefreshCw, 
  Activity, 
  Building, 
  Calendar, 
  Hash, 
  Globe, 
  BarChart3,
  TrendingUp,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface StateMaster {
  id: string;
  city_id: number;
  city_name: string;
  created_date?: string;
}

const StateMasterContent = () => {
  const {
    data: states,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<StateMaster>({ tableName: 'state_master' });

  useAdminRealTime({
    tableName: 'state_master'
  });

  const [stateName, setStateName] = useState("");
  const [editingState, setEditingState] = useState<StateMaster | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Statistics calculation
  const stats = useMemo(() => {
    const total = states.length;
    const recentlyAdded = states.filter(state => {
      if (!state.created_date) return false;
      const createdDate = new Date(state.created_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;
    
    return {
      total,
      recentlyAdded,
      oldestEntry: states.length > 0 ? Math.min(...states.map(s => s.city_id)) : 0,
      newestEntry: states.length > 0 ? Math.max(...states.map(s => s.city_id)) : 0
    };
  }, [states]);

  // Filtered data
  const filteredStates = useMemo(() => {
    return states.filter(state =>
      state.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.city_id.toString().includes(searchTerm)
    );
  }, [states, searchTerm]);

  const handleSave = async () => {
    if (!stateName.trim()) {
      toast.error("Please enter a state name");
      return;
    }

    try {
      if (editingState) {
        // Update existing state
        await update(editingState.id, {
          city_name: stateName.trim(),
        });
        toast.success("State updated successfully!");
        setEditingState(null);
      } else {
        // Create new state
        const maxCityId = states.length > 0 ? Math.max(...states.map(s => s.city_id)) : 0;
        const newState = {
          city_id: maxCityId + 1,
          city_name: stateName.trim(),
          created_date: new Date().toLocaleDateString()
        };
        await create(newState);
        toast.success("State added successfully!");
      }
      
      setStateName("");
    } catch (error) {
      toast.error(editingState ? "Failed to update state" : "Failed to add state");
    }
  };

  const handleReset = () => {
    setStateName("");
    setEditingState(null);
  };

  const handleEdit = (state: StateMaster) => {
    setEditingState(state);
    setStateName(state.city_name);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this state?")) return;
    
    try {
      await deleteItem(id);
      toast.success("State deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete state");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading states...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <MapPin className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">State Master Management</h1>
              <p className="text-primary-foreground/80">Manage state data and geographic information</p>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total States</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-xs text-blue-200 mt-1">Registered states</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Recent Additions</p>
                  <p className="text-3xl font-bold">{stats.recentlyAdded}</p>
                  <p className="text-xs text-green-200 mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Oldest Entry</p>
                  <p className="text-3xl font-bold">#{stats.oldestEntry}</p>
                  <p className="text-xs text-purple-200 mt-1">First state ID</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Latest Entry</p>
                  <p className="text-3xl font-bold">#{stats.newestEntry}</p>
                  <p className="text-xs text-orange-200 mt-1">Recent state ID</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* State Master Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {editingState ? 'Edit State Details' : 'State Registration Form'}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal">Manage state information and geographic data</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Geographic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-primary/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Geographic Information</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                  </div>
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    State Name *
                  </label>
                  <Input
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Enter state name (e.g., Uttar Pradesh)"
                    className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                  />
                  <div className="text-xs text-muted-foreground">Enter the complete state name as per official records</div>
                </div>
              </div>

              {/* Submit and Reset Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                  size="lg"
                >
                  {editingState ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update State
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add State
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Search & Filter States</h3>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by state name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refresh()}
                className="border-2 border-border/80 hover:border-primary"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* State Master Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-foreground">
                  State Master Registry
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    Complete state database with {filteredStates.length} entries
                  </p>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    {filteredStates.length} of {states.length} states
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredStates.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-muted rounded-full">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      {searchTerm ? "No states found" : "No states available"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm 
                        ? "Try adjusting your search criteria" 
                        : "Start by adding your first state using the form above"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-b-2 border-border">
                      <TableHead className="w-[120px] font-semibold text-foreground">Actions</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">State ID</TableHead>
                      <TableHead className="min-w-[200px] font-semibold text-foreground">State Name</TableHead>
                      <TableHead className="min-w-[150px] font-semibold text-foreground">Created Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStates.map((state, index) => (
                      <TableRow 
                        key={state.id} 
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(state)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit state"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(state.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete state"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-mono text-sm font-medium">{state.city_id}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-foreground">{state.city_name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm text-muted-foreground">
                            {state.created_date || "N/A"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StateMasterContent;