import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Home, User, Building, Users, GraduationCap, Award, Clock, DollarSign, Crown, FileText, CreditCard, LogOut, Mail, Calendar, ChevronLeft, ChevronRight, Send, Star, Settings, Bell, Menu, Minimize2, X, ChevronDown, Key, Video, Building2, Image, MapPin, Map, BookOpen, Newspaper, FolderPlus, Eye, Target, MessageSquare, Phone, HelpCircle, UserPlus, UserCheck, Database, Shield, CheckCircle, Printer, FileOutput, Upload, Hash, FileCheck, Edit, BarChart, Receipt, Wallet, PlusCircle, Book, Scale, Calculator, ArrowLeft } from "lucide-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NewDashboardContent from "@/components/admin/NewDashboardContent";
import DashboardContent from "@/components/admin/DashboardContent";
import EditProfileContent from "@/components/admin/EditProfileContent";
import ChangePasswordContent from "@/components/admin/ChangePasswordContent";
import VideoContent from "@/components/admin/VideoContent";
import HeadOfficeContent from "@/components/admin/HeadOfficeContent";
import MenuContentContent from "@/components/admin/MenuContentContent";
import PhotoGalleryContent from "@/components/admin/PhotoGalleryContent";
import BankDetailsContent from "@/components/admin/BankDetailsContent";
import EmployeeMasterContent from "@/components/admin/EmployeeMasterContent";
import StateMasterContent from "@/components/admin/StateMasterContent";
import DistrictMasterContent from "@/components/admin/DistrictMasterContent";
import CourseMasterContent from "@/components/admin/CourseMasterContent";
import AddNewsContent from "@/components/admin/AddNewsContent";
import AddCourseCategoryContent from "@/components/admin/AddCourseCategoryContent";
import AddCompetitionCoursesContent from "@/components/admin/AddCompetitionCoursesContent";
import AddVisionContent from "@/components/admin/AddVisionContent";
import AddMissionContent from "@/components/admin/AddMissionContent";
import AddDirectorMessageContent from "@/components/admin/AddDirectorMessageContent";
import EnquiryContent from "@/components/admin/EnquiryContent";
import ContactUsContent from "@/components/admin/ContactUsContent";
import StudentRegistrationContent from "@/components/admin/StudentRegistrationContent";
import StudentApprovalContent from "@/components/admin/StudentApprovalContent";
import StudentManagementContent from "@/components/admin/StudentManagementContent";
import SearchByStudentDataContent from "@/components/admin/SearchByStudentDataContent";
import StudentVerificationContent from "@/components/admin/StudentVerificationContent";
import VerificationContent from "@/components/admin/VerificationContent";
import VerificationReportContent from "@/components/admin/VerificationReportContent";
import StudentDataContent from "@/components/admin/StudentDataContent";
import StudentRegPrintContent from "@/components/admin/StudentRegPrintContent";
import MakeStudentAdmitCardContent from "@/components/admin/MakeStudentAdmitCardContent";
import StudentAdmitCardReportContent from "@/components/admin/StudentAdmitCardReportContent";
import GenerateStudentAdmitCardContent from "@/components/admin/GenerateStudentAdmitCardContent";
import UploadStudentContentContent from "@/components/admin/UploadStudentContentContent";
import CourseSubjectContent from "@/components/admin/CourseSubjectContent";
import AlotNumberContent from "@/components/admin/AlotNumberContent";
import ReadyMarksheetContent from "@/components/admin/ReadyMarksheetContent";
import ReportContent from "@/components/admin/ReportContent";
import EditCRTContent from "@/components/admin/EditCRTContent";
import StudentMarksheetContent from "@/components/admin/StudentMarksheetContent";
import StudentAttendanceContent from "@/components/admin/StudentAttendanceContent";
import StudentAttendanceReportContent from "@/components/admin/StudentAttendanceReportContent";
import ClassFeesContent from "@/components/admin/ClassFeesContent";
import FeesReportContent from "@/components/admin/FeesReportContent";
import FeesManagementContent from "@/components/admin/FeesManagementContent";
import FeesPrintContent from "@/components/admin/FeesPrintContent";
import ExpenseMasterContent from "@/components/admin/ExpenseMasterContent";
import ExpenseEntryContent from "@/components/admin/ExpenseEntryContent";
import DayBookContent from "@/components/admin/DayBookContent";
import OpeningBalanceContent from "@/components/admin/OpeningBalanceContent";
import BalanceSheetContent from "@/components/admin/BalanceSheetContent";
import FranchiseRegistrationContent from "@/components/admin/FranchiseRegistrationContent";
import FranchiseManagementContent from "@/components/admin/FranchiseManagementContent";
import FranchiseApprovalContent from "@/components/admin/FranchiseApprovalContent";
import FranchiseDataContent from "@/components/admin/FranchiseDataContent";
import FranchiseRegPrintContent from "@/components/admin/FranchiseRegPrintContent";
import FranchiseUploadContent from "@/components/admin/FranchiseUploadContent";
import ViewFranchiseSupportContent from "@/components/admin/ViewFranchiseSupportContent";
import MakeFranchiseCertificateContent from "@/components/admin/MakeFranchiseCertificateContent";
import GenerateFranchiseCertificateContent from "@/components/admin/GenerateFranchiseCertificateContent";
import PaymentSectionContent from "@/components/admin/PaymentSectionContent";
import PaymentReportingContent from "@/components/admin/PaymentReportingContent";
import StudentEditingContent from "@/components/admin/StudentEditingContent";
import StudentManagementRealTime from "@/components/admin/StudentManagementRealTime";
import CertificateManagementContent from "@/components/admin/CertificateManagementContent";
import StudyCenterMasterContent from "@/components/admin/StudyCenterMasterContent";
import TitleMasterContent from "@/components/admin/TitleMasterContent";
import GenderMasterContent from "@/components/admin/GenderMasterContent";
import CasteCategoryMasterContent from "@/components/admin/CasteCategoryMasterContent";
import QualificationMasterContent from "@/components/admin/QualificationMasterContent";
import MarksheetManagementContent from "@/components/admin/MarksheetManagementContent";
import AttendanceManagementContent from "@/components/admin/AttendanceManagementContent";
import PaymentModeManagementContent from "@/components/admin/PaymentModeManagementContent";
import AdminProfileManagementContent from "@/components/admin/AdminProfileManagementContent";
import AdminFooter from "@/components/admin/AdminFooter";
import AutoGenerateContent from "@/components/admin/AutoGenerateContent";

const Admin = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleSubmenu = (index: number) => {
    const newOpenSubmenus = new Set(openSubmenus);
    
    if (newOpenSubmenus.has(index)) {
      // If the clicked submenu is already open, close it
      newOpenSubmenus.delete(index);
    } else {
      // Close all other submenus and open only the clicked one
      newOpenSubmenus.clear();
      newOpenSubmenus.add(index);
    }
    
    setOpenSubmenus(newOpenSubmenus);
  };

  // Single source of truth for sidebar items, routes, and header titles.
  const sidebarItems = useMemo(() => ([
    { icon: Home, label: "Dashboard", color: "text-blue-400", path: "/admin/dashboard", title: "Dashboard", subtitle: "Control panel" },
    {
      icon: User, label: "Profile", color: "text-green-400", hasSubmenu: true,
      submenuItems: [
        { label: "Edit My Profile", icon: User, path: "/admin/edit-profile", title: "Admin Profile", subtitle: "Edit your profile information" },
        { label: "Admin Profile Management", icon: Shield, path: "/admin/admin-profile-management", title: "Admin Profile Management", subtitle: "Manage admin profiles" },
        { label: "Change Login Password", icon: Key, path: "/admin/change-password", title: "Change Password", subtitle: "Update your login password" },
        { label: "Video", icon: Video, path: "/admin/video", title: "Add Videos", subtitle: "Upload and manage videos" },
      ],
    },
    {
      icon: Building, label: "My Offices", color: "text-purple-400", hasSubmenu: true,
      submenuItems: [
        { label: "Head Office", icon: Building2, path: "/admin/head-office", title: "Head Office Details", subtitle: "Manage head office information" },
      ],
    },
    {
      icon: GraduationCap, label: "Master", color: "text-pink-400", hasSubmenu: true,
      submenuItems: [
        { label: "Menu Content", icon: Menu, path: "/admin/menu-content", title: "Add Menu Content", subtitle: "Upload and manage menu content" },
        { label: "Photo Gallery", icon: Image, path: "/admin/photo-gallery", title: "Add Photo To Gallery", subtitle: "Upload and manage gallery photos" },
        { label: "Add Bank Details", icon: CreditCard, path: "/admin/bank-details", title: "Add Bank Details", subtitle: "Manage bank account details" },
        { label: "Employee Master", icon: Users, path: "/admin/employee-master", title: "Employee Master", subtitle: "Manage employee information" },
        { label: "State Master", icon: MapPin, path: "/admin/state-master", title: "State Master", subtitle: "Manage state information" },
        { label: "District Master", icon: Map, path: "/admin/district-master", title: "District Master", subtitle: "Manage district information" },
        { label: "Course Master", icon: BookOpen, path: "/admin/course-master", title: "Course Master", subtitle: "Manage course information" },
        { label: "Add News", icon: Newspaper, path: "/admin/add-news", title: "Add News", subtitle: "Manage news and announcements" },
        { label: "Add Course Category", icon: FolderPlus, path: "/admin/add-course-category", title: "Add Course Category", subtitle: "Manage course categories" },
        { label: "Add News & Event", icon: Calendar, path: "/admin/add-competition-courses", title: "Add Competition Courses", subtitle: "Manage competition courses and events" },
        { label: "Add Vision", icon: Eye, path: "/admin/add-vision", title: "Add Our Vision", subtitle: "Manage organization vision" },
        { label: "Add Mission", icon: Target, path: "/admin/add-mission", title: "Add Our Mission", subtitle: "Manage organization mission" },
        { label: "Add Director Message", icon: MessageSquare, path: "/admin/add-director-message", title: "Add Director Message", subtitle: "Manage director messages" },
        { label: "Contact Us", icon: Phone, path: "/admin/contact-us", title: "My All Contacts", subtitle: "View and manage contacts" },
        { label: "Enquiry", icon: HelpCircle, path: "/admin/enquiry", title: "My All Enquiry", subtitle: "View and manage enquiries" },
      ],
    },
    {
      icon: Users, label: "Student Master", color: "text-cyan-400", hasSubmenu: true,
      submenuItems: [
        { label: "Student Registration", icon: UserPlus, path: "/admin/student-registration", title: "Student Registration", subtitle: "Register new students" },
        { label: "Student Approval", icon: UserCheck, path: "/admin/student-approval", title: "Student Approval", subtitle: "Review and approve students" },
        { label: "Real-Time Student Management", icon: Database, path: "/admin/student-management-realtime", title: "Real-Time Student Management", subtitle: "Live student updates" },
        { label: "Search By Student Data", icon: Search, path: "/admin/search-by-student-data", title: "Search By Student Data", subtitle: "Search student records" },
        { label: "Student Verification", icon: Shield, path: "/admin/student-verification", title: "Student Verification", subtitle: "Verify student details" },
        { label: "Verification Report", icon: FileText, path: "/admin/verification-report", title: "Verification Report", subtitle: "Verification analytics" },
        { label: "Student Data", icon: Database, path: "/admin/student-data", title: "Student Data", subtitle: "Browse all student data" },
        { label: "Student Reg. Print", icon: Printer, path: "/admin/student-reg-print", title: "Student Registration Print", subtitle: "Print registration forms" },
        { label: "Course Subject", icon: BookOpen, path: "/admin/course-subject", title: "Course Subject", subtitle: "Manage course subjects" },
        { label: "Make Student Admit Card", icon: CreditCard, path: "/admin/make-student-admit-card", title: "Make Student Admit Card", subtitle: "Create admit cards" },
        { label: "Student Admit Card Report", icon: FileText, path: "/admin/student-admit-card-report", title: "Student Admit Card Report", subtitle: "Admit card analytics" },
        { label: "Generate Student Admit Card", icon: FileOutput, path: "/admin/generate-student-admit-card", title: "Generate Student Admit Card", subtitle: "Generate admit cards" },
        { label: "Upload Student Content", icon: Upload, path: "/admin/upload-student-content", title: "Upload Student Content", subtitle: "Upload student documents" },
      ],
    },
    {
      icon: Award, label: "Certificate & Marksheet", color: "text-yellow-400", hasSubmenu: true,
      submenuItems: [
        { label: "Auto Generate Certificate", icon: Award, path: "/admin/auto-generate", title: "Auto Generate Certificate", subtitle: "Generate certificates & marksheets" },
        { label: "Certificate Management", icon: Award, path: "/admin/certificate-management", title: "Certificate Management", subtitle: "Manage certificates" },
        { label: "Marksheet Management", icon: FileText, path: "/admin/marksheet-management", title: "Marksheet Management", subtitle: "Manage marksheets" },
        { label: "Allot Number", icon: Hash, path: "/admin/alot-number", title: "Allot Number", subtitle: "Allot certificate numbers" },
        { label: "Certificate Reports", icon: FileText, path: "/admin/report", title: "Certificate Reports", subtitle: "Certificate & marksheet reports" },
        { label: "Student Marksheet", icon: Award, path: "/admin/student-marksheet", title: "Student Marksheet", subtitle: "View student marksheets" },
      ],
    },
    {
      icon: Clock, label: "Attendance Master", color: "text-red-400", hasSubmenu: true,
      submenuItems: [
        { label: "Attendance Management", icon: Clock, path: "/admin/attendance-management", title: "Attendance Management", subtitle: "Manage attendance" },
        { label: "Student Attendance", icon: Clock, path: "/admin/student-attendance", title: "Student Attendance", subtitle: "Mark student attendance" },
        { label: "Student Attendance Report", icon: BarChart, path: "/admin/student-attendance-report", title: "Student Attendance Report", subtitle: "Attendance analytics" },
      ],
    },
    {
      icon: DollarSign, label: "Fees Master", color: "text-green-400", hasSubmenu: true,
      submenuItems: [
        { label: "Class Fees", icon: DollarSign, path: "/admin/class-fees", title: "Class Fees", subtitle: "Manage class fees" },
        { label: "Fees Reports", icon: Receipt, path: "/admin/fees-reports", title: "Fees Reports", subtitle: "Fee collection reports" },
        { label: "Fees Management", icon: Wallet, path: "/admin/fees-management", title: "Fees Management", subtitle: "Manage student fees" },
        { label: "Fees Print", icon: Printer, path: "/admin/fees-print", title: "Fees Print", subtitle: "Print fee receipts" },
      ],
    },
    {
      icon: Building, label: "Expense Panel", color: "text-indigo-400", hasSubmenu: true,
      submenuItems: [
        { label: "Expense Master", icon: Receipt, path: "/admin/expense-master", title: "Expense Master", subtitle: "Manage expense categories" },
        { label: "Expense Entry", icon: PlusCircle, path: "/admin/expense-entry", title: "Expense Entry", subtitle: "Record expenses" },
        { label: "Day Book", icon: Book, path: "/admin/day-book", title: "Day Book", subtitle: "Daily transactions" },
        { label: "Opening Balance", icon: Scale, path: "/admin/opening-balance", title: "Opening Balance", subtitle: "Set opening balances" },
        { label: "Balance Sheet", icon: Calculator, path: "/admin/balance-sheet", title: "Balance Sheet", subtitle: "View balance sheet" },
      ],
    },
    {
      icon: Crown, label: "Franchise Master", color: "text-amber-400", hasSubmenu: true,
      submenuItems: [
        { label: "Registration", icon: UserPlus, path: "/admin/franchise-registration", title: "Franchise Registration", subtitle: "Register new franchises" },
        { label: "Franchise Management", icon: Building, path: "/admin/franchise-management", title: "Franchise Management", subtitle: "Manage franchises" },
        { label: "Approval", icon: CheckCircle, path: "/admin/franchise-approval", title: "Franchise Approval", subtitle: "Approve franchise requests" },
        { label: "Franchise Data", icon: Database, path: "/admin/franchise-data", title: "Franchise Data", subtitle: "Browse franchise data" },
        { label: "Franchise Reg. Print", icon: Printer, path: "/admin/franchise-reg-print", title: "Franchise Registration Print", subtitle: "Print franchise forms" },
        { label: "Franchise Upload", icon: Upload, path: "/admin/franchise-upload", title: "Franchise Upload", subtitle: "Upload franchise documents" },
        { label: "View Franchise Support", icon: HelpCircle, path: "/admin/view-franchise-support", title: "Franchise Support", subtitle: "Franchise support tickets" },
      ],
    },
    {
      icon: FileText, label: "Franchise Certificate", color: "text-teal-400", hasSubmenu: true,
      submenuItems: [
        { label: "Make Franchise Certificate", icon: Award, path: "/admin/make-franchise-certificate", title: "Make Franchise Certificate", subtitle: "Create franchise certificates" },
        { label: "Generate Franchise Certificate", icon: FileOutput, path: "/admin/generate-franchise-certificate", title: "Generate Franchise Certificate", subtitle: "Generate franchise certificates" },
      ],
    },
    {
      icon: CreditCard, label: "Payment Mode", color: "text-rose-400", hasSubmenu: true,
      submenuItems: [
        { label: "Payment Mode Management", icon: Settings, path: "/admin/payment-mode-management", title: "Payment Mode Management", subtitle: "Configure payment modes" },
        { label: "Payment Section", icon: CreditCard, path: "/admin/payment-section", title: "Payment Section", subtitle: "Manage payments" },
        { label: "Reporting", icon: BarChart, path: "/admin/payment-reporting", title: "Payment Reporting", subtitle: "Payment analytics" },
      ],
    },
    { icon: LogOut, label: "LogOut", color: "text-gray-400" },
  ]), []);

  // Find which page corresponds to the current URL
  const activePath = location.pathname;
  const activeMeta = useMemo(() => {
    for (const item of sidebarItems) {
      if ((item as any).path === activePath) return { parentIndex: -1, title: item.title, subtitle: (item as any).subtitle };
      const subs = (item as any).submenuItems as Array<any> | undefined;
      if (subs) {
        const idx = sidebarItems.indexOf(item);
        const sub = subs.find((s) => s.path === activePath);
        if (sub) return { parentIndex: idx, title: sub.title, subtitle: sub.subtitle };
      }
    }
    return { parentIndex: -1, title: "Dashboard", subtitle: "Control panel" };
  }, [sidebarItems, activePath]);

  // Auto-open the parent group containing the active route
  useEffect(() => {
    if (activeMeta.parentIndex >= 0) {
      setOpenSubmenus((prev) => {
        if (prev.has(activeMeta.parentIndex)) return prev;
        const next = new Set<number>();
        next.add(activeMeta.parentIndex);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMeta.parentIndex]);

  const handleParentClick = (index: number, item: any) => {
    if (item.label === 'Dashboard') {
      navigate('/admin/dashboard');
      return;
    }
    if (item.label === 'LogOut') {
      handleLogout();
      return;
    }
    if (item.hasSubmenu) {
      if (sidebarCollapsed) {
        setSidebarCollapsed(false);
        setOpenSubmenus(new Set([index]));
      } else {
        toggleSubmenu(index);
      }
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="p-2 text-center hover:bg-green-600 cursor-pointer rounded text-sm font-medium">
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl transition-all duration-300 ease-in-out fixed left-0 top-0 h-full z-40 flex flex-col overflow-visible`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h1 className={`text-green-400 font-bold text-2xl bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              BIMS SOFT
            </h1>
            {sidebarCollapsed && <div className="text-green-400 font-bold text-lg">BS</div>}
            <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-gray-400 hover:text-white hover:bg-gray-700/50">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className={`${sidebarCollapsed ? 'p-2' : 'p-6'}`}>
            {!sidebarCollapsed && <div className="text-gray-400 text-xs font-semibold mb-4 uppercase tracking-wider">MAIN NAVIGATION</div>}
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <div key={index}>
                  <div 
                    className={`${sidebarCollapsed ? 'flex items-center justify-center p-4 relative group' : 'flex items-center space-x-4 p-3'} rounded-xl cursor-pointer transition-all duration-200 ${((item.label === 'Dashboard' && activePath === '/admin/dashboard') || activeMeta.parentIndex === index) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg' : 'hover:bg-gray-700/50 hover:shadow-md'}`}
                    onClick={() => handleParentClick(index, item)}
                  >
                    <item.icon className={`${sidebarCollapsed ? 'h-7 w-7' : 'h-5 w-5'} ${item.color || 'text-gray-400'} group-hover:scale-110 transition-transform duration-200 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className={`text-sm font-medium ${((item.label === 'Dashboard' && activePath === '/admin/dashboard') || activeMeta.parentIndex === index) ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors duration-200`}>
                          {item.label}
                        </span>
                        {item.hasSubmenu && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-auto text-gray-400 group-hover:text-white transition-all duration-200 ${
                              openSubmenus.has(index) ? 'rotate-180' : ''
                            }`} 
                          />
                        )}
                      </>
                    )}
                    {sidebarCollapsed && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Submenu Items */}
                  {(item as any).hasSubmenu && (item as any).submenuItems && !sidebarCollapsed && openSubmenus.has(index) && (
                    <div className="ml-8 mt-2 space-y-1 border-l-2 border-gray-600/50 pl-4">
                      {(item as any).submenuItems.map((subItem: any, subIndex: number) => {
                        const isSubActive = subItem.path === activePath;
                        return (
                          <div
                            key={subIndex}
                            className={`flex items-center space-x-3 p-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${isSubActive ? 'bg-blue-600/30 text-white border-l-2 border-blue-400 shadow-md -ml-[2px]' : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
                            onClick={() => subItem.path && navigate(subItem.path)}
                          >
                            <subItem.icon className={`h-4 w-4 ${isSubActive ? 'text-blue-300' : 'text-gray-500'}`} />
                            <span>{subItem.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Back to User Home Button */}
            {!sidebarCollapsed && (
              <div className="mt-8 px-2">
                <Button
                  onClick={handleBackToHome}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                      <Home className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Back to User Home</span>
                    <ArrowLeft className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                  </div>
                </Button>
              </div>
            )}
            
            {/* Collapsed sidebar home button */}
            {sidebarCollapsed && (
              <div className="mt-4 px-2">
                <Button
                  onClick={handleBackToHome}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 flex items-center justify-center group relative"
                >
                  <Home className="h-6 w-6" />
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    Back to User Home
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-gray-200 p-6 flex items-center justify-between fixed top-0 right-0 left-0 z-30" style={{
          left: sidebarCollapsed ? '80px' : '288px'
        }}>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {activeMeta.title}
            </h1>
            <p className="text-gray-600 font-medium mt-1">
              {activeMeta.subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <Mail className="h-7 w-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-pulse">
                  3
                </Badge>
              </div>
              <div className="relative group cursor-pointer">
                <Bell className="h-7 w-7 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                  11
                </Badge>
              </div>
              <div className="relative group cursor-pointer">
                <Users className="h-7 w-7 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                  2
                </Badge>
              </div>
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-200"></div>
                <div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">Admin</span>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <Settings className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-white mt-24 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<NewDashboardContent />} />
            <Route path="/edit-profile" element={<EditProfileContent />} />
            <Route path="/change-password" element={<ChangePasswordContent />} />
            <Route path="/video" element={<VideoContent />} />
            <Route path="/head-office" element={<HeadOfficeContent />} />
            <Route path="/menu-content" element={<MenuContentContent />} />
            <Route path="/photo-gallery" element={<PhotoGalleryContent />} />
            <Route path="/bank-details" element={<BankDetailsContent />} />
            <Route path="/employee-master" element={<EmployeeMasterContent />} />
            <Route path="/state-master" element={<StateMasterContent />} />
            <Route path="/district-master" element={<DistrictMasterContent />} />
            <Route path="/course-master" element={<CourseMasterContent />} />
            <Route path="/add-news" element={<AddNewsContent />} />
            <Route path="/add-course-category" element={<AddCourseCategoryContent />} />
            <Route path="/add-competition-courses" element={<AddCompetitionCoursesContent />} />
            <Route path="/add-vision" element={<AddVisionContent />} />
            <Route path="/add-mission" element={<AddMissionContent />} />
            <Route path="/add-director-message" element={<AddDirectorMessageContent />} />
            <Route path="/enquiry" element={<EnquiryContent />} />
            <Route path="/contact-us" element={<ContactUsContent />} />
            <Route path="/student-registration" element={<StudentRegistrationContent />} />
            <Route path="/student-approval" element={<StudentApprovalContent />} />
            <Route path="/student-management" element={<StudentManagementContent />} />
            <Route path="/student-management-realtime" element={<StudentManagementRealTime />} />
            <Route path="/search-by-student-data" element={<SearchByStudentDataContent />} />
            <Route path="/student-verification" element={<StudentVerificationContent />} />
            <Route path="/verification" element={<VerificationContent />} />
            <Route path="/verification-report" element={<VerificationReportContent />} />
            <Route path="/student-data" element={<StudentDataContent />} />
            <Route path="/student-reg-print" element={<StudentRegPrintContent />} />
            <Route path="/make-student-admit-card" element={<MakeStudentAdmitCardContent />} />
            <Route path="/student-admit-card-report" element={<StudentAdmitCardReportContent />} />
            <Route path="/generate-student-admit-card" element={<GenerateStudentAdmitCardContent />} />
            <Route path="/upload-student-content" element={<UploadStudentContentContent />} />
            <Route path="/course-subject" element={<CourseSubjectContent />} />
            <Route path="/alot-number" element={<AlotNumberContent />} />
            <Route path="/ready-marksheet" element={<ReadyMarksheetContent />} />
            <Route path="/report" element={<ReportContent />} />
            <Route path="/edit-crt" element={<EditCRTContent />} />
            <Route path="/student-marksheet" element={<StudentMarksheetContent />} />
            <Route path="/student-attendance" element={<StudentAttendanceContent />} />
            <Route path="/student-attendance-report" element={<StudentAttendanceReportContent />} />
            <Route path="/class-fees" element={<ClassFeesContent />} />
            <Route path="/fees-reports" element={<FeesReportContent />} />
            <Route path="/fees-management" element={<FeesManagementContent />} />
            <Route path="/fees-print" element={<FeesPrintContent />} />
            <Route path="/expense-master" element={<ExpenseMasterContent />} />
            <Route path="/expense-entry" element={<ExpenseEntryContent />} />
            <Route path="/day-book" element={<DayBookContent />} />
            <Route path="/opening-balance" element={<OpeningBalanceContent />} />
            <Route path="/balance-sheet" element={<BalanceSheetContent />} />
            <Route path="/franchise-registration" element={<FranchiseRegistrationContent />} />
            <Route path="/franchise-management" element={<FranchiseManagementContent />} />
            <Route path="/franchise-approval" element={<FranchiseApprovalContent />} />
            <Route path="/franchise-data" element={<FranchiseDataContent />} />
            <Route path="/franchise-reg-print" element={<FranchiseRegPrintContent />} />
            <Route path="/franchise-upload" element={<FranchiseUploadContent />} />
            <Route path="/view-franchise-support" element={<ViewFranchiseSupportContent />} />
            <Route path="/make-franchise-certificate" element={<MakeFranchiseCertificateContent />} />
            <Route path="/generate-franchise-certificate" element={<GenerateFranchiseCertificateContent />} />
            <Route path="/payment-section" element={<PaymentSectionContent />} />
            <Route path="/payment-reporting" element={<PaymentReportingContent />} />
            <Route path="/student-editing" element={<StudentEditingContent />} />
            <Route path="/certificate-management" element={<CertificateManagementContent />} />
            <Route path="/marksheet-management" element={<MarksheetManagementContent />} />
            <Route path="/attendance-management" element={<AttendanceManagementContent />} />
            <Route path="/payment-mode-management" element={<PaymentModeManagementContent />} />
            <Route path="/admin-profile-management" element={<AdminProfileManagementContent />} />
            <Route path="/auto-generate" element={<AutoGenerateContent />} />
          </Routes>
        </div>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default Admin;