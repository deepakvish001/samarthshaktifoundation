import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Upload, Trash2, Loader2, Search, TrendingUp, Calendar, BarChart3, Eye, Camera, Download, Edit, Star, Plus, ImageIcon, Users, Zap, Award, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface PhotoGallery {
  id: string;
  title: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

const PhotoGalleryContent = () => {
  const {
    data: galleryItems,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<PhotoGallery>({ tableName: 'photo_gallery' });

  useAdminRealTime({
    tableName: 'photo_gallery'
  });

  const [formData, setFormData] = useState({
    title: "",
    photo: null as File | null
  });
  const [editingItem, setEditingItem] = useState<PhotoGallery | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Statistics calculation
  const stats = useMemo(() => {
    const total = galleryItems.length;
    const withImages = galleryItems.filter(item => item.image_url).length;
    const withoutImages = total - withImages;
    const thisMonth = galleryItems.filter(item => {
      if (!item.created_at) return false;
      const itemDate = new Date(item.created_at);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
    
    return {
      total,
      withImages,
      withoutImages,
      thisMonth
    };
  }, [galleryItems]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = galleryItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [galleryItems, searchTerm, sortBy]);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('photo', file);
    }
  };

  const handleUpload = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const imageUrl = formData.photo ? URL.createObjectURL(formData.photo) : "";

    const newGalleryItem = {
      title: formData.title,
      image_url: imageUrl
    };

    try {
      await create(newGalleryItem);
      
      // Reset form
      setFormData({
        title: "",
        photo: null
      });

      // Reset file input
      const fileInput = document.getElementById('gallery-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success("Photo uploaded to gallery successfully!");
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Photo deleted from gallery successfully!");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading photo gallery...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Photos</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Gallery collection</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl">
                <Camera className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">With Images</p>
                <p className="text-3xl font-bold text-green-600">{stats.withImages}</p>
                <p className="text-xs text-muted-foreground mt-1">Ready to view</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
                <p className="text-3xl font-bold text-orange-600">{stats.thisMonth}</p>
                <p className="text-xs text-muted-foreground mt-1">Recent uploads</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Search Results</p>
                <p className="text-3xl font-bold text-blue-600">{filteredData.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Current filter</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Photo To Gallery Form */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Camera className="h-6 w-6 text-white" />
              </div>
              {editingItem ? 'Edit Photo' : 'Add Photo To Gallery'}
              {editingItem && (
                <Badge className="ml-auto bg-white/20 text-white border border-white/30">
                  Editing Mode
                </Badge>
              )}
            </CardTitle>
            <p className="text-primary-foreground/80 mt-2">
              Upload and manage gallery photos
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Photo Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <ImageIcon className="h-4 w-4" />
                <span>Photo Information</span>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Photo Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter descriptive photo title"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <Upload className="h-4 w-4" />
                <span>Photo Upload</span>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/20 hover:border-primary/50 transition-all duration-200">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <input
                      id="gallery-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      className="h-12 px-8 border-2 border-border hover:border-primary/30 hover:bg-primary/5 font-semibold transition-all duration-200"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Choose Photo
                    </Button>
                  </div>
                  
                  {formData.photo ? (
                    <div className="flex items-center gap-3 bg-background rounded-lg p-4 border border-border shadow-sm w-full max-w-md">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {formData.photo.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.photo.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-300 bg-green-50">
                        Ready
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                        <Camera className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Drop your photo here or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF, WEBP</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    JPG
                  </Badge>
                  <Badge variant="outline" className="text-xs text-pink-600 border-pink-200 bg-pink-50">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    PNG
                  </Badge>
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    GIF
                  </Badge>
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    WEBP
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button
                onClick={() => {
                  setFormData({ title: "", photo: null });
                  setEditingItem(null);
                  const fileInput = document.getElementById('gallery-file') as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
                variant="outline"
                className="h-12 border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Form
              </Button>
              <Button
                onClick={handleUpload}
                className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Upload className="h-5 w-5 mr-2" />
                {editingItem ? "Update Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card className="shadow-lg border border-border bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search photos by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 border-border hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
            <div className="w-full lg:w-64">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-2 border-border hover:border-primary focus:border-primary">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest" className="hover:bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest" className="hover:bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Oldest First
                    </div>
                  </SelectItem>
                  <SelectItem value="title" className="hover:bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      By Title
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery Table */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <span>Photo Gallery Collection</span>
            </CardTitle>
            <p className="text-primary-foreground/80 mt-1">
              {filteredData.length} photo{filteredData.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No photos found</p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                {searchTerm ? "Try adjusting your search criteria" : "Add your first photo to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary border-b-2 border-primary">
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4 min-w-[120px]">Actions</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Photo</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Title</TableHead>
                    <TableHead className="border-r border-primary/30 text-primary-foreground font-bold text-center py-4">Status</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center py-4">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-primary/5 transition-colors border-b border-border`}
                    >
                      <TableCell className="border-r border-border p-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-md transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        {item.image_url ? (
                          <div className="flex justify-center">
                            <img 
                              src={item.image_url} 
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg border border-border shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-muted rounded-lg border border-border flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="border-r border-border p-4">
                        <span className="font-semibold text-foreground">{item.title}</span>
                      </TableCell>
                      <TableCell className="border-r border-border p-4 text-center">
                        {item.image_url ? (
                          <Badge className="bg-green-500/10 text-green-700 border border-green-200">
                            <Eye className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            No Image
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {item.created_at 
                              ? new Date(item.created_at).toLocaleDateString()
                              : "Unknown"
                            }
                          </span>
                        </div>
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
  );
};

export default PhotoGalleryContent;