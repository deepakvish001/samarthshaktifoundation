import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Edit, Trash2, Loader2, Upload, Search, Calendar, TrendingUp, Users, FileText, Image } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface CompetitionCourse {
  id: string;
  title: string;
  description: string;
  date: string;
  file?: string;
}

const AddCompetitionCoursesContent = () => {
  const {
    data: competitions,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<CompetitionCourse>({ tableName: 'competition_courses' });

  useAdminRealTime({
    tableName: 'competition_courses'
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered competitions based on search
  const filteredCompetitions = competitions.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalEvents = competitions.length;
  const recentEvents = competitions.filter(item => {
    const eventDate = new Date(item.date);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return eventDate >= threeDaysAgo;
  }).length;
  const upcomingEvents = competitions.filter(item => {
    const eventDate = new Date(item.date);
    const today = new Date();
    return eventDate >= today;
  }).length;
  const eventsWithFiles = competitions.filter(item => item.file).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!date.trim()) {
      toast.error("Please enter a date");
      return;
    }

    const competitionData = {
      title,
      description,
      date,
      file: selectedImage ? selectedImage.name : undefined
    };

    try {
      if (editingId) {
        await update(editingId, competitionData);
        toast.success("Competition course updated successfully!");
        setEditingId(null);
      } else {
        await create(competitionData);
        toast.success("Competition course added successfully!");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setSelectedImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('competitionImageInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error(editingId ? "Failed to update competition course" : "Failed to add competition course");
    }
  };

  const handleEdit = (competition: CompetitionCourse) => {
    setTitle(competition.title);
    setDescription(competition.description);
    setDate(competition.date);
    setEditingId(competition.id);
    setSelectedImage(null);
  };

  const handleCancelEdit = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setSelectedImage(null);
    setEditingId(null);
    
    // Reset file input
    const fileInput = document.getElementById('competitionImageInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Competition course deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete competition course");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading competition courses...</p>
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
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">News & Events Management</h1>
            <p className="text-primary-foreground/80">Create and manage competition courses and events</p>
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
                <p className="text-white/80 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold">{totalEvents}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Trophy className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/95 to-green-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Upcoming Events</p>
                <p className="text-3xl font-bold">{upcomingEvents}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/95 to-purple-600/95" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Recent Events</p>
                <p className="text-3xl font-bold">{recentEvents}</p>
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
                <p className="text-white/80 text-sm font-medium">With Files</p>
                <p className="text-3xl font-bold">{eventsWithFiles}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Competition Courses Form */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85" />
          <CardTitle className="relative text-2xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/10 rounded-xl backdrop-blur-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <span>{editingId ? "Edit News & Event" : "Add News & Event"}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Event Information Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Event Information</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Enter the details of your event or competition course</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Event Title</span>
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-12 bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary"
                      placeholder="Enter event title"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <Edit className="h-4 w-4 text-primary" />
                      <span>Event Description</span>
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px] bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary resize-vertical"
                      placeholder="Enter event description"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Event Date</span>
                    </label>
                    <Input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary"
                      placeholder="Select event date"
                      type="date"
                    />
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <Upload className="h-4 w-4 text-primary" />
                      <span>Upload Event Image</span>
                    </label>
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5 hover:bg-primary/10 transition-colors backdrop-blur-sm">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                        <input
                          id="competitionImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="competitionImageInput"
                          className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                        >
                          Click to upload image
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        {selectedImage && (
                          <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">
                              ✓ {selectedImage.name}
                            </p>
                          </div>
                        )}
                        {!selectedImage && (
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

          {/* Submit and Cancel Buttons */}
          <div className="flex space-x-4 pt-8 border-t border-border">
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>{editingId ? "Update Event" : "Create Event"}</span>
            </Button>
            {editingId && (
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="border-border hover:border-border/80 text-foreground hover:text-foreground/80 font-semibold px-8 py-3 transition-all duration-200 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Cancel Edit</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Events Table */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="relative overflow-hidden bg-gradient-to-r from-muted to-muted/80 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/95 to-muted/85" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3 text-foreground">
              <div className="p-2 bg-primary/10 rounded-xl backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <span>Events Management ({filteredCompetitions.length} items)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
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
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Title</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Description</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Date</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Image</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No events found matching your search." : "No events added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompetitions.map((item, index) => (
                    <TableRow key={item.id} className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-muted/50 transition-colors`}>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="font-medium text-foreground max-w-xs mx-auto">
                          {item.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="text-muted-foreground max-w-sm mx-auto truncate">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground text-sm">{item.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex justify-center">
                          {item.file ? (
                            <div className="w-10 h-10 bg-green-500/10 border-2 border-green-500/20 rounded-lg flex items-center justify-center">
                              <Image className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-muted border-2 border-border rounded-lg flex items-center justify-center">
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
                            onClick={() => handleEdit(item)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                            title="Delete event"
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

export default AddCompetitionCoursesContent;