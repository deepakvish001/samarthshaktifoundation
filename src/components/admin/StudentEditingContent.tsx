import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const StudentEditingContent = () => {
  const studentData = [
    {
      id: 1,
      applicantName: "Mr./Vivek",
      fatherName: "Mr./ggggig",
      mother: "Mrs./gytytgfgff",
      gender: "Male",
      dob: "03/05/1990",
      category: "NULL",
      occupation: "NULL",
      phoneStd: "+918840908715",
      mobile: "+918840908715",
      email: "technical@gmail.com",
      address: "Hardoi",
      cityName: "Hardoi",
      state: "Uttar Pradesh",
      district: "Hardoi",
      pincode: "221090",
      qualification: "B.A.",
      passingYear: "2009",
      appliedAs: "Student",
      courseCategory: "Computer Course",
      courseName: "Diploma in Computer Application (DCA)",
      courseFees: "14500",
      franchiseCenterName: "Institute of Computer Training Centre, Numaish Chauraha, Hardoi",
      franchiseId: "UP/HDI/ICTC/0002",
      aadharNumber: "543456456646565",
      photo: "~/Offer_pic/P.jpg",
      signature: "~/Offer_pic/S.jpg",
      thumbImpression: "~/Offer_pic/T.jpg",
      studentId: "TCI/HDI/ADCA/1",
      studentPassword: "58741",
      approve: false,
      status: "NULL",
      payment: "NULL"
    },
    {
      id: 2,
      applicantName: "Mr./VIVEK YADAV",
      fatherName: "Mr./NA",
      mother: "Mrs./NA",
      gender: "Male",
      dob: "12/07/2020",
      category: "General/सामान्य",
      occupation: "20/10/1997",
      phoneStd: "",
      mobile: "+919690283407",
      email: "AS@GMAIL.COM",
      address: "LUCKNOW",
      cityName: "LUCKNOW",
      state: "UP",
      district: "Azamgarh",
      pincode: "223223",
      qualification: "Other",
      passingYear: "2029",
      appliedAs: "12 Month",
      courseCategory: "",
      courseName: "Diploma in Computer Application",
      courseFees: "6000",
      franchiseCenterName: "Ravi Kumar Gupta",
      franchiseId: "SM11101",
      aadharNumber: "354564653434565",
      photo: "~/Offer_pic/599-5990202_rm-clipart copy.jpg",
      signature: "",
      thumbImpression: "",
      studentId: "",
      studentPassword: "",
      approve: false,
      status: "",
      payment: ""
    },
    {
      id: 3,
      applicantName: "Mr./ Aurangzeb Ahmad",
      fatherName: "Mr./ Ajaj Ahmad",
      mother: "Mrs./ Farzana",
      gender: "Male",
      dob: "09/07/1998",
      category: "General/सामान्य",
      occupation: "20/09/2020",
      phoneStd: "",
      mobile: "+919794224055",
      email: "sr920111@gmail.com",
      address: "bachhuapar",
      cityName: "azamgarh",
      state: "Uttar Pradesh",
      district: "",
      pincode: "276141",
      qualification: "10th Pass",
      passingYear: "2010",
      appliedAs: "",
      courseCategory: "",
      courseName: "Diploma in Computer Hardware and Networking",
      courseFees: "15000",
      franchiseCenterName: "",
      franchiseId: "SM11101",
      aadharNumber: "539177029237",
      photo: "~/Offer_pic/",
      signature: "~/Offer_pic/",
      thumbImpression: "~/Offer_pic/",
      studentId: "",
      studentPassword: "",
      approve: false,
      status: "",
      payment: ""
    },
    {
      id: 4,
      applicantName: "Mr./VIVEK YADAV",
      fatherName: "Mr./NA",
      mother: "Mrs./NA",
      gender: "Male",
      dob: "12/07/2020",
      category: "Other Backward Class/अन्य पिछडा वर्ग",
      occupation: "20/10/1997",
      phoneStd: "",
      mobile: "+919690283407",
      email: "AS@GMAIL.COM",
      address: "LUCKNOW",
      cityName: "LUCKNOW",
      state: "UP",
      district: "Azamgarh",
      pincode: "223223",
      qualification: "Other",
      passingYear: "2029",
      appliedAs: "12 Month",
      courseCategory: "",
      courseName: "Diploma in Computer Application",
      courseFees: "6000",
      franchiseCenterName: "Ravi Kumar Gupta",
      franchiseId: "SM11101",
      aadharNumber: "354564653434565",
      photo: "~/Offer_pic/599-5990202_rm-clipart copy.jpg",
      signature: "",
      thumbImpression: "",
      studentId: "",
      studentPassword: "",
      approve: false,
      status: "",
      payment: ""
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Editing - Complete Information</h2>
        <p className="text-slate-600">Comprehensive view of all student data in one table</p>
      </div>
      
      {/* Complete Student Information Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-400 bg-white shadow-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">id</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[150px]">applicant_name</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">father_name</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">mother</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">gender</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[100px]">dob</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">category</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[100px]">occupation</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">phone_std</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[130px]">mobile</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[150px]">email</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">address</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[100px]">city_name</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">state</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">district</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">pincode</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">qualification</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[100px]">passing_year</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[100px]">applied_as</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[130px]">course_category</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[200px]">course_name</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[100px]">course_fees</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[200px]">franchise_center_name</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[150px]">franchise_id</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[150px]">aadhar_number</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[150px]">photo</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">signature</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[130px]">thumb_impression</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[120px]">student_id</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[130px]">student_password</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">Approve</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">status</th>
              <th className="border-2 border-gray-400 px-2 py-3 text-left font-semibold text-xs min-w-[80px]">payment</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <Edit className="h-3 w-3 text-blue-600" />
                    </Button>
                    <span className="font-medium">Edit {student.id}</span>
                  </div>
                </td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.applicantName}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.fatherName}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.mother}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.gender}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.dob}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.category}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.occupation}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.phoneStd}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.mobile}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.email}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.address}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.cityName}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.state}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.district}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.pincode}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.qualification}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.passingYear}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.appliedAs}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.courseCategory}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.courseName}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.courseFees}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.franchiseCenterName}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.franchiseId}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.aadharNumber}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.photo}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.signature}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.thumbImpression}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.studentId}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.studentPassword}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs text-center">
                  <Checkbox checked={student.approve} />
                </td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.status}</td>
                <td className="border-2 border-gray-400 px-2 py-3 text-xs font-medium">{student.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEditingContent;