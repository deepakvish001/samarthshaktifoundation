import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, Upload, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface VideoData {
  id: string;
  label: string;
  video_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

const VideoContent = () => {
  const {
    data: videos,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<VideoData>({ tableName: 'videos' });

  useAdminRealTime({
    tableName: 'videos'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !editingVideo) {
      toast.error("Please select a video file to upload");
      return;
    }

    if (!label.trim()) {
      toast.error("Please enter a label for the video");
      return;
    }

    try {
      if (editingVideo) {
        await update(editingVideo.id, {
          label: label,
          file_name: selectedFile ? selectedFile.name : editingVideo.file_name,
          file_size: selectedFile ? selectedFile.size : editingVideo.file_size,
          file_type: selectedFile ? selectedFile.type : editingVideo.file_type,
          video_url: editingVideo.video_url // Keep existing URL if no new file
        });
        toast.success("Video updated successfully!");
      } else {
        await create({
          label: label,
          file_name: selectedFile!.name,
          file_size: selectedFile!.size,
          file_type: selectedFile!.type,
          video_url: null // In a real app, you'd upload to storage and get URL
        });
        toast.success("Video uploaded successfully!");
      }

      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingVideo ? 'update' : 'upload'} video`);
    }
  };

  const handleEdit = (video: VideoData) => {
    setEditingVideo(video);
    setLabel(video.label);
    setSelectedFile(null);
  };

  const handleReset = () => {
    setEditingVideo(null);
    setSelectedFile(null);
    setLabel("");
    // Reset file input
    const fileInput = document.getElementById('video-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Video deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading videos...</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Upload Form Card */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span>{editingVideo ? 'Edit' : 'Add New'} Videos</span>
            </CardTitle>
            <p className="text-primary-foreground/80 mt-2">
              Upload and manage video content for your platform
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span>File Selection</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="h-12 px-6 border-2 border-border hover:border-primary/30 hover:bg-primary/5 font-medium transition-all duration-200"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Video File
                  </Button>
                </div>
                <span className="text-muted-foreground font-medium">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>

            {/* Label Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>Video Information</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Video Label *
                </label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background"
                  placeholder="Enter descriptive video label"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex space-x-4">
              <Button
                onClick={handleUpload}
                className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Upload className="h-5 w-5 mr-2" />
                {editingVideo ? 'Update Video' : 'Upload Video'}
              </Button>
              
              {editingVideo && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive px-6 transition-all duration-200"
                >
                  Cancel Edit
                </Button>
              )}
            </div>

            {/* File Information Display */}
            {selectedFile && (
              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 mt-6">
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Selected Video Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-background rounded-md p-3 border border-border">
                    <span className="font-medium text-muted-foreground">Name:</span>
                    <p className="text-foreground font-semibold mt-1">{selectedFile.name}</p>
                  </div>
                  <div className="bg-background rounded-md p-3 border border-border">
                    <span className="font-medium text-muted-foreground">Size:</span>
                    <p className="text-foreground font-semibold mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <div className="bg-background rounded-md p-3 border border-border">
                    <span className="font-medium text-muted-foreground">Type:</span>
                    <p className="text-foreground font-semibold mt-1">{selectedFile.type}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Videos Table Card */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6">
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span>Uploaded Videos</span>
            </CardTitle>
            <p className="text-primary-foreground/80 mt-1">
              Manage your video library
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary border-b-2 border-primary">
                  <TableHead className="border-r-2 border-primary/30 text-primary-foreground font-bold text-center py-4 min-w-[120px]">Actions</TableHead>
                  <TableHead className="border-r-2 border-primary/30 text-primary-foreground font-bold text-center py-4">Label</TableHead>
                  <TableHead className="border-r-2 border-primary/30 text-primary-foreground font-bold text-center py-4">File Name</TableHead>
                  <TableHead className="border-r-2 border-primary/30 text-primary-foreground font-bold text-center py-4">Size</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video, index) => (
                  <TableRow 
                    key={video.id} 
                    className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-primary/5 transition-colors border-b border-border`}
                  >
                    <TableCell className="border-r border-border p-4">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(video)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 rounded-md transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(video.id)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-2 rounded-md transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-border text-center p-4 font-semibold text-foreground">
                      {video.label}
                    </TableCell>
                    <TableCell className="border-r border-border text-center p-4 text-muted-foreground font-medium">
                      {video.file_name || "N/A"}
                    </TableCell>
                    <TableCell className="border-r border-border text-center p-4 text-muted-foreground font-medium">
                      {video.file_size ? `${(video.file_size / (1024 * 1024)).toFixed(2)} MB` : "N/A"}
                    </TableCell>
                    <TableCell className="text-center p-4 text-muted-foreground font-medium">
                      {video.file_type || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
                {videos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center space-y-2">
                        <Video className="h-8 w-8 text-muted-foreground/50" />
                        <span>No videos uploaded yet</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoContent;