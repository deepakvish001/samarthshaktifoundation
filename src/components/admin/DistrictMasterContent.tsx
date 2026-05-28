import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Filter,
  Building2,
  Map
} from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface DistrictMaster {
  id: string;
  site_id: number;
  city_id: number;
  site_name: string;
  created_date?: string;
}

const DistrictMasterContent = () => {
  const {
    data: districts,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<DistrictMaster>({ tableName: 'district_master' });

  useAdminRealTime({
    tableName: 'district_master'
  });

  const [selectedState, setSelectedState] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [editingDistrict, setEditingDistrict] = useState<DistrictMaster | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const states = [
    { value: "16", label: "Uttar Pradesh" },
    { value: "17", label: "Bihar" },
    { value: "18", label: "Madhya Pradesh" },
    { value: "19", label: "West Bengal" },
    { value: "20", label: "Maharashtra" },
    { value: "21", label: "Karnataka" },
    { value: "22", label: "Tamil Nadu" },
    { value: "23", label: "Gujarat" },
    { value: "24", label: "Rajasthan" },
    { value: "25", label: "Haryana" }
  ];

  // Statistics calculation
  const stats = useMemo(() => {
    const total = districts.length;
    const byState = districts.reduce((acc, district) => {
      const stateId = district.city_id.toString();
      acc[stateId] = (acc[stateId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularState = Object.entries(byState).reduce((max, [stateId, count]) => {
      return count > max.count ? { stateId, count } : max;
    }, { stateId: "", count: 0 });

    const recentlyAdded = districts.filter(district => {
      if (!district.created_date) return false;
      const createdDate = new Date(district.created_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;
    
    return {
      total,
      uniqueStates: Object.keys(byState).length,
      mostPopularState: states.find(s => s.value === mostPopularState.stateId)?.label || "N/A",
      recentlyAdded
    };
  }, [districts, states]);

  // Filtered data
  const filteredDistricts = useMemo(() => {
    return districts.filter(district =>
      district.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.site_id.toString().includes(searchTerm) ||
      district.city_id.toString().includes(searchTerm) ||
      states.find(s => s.value === district.city_id.toString())?.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [districts, searchTerm, states]);

  const handleSave = async () => {
    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }

    if (!districtName.trim()) {
      toast.error("Please enter a district name");
      return;
    }

    try {
      if (editingDistrict) {
        // Update existing district
        await update(editingDistrict.id, {
          city_id: parseInt(selectedState),
          site_name: districtName.trim()
        });
        toast.success("District updated successfully!");
        setEditingDistrict(null);
      } else {
        // Create new district
        const maxSiteId = districts.length > 0 ? Math.max(...districts.map(d => d.site_id)) : 0;
        const newDistrict = {
          site_id: maxSiteId + 1,
          city_id: parseInt(selectedState),
          site_name: districtName.trim(),
          created_date: new Date().toLocaleDateString()
        };
        await create(newDistrict);
        toast.success("District added successfully!");
      }
      
      setSelectedState("");
      setDistrictName("");
    } catch (error) {
      toast.error(editingDistrict ? "Failed to update district" : "Failed to add district");
    }
  };

  const handleReset = () => {
    setSelectedState("");
    setDistrictName("");
    setEditingDistrict(null);
  };

  const handleEdit = (district: DistrictMaster) => {
    setEditingDistrict(district);
    setSelectedState(district.city_id.toString());
    setDistrictName(district.site_name);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this district?")) return;
    
    try {
      await deleteItem(id);
      toast.success("District deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete district");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading districts...</p>
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
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">District Master Management</h1>
              <p className="text-primary-foreground/80">Manage district data and administrative divisions</p>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Districts</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-xs text-blue-200 mt-1">Registered districts</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Unique States</p>
                  <p className="text-3xl font-bold">{stats.uniqueStates}</p>
                  <p className="text-xs text-green-200 mt-1">States covered</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Map className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Top State</p>
                  <p className="text-lg font-bold truncate">{stats.mostPopularState}</p>
                  <p className="text-xs text-purple-200 mt-1">Most districts</p>
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
                  <p className="text-orange-100 text-sm font-medium">Recent Additions</p>
                  <p className="text-3xl font-bold">{stats.recentlyAdded}</p>
                  <p className="text-xs text-orange-200 mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* District Master Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {editingDistrict ? 'Edit District Details' : 'District Registration Form'}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal">Manage district information and administrative divisions</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Administrative Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-primary/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Administrative Information</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select State */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Select State *
                    </label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="border-2 border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12">
                        <SelectValue placeholder="--Select State--" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            <div className="flex items-center gap-2">
                              <Map className="h-4 w-4 text-blue-500" />
                              {state.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">Choose the state for this district</div>
                  </div>

                  {/* District Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      District Name *
                    </label>
                    <Input
                      value={districtName}
                      onChange={(e) => setDistrictName(e.target.value)}
                      placeholder="Enter district name (e.g., Agra)"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                    <div className="text-xs text-muted-foreground">Enter the complete district name as per official records</div>
                  </div>
                </div>
              </div>

              {/* Submit and Reset Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                  size="lg"
                >
                  {editingDistrict ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update District
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add District
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
              <h3 className="text-lg font-semibold text-foreground">Search & Filter Districts</h3>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by district name, ID, state..."
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

        {/* District Master Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-foreground">
                  District Master Registry
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    Complete district database with {filteredDistricts.length} entries
                  </p>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    {filteredDistricts.length} of {districts.length} districts
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDistricts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-muted rounded-full">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      {searchTerm ? "No districts found" : "No districts available"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm 
                        ? "Try adjusting your search criteria" 
                        : "Start by adding your first district using the form above"}
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
                      <TableHead className="min-w-[120px] font-semibold text-foreground">Site ID</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">State</TableHead>
                      <TableHead className="min-w-[200px] font-semibold text-foreground">District Name</TableHead>
                      <TableHead className="min-w-[150px] font-semibold text-foreground">Created Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistricts.map((district, index) => (
                      <TableRow 
                        key={district.id} 
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(district)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit district"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(district.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete district"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-mono text-sm font-medium">{district.site_id}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-foreground">
                            {states.find(s => s.value === district.city_id.toString())?.label || "Unknown"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-foreground">{district.site_name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm text-muted-foreground">
                            {district.created_date || "N/A"}
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

export default DistrictMasterContent;