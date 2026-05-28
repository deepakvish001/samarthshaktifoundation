import { useState } from "react";
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
  
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'dashboard';
    if (path === '/admin/edit-profile') return 'edit-profile';
    if (path === '/admin/change-password') return 'change-password';
    if (path === '/admin/video') return 'video';
    if (path === '/admin/head-office') return 'head-office';
    if (path === '/admin/menu-content') return 'menu-content';
    if (path === '/admin/photo-gallery') return 'photo-gallery';
    if (path === '/admin/bank-details') return 'bank-details';
    if (path === '/admin/employee-master') return 'employee-master';
    if (path === '/admin/state-master') return 'state-master';
    if (path === '/admin/district-master') return 'district-master';
    if (path === '/admin/course-master') return 'course-master';
    if (path === '/admin/add-news') return 'add-news';
    if (path === '/admin/add-course-category') return 'add-course-category';
    if (path === '/admin/add-competition-courses') return 'add-competition-courses';
    if (path === '/admin/add-vision') return 'add-vision';
    if (path === '/admin/add-mission') return 'add-mission';
    if (path === '/admin/add-director-message') return 'add-director-message';
    if (path === '/admin/enquiry') return 'enquiry';
    if (path === '/admin/contact-us') return 'contact-us';
    if (path === '/admin/student-registration') return 'student-registration';
    if (path === '/admin/student-approval') return 'student-approval';
    if (path === '/admin/student-management') return 'student-management';
    if (path === '/admin/student-management-realtime') return 'student-management-realtime';
    if (path === '/admin/search-by-student-data') return 'search-by-student-data';
    if (path === '/admin/student-verification') return 'student-verification';
    if (path === '/admin/verification') return 'verification';
    if (path === '/admin/verification-report') return 'verification-report';
    if (path === '/admin/student-data') return 'student-data';
    if (path === '/admin/student-reg-print') return 'student-reg-print';
    if (path === '/admin/make-student-admit-card') return 'make-student-admit-card';
    if (path === '/admin/student-admit-card-report') return 'student-admit-card-report';
    if (path === '/admin/generate-student-admit-card') return 'generate-student-admit-card';
    if (path === '/admin/upload-student-content') return 'upload-student-content';
    if (path === '/admin/course-subject') return 'course-subject';
    if (path === '/admin/alot-number') return 'alot-number';
    if (path === '/admin/ready-marksheet') return 'ready-marksheet';
    if (path === '/admin/report') return 'report';
    if (path === '/admin/edit-crt') return 'edit-crt';
    if (path === '/admin/student-marksheet') return 'student-marksheet';
    if (path === '/admin/student-attendance') return 'student-attendance';
    if (path === '/admin/student-attendance-report') return 'student-attendance-report';
    if (path === '/admin/class-fees') return 'class-fees';
    if (path === '/admin/fees-reports') return 'fees-reports';
    if (path === '/admin/fees-management') return 'fees-management';
    if (path === '/admin/fees-print') return 'fees-print';
    if (path === '/admin/expense-master') return 'expense-master';
    if (path === '/admin/expense-entry') return 'expense-entry';
    if (path === '/admin/day-book') return 'day-book';
    if (path === '/admin/opening-balance') return 'opening-balance';
    if (path === '/admin/balance-sheet') return 'balance-sheet';
    if (path === '/admin/franchise-registration') return 'franchise-registration';
    if (path === '/admin/franchise-management') return 'franchise-management';
    if (path === '/admin/franchise-approval') return 'franchise-approval';
    if (path === '/admin/franchise-data') return 'franchise-data';
    if (path === '/admin/franchise-reg-print') return 'franchise-reg-print';
    if (path === '/admin/franchise-upload') return 'franchise-upload';
    if (path === '/admin/view-franchise-support') return 'view-franchise-support';
    if (path === '/admin/make-franchise-certificate') return 'make-franchise-certificate';
    if (path === '/admin/generate-franchise-certificate') return 'generate-franchise-certificate';
    if (path === '/admin/payment-section') return 'payment-section';
    if (path === '/admin/payment-reporting') return 'payment-reporting';
    if (path === '/admin/student-editing') return 'student-editing';
    if (path === '/admin/certificate-management') return 'certificate-management';
    if (path === '/admin/marksheet-management') return 'marksheet-management';
    if (path === '/admin/attendance-management') return 'attendance-management';
    if (path === '/admin/payment-mode-management') return 'payment-mode-management';
    if (path === '/admin/admin-profile-management') return 'admin-profile-management';
    return 'dashboard';
  };

  const currentView = getCurrentView();

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

  const sidebarItems = [{
    icon: Home,
    label: "Dashboard",
    active: true,
    color: "text-blue-400"
  }, {
    icon: User,
    label: "Profile",
    color: "text-green-400",
    hasSubmenu: true,
    submenuItems: [
      { label: "Edit My Profile", icon: User },
      { label: "Admin Profile Management", icon: Shield },
      { label: "Change Login Password", icon: Key },
      { label: "Video", icon: Video }
    ]
  }, {
    icon: Building,
    label: "My Offices",
    hasSubmenu: true,
    color: "text-purple-400",
    submenuItems: [
      { label: "Head Office", icon: Building2 }
    ]
  }, {
    icon: GraduationCap,
    label: "Master",
    hasSubmenu: true,
    color: "text-pink-400",
    submenuItems: [
      { label: "Menu Content", icon: Menu },
      { label: "Photo Gallery", icon: Image },
      { label: "Add Bank Details", icon: CreditCard },
      { label: "EMP Master", icon: Users },
      { label: "State Master", icon: MapPin },
      { label: "Distt Master", icon: Map },
      { label: "Course Master", icon: BookOpen },
      { label: "Add News", icon: Newspaper },
      { label: "Add Course Category", icon: FolderPlus },
      { label: "Add News & Event", icon: Calendar },
      { label: "Add Vision", icon: Eye },
      { label: "Add Mission", icon: Target },
      { label: "Add Director Message", icon: MessageSquare },
      { label: "Contact Us", icon: Phone },
      { label: "Enquiry", icon: HelpCircle }
    ]
  }, {
    icon: Users,
    label: "Student Master",
    hasSubmenu: true,
    color: "text-cyan-400",
    submenuItems: [
      { label: "Student Registration", icon: UserPlus },
      { label: "Student Approval", icon: UserCheck },
      { label: "Student Management", icon: Users },
      { label: "Real-Time Student Management", icon: Database },
      { label: "Search By Student Data", icon: Search },
      { label: "Student Verification", icon: Shield },
      { label: "Verification", icon: CheckCircle },
      { label: "Verification Report", icon: FileText },
      { label: "Student Data", icon: Database },
      { label: "Student Reg. Print", icon: Printer },
      { label: "Make Student Admit Card", icon: CreditCard },
      { label: "Student Admit Card Report", icon: FileText },
      { label: "Generate Student Admit Card", icon: FileOutput },
      { label: "Upload Student Content", icon: Upload }
    ]
  }, {
    icon: Award,
    label: "Certificate & Marksheet",
    hasSubmenu: true,
    color: "text-yellow-400",
    submenuItems: [
      { label: "Auto Generate Certificate", icon: Award },
      { label: "Certificate Management", icon: Award },
      { label: "Marksheet Management", icon: FileText },
      { label: "Alot Number", icon: Hash },
      { label: "Ready Markseet", icon: FileCheck },
      { label: "Report", icon: FileText },
      { label: "Edit CRT", icon: Edit },
      { label: "Student Markseet", icon: Award }
    ]
  }, {
    icon: Clock,
    label: "Attendance Master",
    hasSubmenu: true,
    color: "text-red-400",
    submenuItems: [
      { label: "Attendance Management", icon: Clock },
      { label: "Student Attandance", icon: Clock },
      { label: "Student Att. Report", icon: BarChart }
    ]
  }, {
    icon: DollarSign,
    label: "Fees Master",
    hasSubmenu: true,
    color: "text-green-400",
    submenuItems: [
      { label: "Class Fees", icon: DollarSign },
      { label: "Fees Reports", icon: Receipt },
      { label: "Fees Management", icon: Wallet },
      { label: "Fees Print", icon: Printer }
    ]
  }, {
    icon: Building,
    label: "Expense panel",
    hasSubmenu: true,
    color: "text-indigo-400",
    submenuItems: [
      { label: "Expense Master", icon: Receipt },
      { label: "Expense Entry", icon: PlusCircle },
      { label: "Day Book", icon: Book },
      { label: "Opening Balance", icon: Scale },
      { label: "Balance Sheet", icon: Calculator }
    ]
  }, {
    icon: Crown,
    label: "Franchise Master",
    hasSubmenu: true,
    color: "text-amber-400",
    submenuItems: [
      { label: "Registration", icon: UserPlus },
      { label: "Franchise Management", icon: Building },
      { label: "Approval", icon: CheckCircle },
      { label: "Franchise Data", icon: Database },
      { label: "Franchise Reg. Print", icon: Printer },
      { label: "Franchise Upload", icon: Upload },
      { label: "View Franchise Support", icon: HelpCircle }
    ]
  }, {
    icon: FileText,
    label: "Franchise Certificate",
    hasSubmenu: true,
    color: "text-teal-400",
    submenuItems: [
      { label: "Make Franchise Certificate", icon: Award },
      { label: "Generate Franchise Certificate", icon: FileOutput }
    ]
  }, {
    icon: CreditCard,
    label: "Payment Mode",
    hasSubmenu: true,
    color: "text-rose-400",
    submenuItems: [
      { label: "Payment Mode Management", icon: Settings },
      { label: "Payment Section", icon: CreditCard },
      { label: "Reporting", icon: BarChart },
      { label: "Student_Editing", icon: Edit }
    ]
  }, {
    icon: LogOut,
    label: "LogOut",
    color: "text-gray-400"
  }];

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
                    className={`${sidebarCollapsed ? 'flex items-center justify-center p-4 relative group' : 'flex items-center space-x-4 p-3'} rounded-xl cursor-pointer transition-all duration-200 ${item.label === 'Dashboard' && currentView === 'dashboard' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg' : 'hover:bg-gray-700/50 hover:shadow-md'}`}
                    onClick={() => {
                      if (item.label === 'Dashboard') {
                        navigate('/admin/dashboard');
                      } else if (item.label === 'LogOut') {
                        handleLogout();
                      } else if (item.hasSubmenu && !sidebarCollapsed) {
                        toggleSubmenu(index);
                      }
                    }}
                  >
                    <item.icon className={`${sidebarCollapsed ? 'h-7 w-7' : 'h-5 w-5'} ${item.color || 'text-gray-400'} group-hover:scale-110 transition-transform duration-200 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className={`text-sm font-medium ${item.label === 'Dashboard' && currentView === 'dashboard' ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors duration-200`}>
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
                  {item.hasSubmenu && item.submenuItems && !sidebarCollapsed && openSubmenus.has(index) && (
                    <div className="ml-8 mt-2 space-y-1 border-l-2 border-gray-600/50 pl-4">
                      {item.submenuItems.map((subItem, subIndex) => (
                        <div 
                          key={subIndex}
                          className="flex items-center space-x-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-lg cursor-pointer transition-all duration-200"
                          onClick={() => {
                            if (subItem.label === "Edit My Profile") {
                              navigate('/admin/edit-profile');
                            } else if (subItem.label === "Admin Profile Management") {
                              navigate('/admin/admin-profile-management');
                            } else if (subItem.label === "Change Login Password") {
                              navigate('/admin/change-password');
                            } else if (subItem.label === "Video") {
                              navigate('/admin/video');
                            } else if (subItem.label === "Head Office") {
                              navigate('/admin/head-office');
                            } else if (subItem.label === "Menu Content") {
                              navigate('/admin/menu-content');
                            } else if (subItem.label === "Photo Gallery") {
                              navigate('/admin/photo-gallery');
                            } else if (subItem.label === "Add Bank Details") {
                              navigate('/admin/bank-details');
                            } else if (subItem.label === "EMP Master") {
                              navigate('/admin/employee-master');
                            } else if (subItem.label === "State Master") {
                              navigate('/admin/state-master');
                            } else if (subItem.label === "Distt Master") {
                              navigate('/admin/district-master');
                            } else if (subItem.label === "Course Master") {
                              navigate('/admin/course-master');
                            } else if (subItem.label === "Add News") {
                              navigate('/admin/add-news');
                            } else if (subItem.label === "Add Course Category") {
                              navigate('/admin/add-course-category');
                            } else if (subItem.label === "Add News & Event") {
                              navigate('/admin/add-competition-courses');
                            } else if (subItem.label === "Add Vision") {
                              navigate('/admin/add-vision');
                            } else if (subItem.label === "Add Mission") {
                              navigate('/admin/add-mission');
                            } else if (subItem.label === "Add Director Message") {
                              navigate('/admin/add-director-message');
                            } else if (subItem.label === "Enquiry") {
                              navigate('/admin/enquiry');
                            } else if (subItem.label === "Contact Us") {
                              navigate('/admin/contact-us');
                            } else if (subItem.label === "Student Registration") {
                              navigate('/admin/student-registration');
                            } else if (subItem.label === "Student Approval") {
                              navigate('/admin/student-approval');
                            } else if (subItem.label === "Student Management") {
                              navigate('/admin/student-management');
                            } else if (subItem.label === "Real-Time Student Management") {
                              navigate('/admin/student-management-realtime');
                            } else if (subItem.label === "Search By Student Data") {
                              navigate('/admin/search-by-student-data');
                            } else if (subItem.label === "Student Verification") {
                              navigate('/admin/student-verification');
                            } else if (subItem.label === "Verification") {
                              navigate('/admin/verification');
                            } else if (subItem.label === "Verification Report") {
                              navigate('/admin/verification-report');
                            } else if (subItem.label === "Student Data") {
                              navigate('/admin/student-data');
                            } else if (subItem.label === "Student Reg. Print") {
                              navigate('/admin/student-reg-print');
                            } else if (subItem.label === "Make Student Admit Card") {
                              navigate('/admin/make-student-admit-card');
                            } else if (subItem.label === "Student Admit Card Report") {
                              navigate('/admin/student-admit-card-report');
                            } else if (subItem.label === "Generate Student Admit Card") {
                              navigate('/admin/generate-student-admit-card');
                            } else if (subItem.label === "Upload Student Content") {
                              navigate('/admin/upload-student-content');
                            } else if (subItem.label === "Course Subject") {
                              navigate('/admin/course-subject');
                            } else if (subItem.label === "Certificate Management") {
                              navigate('/admin/certificate-management');
                            } else if (subItem.label === "Auto Generate Certificate") {
                              navigate('/admin/auto-generate');
                            } else if (subItem.label === "Marksheet Management") {
                              navigate('/admin/marksheet-management');
                            } else if (subItem.label === "Alot Number") {
                              navigate('/admin/alot-number');
                            } else if (subItem.label === "Ready Markseet") {
                              navigate('/admin/ready-marksheet');
                            } else if (subItem.label === "Report") {
                              navigate('/admin/report');
                            } else if (subItem.label === "Edit CRT") {
                              navigate('/admin/edit-crt');
                            } else if (subItem.label === "Student Markseet") {
                              navigate('/admin/student-marksheet');
                            } else if (subItem.label === "Attendance Management") {
                              navigate('/admin/attendance-management');
                            } else if (subItem.label === "Student Attandance") {
                              navigate('/admin/student-attendance');
                            } else if (subItem.label === "Student Att. Report") {
                              navigate('/admin/student-attendance-report');
                            } else if (subItem.label === "Class Fees") {
                              navigate('/admin/class-fees');
                            } else if (subItem.label === "Fees Reports") {
                              navigate('/admin/fees-reports');
                            } else if (subItem.label === "Fees Management") {
                              navigate('/admin/fees-management');
                            } else if (subItem.label === "Fees Print") {
                              navigate('/admin/fees-print');
                            } else if (subItem.label === "Expense Master") {
                              navigate('/admin/expense-master');
                            } else if (subItem.label === "Expense Entry") {
                              navigate('/admin/expense-entry');
                            } else if (subItem.label === "Day Book") {
                              navigate('/admin/day-book');
                            } else if (subItem.label === "Opening Balance") {
                              navigate('/admin/opening-balance');
                            } else if (subItem.label === "Balance Sheet") {
                              navigate('/admin/balance-sheet');
                            } else if (subItem.label === "Registration") {
                              navigate('/admin/franchise-registration');
                            } else if (subItem.label === "Franchise Management") {
                              navigate('/admin/franchise-management');
                            } else if (subItem.label === "Approval") {
                              navigate('/admin/franchise-approval');
                            } else if (subItem.label === "Franchise Data") {
                              navigate('/admin/franchise-data');
                            } else if (subItem.label === "Franchise Reg. Print") {
                              navigate('/admin/franchise-reg-print');
                            } else if (subItem.label === "Franchise Upload") {
                              navigate('/admin/franchise-upload');
                            } else if (subItem.label === "View Franchise Support") {
                              navigate('/admin/view-franchise-support');
                            } else if (subItem.label === "Make Franchise Certificate") {
                              navigate('/admin/make-franchise-certificate');
                            } else if (subItem.label === "Generate Franchise Certificate") {
                              navigate('/admin/generate-franchise-certificate');
                            } else if (subItem.label === "Payment Mode Management") {
                              navigate('/admin/payment-mode-management');
                            } else if (subItem.label === "Payment Section") {
                              navigate('/admin/payment-section');
                            } else if (subItem.label === "Reporting") {
                              navigate('/admin/payment-reporting');
                            } else if (subItem.label === "Student_Editing") {
                              navigate('/admin/student-editing');
                            }
                          }}
                        >
                          <subItem.icon className="h-4 w-4 text-gray-500" />
                          <span>{subItem.label}</span>
                        </div>
                      ))}
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
              {currentView === 'dashboard' ? 'Dashboard' : 
               currentView === 'edit-profile' ? 'Admin Profile' : 
               currentView === 'change-password' ? 'Change Password' : 
               currentView === 'video' ? 'Add Videos' : 
               currentView === 'head-office' ? 'Head Office Details' : 
               currentView === 'menu-content' ? 'Add Menu Content' : 
               currentView === 'photo-gallery' ? 'Add Photo To Gallery' : 
               currentView === 'bank-details' ? 'Add Bank Details' : 
               currentView === 'employee-master' ? 'Employee Master' : 
                currentView === 'state-master' ? 'State Master' : 
                currentView === 'district-master' ? 'District Master' : 
                currentView === 'course-master' ? 'Course Master' : 
                currentView === 'add-news' ? 'Add News' : 
                currentView === 'add-course-category' ? 'Add Course Category' : 
                currentView === 'add-competition-courses' ? 'Add Competition Courses' : 
                currentView === 'add-vision' ? 'Add Our Vision' : 
                currentView === 'add-mission' ? 'Add Our Mission' : 
                currentView === 'add-director-message' ? 'Add Director Message' : 
                currentView === 'enquiry' ? 'My All Enquiry' : 
                currentView === 'contact-us' ? 'My All Contacts' : 
                currentView === 'student-registration' ? 'Student Registration' : 
               currentView === 'student-approval' ? 'Student Approval' : 
               currentView === 'student-management' ? 'Student Management' : 
               currentView === 'search-by-student-data' ? 'Search By Student Data' : 
               currentView === 'student-verification' ? 'Student Verification' : 
               currentView === 'verification' ? 'Verification' : 
               currentView === 'verification-report' ? 'Verification Report' : 
               currentView === 'student-data' ? 'Student Data' : 'Dashboard'}
            </h1>
            <p className="text-gray-600 font-medium mt-1">
              {currentView === 'dashboard' ? 'Control panel' : 
               currentView === 'edit-profile' ? 'Edit your profile information' : 
               currentView === 'change-password' ? 'Update your login password' : 
               currentView === 'video' ? 'Upload and manage videos' : 
               currentView === 'head-office' ? 'Manage head office information' : 
               currentView === 'menu-content' ? 'Upload and manage menu content' : 
               currentView === 'photo-gallery' ? 'Upload and manage gallery photos' : 
               currentView === 'bank-details' ? 'Manage bank account details' : 
               currentView === 'employee-master' ? 'Manage employee information' : 
                currentView === 'state-master' ? 'Manage state information' : 
                currentView === 'district-master' ? 'Manage district information' : 
                currentView === 'course-master' ? 'Manage course information' : 
                currentView === 'add-news' ? 'Manage news and announcements' : 
                currentView === 'add-course-category' ? 'Manage course categories' : 
                currentView === 'add-competition-courses' ? 'Manage competition courses and events' : 
                currentView === 'add-vision' ? 'Manage organization vision' : 
                currentView === 'add-mission' ? 'Manage organization mission' : 
                currentView === 'add-director-message' ? 'Manage director messages' : 
                currentView === 'enquiry' ? 'View and manage enquiries' : 
                currentView === 'contact-us' ? 'View and manage contacts' : 
               currentView === 'student-registration' ? 'Register new students' : 'Control panel'}
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