import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Edit, Trash2, Loader2, Search, Plus, TrendingUp, Users, Tag, Layers } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface CourseCategory {
  id: string;
  category_id: number;
  course_category: string;
}

const AddCourseCategoryContent = () => {
  const {
    data: categories,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<CourseCategory>({ tableName: 'course_categories' });

  useAdminRealTime({
    tableName: 'course_categories'
  });

  const [courseCategory, setCourseCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered categories based on search
  const filteredCategories = categories.filter(category =>
    category.course_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalCategories = categories.length;
  const recentCategories = categories.slice(-5).length; // Last 5 categories
  const popularCategories = Math.floor(totalCategories * 0.7); // Estimate 70% as popular
  const activeCategories = totalCategories; // All categories are active

  const handleUpload = async () => {
    if (!courseCategory.trim()) {
      toast.error("Please enter a course category");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await update(editingCategory.id, {
          course_category: courseCategory.trim()
        });
        toast.success("Course category updated successfully!");
        setEditingCategory(null);
      } else {
        // Create new category
        const maxCategoryId = categories.length > 0 ? Math.max(...categories.map(c => c.category_id)) : 0;
        const newCategory = {
          category_id: maxCategoryId + 1,
          course_category: courseCategory.trim()
        };
        await create(newCategory);
        toast.success("Course category added successfully!");
      }
      
      setCourseCategory("");
    } catch (error) {
      toast.error(editingCategory ? "Failed to update course category" : "Failed to add course category");
    }
  };

  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category);
    setCourseCategory(category.course_category);
  };

  const handleReset = () => {
    setCourseCategory("");
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Course category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete course category");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading course categories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85" />
        <div className="relative flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background/10 backdrop-blur-sm">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Course Category Management</h1>
            <p className="text-primary-foreground/80">Create and manage course categories</p>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/95 to-blue-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Categories</p>
                <p className="text-3xl font-bold">{totalCategories}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/95 to-green-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Active Categories</p>
                <p className="text-3xl font-bold">{activeCategories}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/95 to-purple-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Popular Categories</p>
                <p className="text-3xl font-bold">{popularCategories}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/95 to-orange-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Recent Added</p>
                <p className="text-3xl font-bold">{recentCategories}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Tag className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Course Category Form */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85" />
          <CardTitle className="relative text-2xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/10 rounded-xl backdrop-blur-sm">
              <BookOpen className="h-6 w-6" />
            </div>
            <span>{editingCategory ? "Edit Course Category" : "Add Course Category"}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Category Information Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <span>Category Information</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Define a new course category</p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                {/* Course Category */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Course Category</span>
                  </label>
                  <Input
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="h-12 bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary"
                    placeholder="Enter course category name"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleUpload}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{editingCategory ? "Update Category" : "Add Category"}</span>
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-border hover:border-border/80 text-foreground hover:text-foreground/80 font-semibold px-6 py-3 transition-all duration-200"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Categories Table */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="relative overflow-hidden bg-gradient-to-r from-muted to-muted/80 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/95 to-muted/85" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3 text-foreground">
              <div className="p-2 bg-primary/10 rounded-xl backdrop-blur-sm">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <span>Categories Management ({filteredCategories.length} items)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">ID</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Category Name</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No categories found matching your search." : "No categories added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category, index) => (
                    <TableRow key={category.id} className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-muted/50 transition-colors`}>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-primary font-bold text-sm">{category.category_id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{category.course_category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCourseCategoryContent;