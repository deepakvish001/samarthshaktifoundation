import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Filter, FileText, Calendar, Image as ImageIcon, Users, Upload } from "lucide-react";

const FranchiseDataContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [formData, setFormData] = useState({
    titleOfData: "",
    detailsOfData: "",
    detailsOfFranchise: "",
    photoFile: null as File | null,
    dateOfPublish: ""
  });

  const franchiseData = [
    {
      id: "1",
      title: "Fees Chart",
      details: "Fee structure details for franchise operations",
      date: "31/05/2018",
      category: "financial",
      file: true,
      franchise: "Downtown Center"
    },
    {
      id: "2", 
      title: "Training Manual",
      details: "Comprehensive training guide for new franchisees",
      date: "15/06/2023",
      category: "training",
      file: true,
      franchise: "Mall Location"
    },
    {
      id: "3",
      title: "Marketing Guidelines", 
      details: "Brand guidelines and marketing strategies",
      date: "20/07/2023",
      category: "marketing",
      file: false,
      franchise: "Suburban Branch"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, photoFile: file }));
  };

  const handleSubmit = () => {
    console.log("Submitting franchise data:", formData);
    // Reset form
    setFormData({ titleOfData: "", detailsOfData: "", detailsOfFranchise: "", photoFile: null, dateOfPublish: "" });
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = franchiseData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    return filtered;
  }, [searchTerm, filterCategory]);

  const franchiseCategories = [
    "financial",
    "training", 
    "marketing",
    "operations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <span>Franchise Data Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{franchiseData.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold">
                    {franchiseData.filter(item => {
                      const itemDate = new Date(item.date);
                      const currentMonth = new Date().getMonth();
                      return itemDate.getMonth() === currentMonth;
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">With Files</p>
                  <p className="text-3xl font-bold">
                    {franchiseData.filter(item => item.file).length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <ImageIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Filtered Results</p>
                  <p className="text-3xl font-bold text-foreground">{filteredData.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Filter className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <span>Add New Franchise Data</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Of Data */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title Of Data*</label>
                <Input
                  value={formData.titleOfData}
                  onChange={(e) => handleInputChange('titleOfData', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter title of the data"
                />
              </div>

              {/* Franchise Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Details of Franchise*</label>
                <Select value={formData.detailsOfFranchise} onValueChange={(value) => handleInputChange('detailsOfFranchise', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select franchise" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="downtown" className="hover:bg-accent/50">Downtown Center</SelectItem>
                    <SelectItem value="mall" className="hover:bg-accent/50">Mall Location</SelectItem>
                    <SelectItem value="suburban" className="hover:bg-accent/50">Suburban Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Details of Data */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Details of Data*</label>
                <Textarea
                  value={formData.detailsOfData}
                  onChange={(e) => handleInputChange('detailsOfData', e.target.value)}
                  className="min-h-[100px] border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                  placeholder="Enter detailed description of the franchise data"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Documents</label>
                <div className="border border-border/40 rounded-lg p-4 bg-background">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="*/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="border-border/40 hover:bg-accent/20">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {formData.photoFile ? formData.photoFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date of Publish */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Publish</label>
                <Input
                  type="date"
                  value={formData.dateOfPublish}
                  onChange={(e) => handleInputChange('dateOfPublish', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                Submit Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Categories</SelectItem>
                    {franchiseCategories.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-accent/50">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <span>Franchise Data Records ({filteredData.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {franchiseData.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Edit className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Title
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[300px]">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Details
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Category
                        </div>
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        <div className="flex items-center justify-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          File
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr 
                        key={item.id}
                        className={`${
                          index % 2 === 0 
                            ? 'bg-background/80' 
                            : 'bg-accent/20'
                        } hover:bg-accent/30 transition-all duration-200 border-b border-border/30`}
                      >
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="font-semibold text-foreground">{item.title}</div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-muted-foreground text-sm leading-relaxed">
                            {item.details}
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-muted-foreground text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <Badge 
                            variant="secondary" 
                            className="bg-primary/10 text-primary hover:bg-primary/20 capitalize font-medium"
                          >
                            {item.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.file ? (
                            <Badge className="bg-accent/20 text-accent-foreground border border-accent/30 hover:bg-accent/30">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground border-border/50">
                              No
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredData.length === 0 && (
                  <div className="text-center py-12 bg-background/50">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No franchise data found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || filterCategory !== "all" 
                        ? "Try adjusting your search or filter criteria"
                        : "Start by adding your first franchise data record"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FranchiseDataContent;