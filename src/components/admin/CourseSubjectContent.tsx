import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface CourseSubject {
  id: string;
  course_name: string;
  semester_year: string;
  subject: string;
  theory_marks: string;
  practical_marks: string;
  description?: string;
}

const CourseSubjectContent = () => {
  const {
    data: subjects,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<CourseSubject>({ tableName: 'course_subjects' });

  useAdminRealTime({
    tableName: 'course_subjects'
  });

  const [formData, setFormData] = useState({
    courseName: "",
    semesterYear: "",
    subject: "",
    theoryMarks: "",
    practicalMarks: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingSubject) {
      await handleUpdate();
      return;
    }

    if (!formData.courseName || !formData.semesterYear || !formData.subject) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!formData.theoryMarks || !formData.practicalMarks) {
      toast.error("Please enter theory and practical marks");
      return;
    }

    try {
      await create({
        course_name: formData.courseName,
        semester_year: formData.semesterYear,
        subject: formData.subject,
        theory_marks: formData.theoryMarks,
        practical_marks: formData.practicalMarks,
        description: formData.description || null
      });
      
      handleReset();
      toast.success("Course subject submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit course subject");
    }
  };

  const handleReset = () => {
    setFormData({
      courseName: "",
      semesterYear: "",
      subject: "",
      theoryMarks: "",
      practicalMarks: "",
      description: ""
    });
    setEditingSubject(null);
  };

  const [editingSubject, setEditingSubject] = useState<CourseSubject | null>(null);

  const handleEdit = (subject: CourseSubject) => {
    setEditingSubject(subject);
    setFormData({
      courseName: subject.course_name,
      semesterYear: subject.semester_year,
      subject: subject.subject,
      theoryMarks: subject.theory_marks,
      practicalMarks: subject.practical_marks,
      description: subject.description || ""
    });
  };

  const handleUpdate = async () => {
    if (!editingSubject) return;
    
    if (!formData.courseName || !formData.semesterYear || !formData.subject) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!formData.theoryMarks || !formData.practicalMarks) {
      toast.error("Please enter theory and practical marks");
      return;
    }

    try {
      await update(editingSubject.id, {
        course_name: formData.courseName,
        semester_year: formData.semesterYear,
        subject: formData.subject,
        theory_marks: formData.theoryMarks,
        practical_marks: formData.practicalMarks,
        description: formData.description || null
      });
      
      setEditingSubject(null);
      handleReset();
      toast.success("Course subject updated successfully!");
    } catch (error) {
      toast.error("Failed to update course subject");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course subject?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Course subject deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete course subject");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading course subjects...</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="p-8 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span>Course Subject Entry</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Course Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course Name *</label>
              <Select value={formData.courseName} onValueChange={(value) => handleInputChange('courseName', value)}>
                <SelectTrigger className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white">
                  <SelectValue placeholder="Select Course Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADCA">Advance Diploma In Computer Application(ADCA)</SelectItem>
                  <SelectItem value="DCA">Diploma in Computer Application (DCA)</SelectItem>
                  <SelectItem value="PGDCA">Post Graduate Diploma in Computer Application (PGDCA)</SelectItem>
                  <SelectItem value="DCHN">Diploma in Computer Hardware and Networking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Semester/Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Semester/Year *</label>
                <Input
                  value={formData.semesterYear}
                  onChange={(e) => handleInputChange('semesterYear', e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                  placeholder="Enter semester/year"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                  placeholder="Enter subject name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theory Marks */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Theory Marks *</label>
                <Input
                  value={formData.theoryMarks}
                  onChange={(e) => handleInputChange('theoryMarks', e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                  placeholder="Enter theory marks"
                />
              </div>

              {/* Practical Marks */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Practical Marks *</label>
                <Input
                  value={formData.practicalMarks}
                  onChange={(e) => handleInputChange('practicalMarks', e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                  placeholder="Enter practical marks"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white resize-none"
                placeholder="Enter description"
              />
            </div>

            {/* Submit and Reset Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingSubject ? "UPDATE" : "SUBMIT"}
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded shadow-lg hover:shadow-xl transition-all duration-200"
              >
                RESET
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Card */}
      <Card className="shadow-2xl border-2 border-gray-600 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-600">
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Actions</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Course Name</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Semester/Year</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Subject</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Theory Marks</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Practical Marks</TableHead>
                <TableHead className="border-2 border-gray-600 text-white font-bold text-center py-4">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow key={subject.id} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <TableCell className="border-2 border-gray-600 p-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(subject)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subject.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {subject.course_name}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {subject.semester_year}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {subject.subject}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {subject.theory_marks}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {subject.practical_marks}
                  </TableCell>
                  <TableCell className="border-2 border-gray-600 text-center p-4 text-gray-700 font-medium">
                    {subject.description || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSubjectContent;