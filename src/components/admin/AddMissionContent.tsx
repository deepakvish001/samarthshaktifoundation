import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, Edit, Trash2, Loader2, Search, Upload, TrendingUp, Users, FileText, Image } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface Mission {
  id: string;
  content: string;
  image?: string;
}

const AddMissionContent = () => {
  const {
    data: missions,
    loading,
    create,
    update,
    delete: deleteItem
  } = useOptimisticCrud<Mission>({ tableName: 'missions' });

  useAdminRealTime({
    tableName: 'missions'
  });

  const [content, setContent] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered missions based on search
  const filteredMissions = missions.filter(mission =>
    mission.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalMissions = missions.length;
  const missionsWithImages = missions.filter(mission => mission.image && mission.image !== "No image").length;
  const recentMissions = missions.slice(-3).length; // Last 3 missions
  const activeMissions = totalMissions; // All missions are active

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  const handleUpload = async () => {
    if (!content.trim()) {
      toast.error("Please enter mission content");
      return;
    }

    try {
      if (editingMission) {
        // Update existing mission
        await update(editingMission.id, {
          content: content.trim(),
          image: selectedPhoto ? selectedPhoto.name : editingMission.image
        });
        toast.success("Mission updated successfully!");
        setEditingMission(null);
      } else {
        // Create new mission
        const newMission = {
          content: content.trim(),
          image: selectedPhoto ? selectedPhoto.name : "No image"
        };
        await create(newMission);
        toast.success("Mission added successfully!");
      }
      
      setContent("");
      setSelectedPhoto(null);
      // Reset file input
      const fileInput = document.getElementById('missionPhotoInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error(editingMission ? "Failed to update mission" : "Failed to add mission");
    }
  };

  const handleEdit = (mission: Mission) => {
    setEditingMission(mission);
    setContent(mission.content);
    setSelectedPhoto(null); // Reset photo selection
  };

  const handleReset = () => {
    setContent("");
    setSelectedPhoto(null);
    setEditingMission(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Mission deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete mission");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading missions...</p>
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
            <Target className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Mission Management</h1>
            <p className="text-primary-foreground/80">Create and manage organizational mission statements</p>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/95 to-orange-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Missions</p>
                <p className="text-3xl font-bold">{totalMissions}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/95 to-blue-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Active Missions</p>
                <p className="text-3xl font-bold">{activeMissions}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/95 to-purple-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">With Images</p>
                <p className="text-3xl font-bold">{missionsWithImages}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Image className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/95 to-green-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Recent Added</p>
                <p className="text-3xl font-bold">{recentMissions}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Mission Form */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85" />
          <CardTitle className="relative text-2xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/10 rounded-xl backdrop-blur-sm">
              <Target className="h-6 w-6" />
            </div>
            <span>{editingMission ? "Edit Mission" : "Add Our Mission"}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Mission Information Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Mission Statement</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Define your organization's mission and purpose</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content Input */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Mission Content</span>
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary resize-vertical"
                      placeholder="Enter our organization's mission statement..."
                    />
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <Upload className="h-4 w-4 text-primary" />
                      <span>Mission Image</span>
                    </label>
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5 hover:bg-primary/10 transition-colors backdrop-blur-sm">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                        <input
                          id="missionPhotoInput"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="missionPhotoInput"
                          className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                        >
                          Click to upload mission image
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        {selectedPhoto && (
                          <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <p className="text-sm text-orange-600 font-medium">
                              ✓ {selectedPhoto.name}
                            </p>
                          </div>
                        )}
                        {!selectedPhoto && (
                          <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm text-muted-foreground">No file chosen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-8 border-t border-border">
            <Button
              onClick={handleUpload}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>{editingMission ? "Update Mission" : "Add Mission"}</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border hover:border-border/80 text-foreground hover:text-foreground/80 font-semibold px-8 py-3 transition-all duration-200 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset Form</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Mission Table */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="relative overflow-hidden bg-gradient-to-r from-muted to-muted/80 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/95 to-muted/85" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3 text-foreground">
              <div className="p-2 bg-primary/10 rounded-xl backdrop-blur-sm">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span>Missions Management ({filteredMissions.length} items)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search missions..."
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
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Mission Content</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Image</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No missions found matching your search." : "No missions added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMissions.map((mission, index) => (
                    <TableRow key={mission.id} className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-muted/50 transition-colors`}>
                      <TableCell className="p-4 border-r border-border/50">
                        <div className="text-foreground max-w-md">
                          {mission.content}
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex justify-center">
                          {mission.image && mission.image !== "No image" ? (
                            <div className="w-12 h-10 bg-orange-500/10 border-2 border-orange-500/20 rounded-lg flex items-center justify-center">
                              <Image className="h-4 w-4 text-orange-600" />
                            </div>
                          ) : (
                            <div className="w-12 h-10 bg-muted border-2 border-border rounded-lg flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(mission)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(mission.id)}
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

export default AddMissionContent;