import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignRight, RotateCcw, Image, Home, User, Mail, TrendingUp, Users, DollarSign, BookOpen, Calendar as CalendarIcon, Send, X, MoreHorizontal, Activity, Clock, Star } from "lucide-react";

const DashboardContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const statCards = [
    {
      title: "Franchise Panel",
      percentage: "79%",
      value: "2,847",
      change: "+12%",
      color: "bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600",
      icon: Users,
      trend: "up"
    },
    {
      title: "Faculty Panel", 
      percentage: "98%",
      value: "1,234",
      change: "+8%",
      color: "bg-gradient-to-br from-red-500 via-pink-500 to-red-600",
      icon: User,
      trend: "up"
    },
    {
      title: "Students Panel",
      percentage: "94%",
      value: "5,678",
      change: "+15%",
      color: "bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600",
      icon: BookOpen,
      trend: "up"
    },
    {
      title: "Total Collection",
      percentage: "98%",
      value: "₹45.2L",
      change: "+22%",
      color: "bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600",
      icon: DollarSign,
      trend: "up"
    }
  ];

  const tasks = [
    { name: "Task #1", progress: 90, color: "bg-gradient-to-r from-green-400 to-green-600", status: "Completed" },
    { name: "Task #2", progress: 70, color: "bg-gradient-to-r from-blue-400 to-blue-600", status: "In Progress" },
    { name: "Task #3", progress: 60, color: "bg-gradient-to-r from-yellow-400 to-yellow-600", status: "In Progress" },
    { name: "Task #4", progress: 40, color: "bg-gradient-to-r from-orange-400 to-orange-600", status: "Pending" }
  ];

  const recentActivities = [
    { user: "John Doe", action: "registered for course", time: "2 mins ago", type: "registration" },
    { user: "Jane Smith", action: "completed payment", time: "5 mins ago", type: "payment" },
    { user: "Mike Johnson", action: "submitted assignment", time: "10 mins ago", type: "assignment" },
    { user: "Sarah Wilson", action: "joined franchise", time: "15 mins ago", type: "franchise" }
  ];

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
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const isCurrentMonth = currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear;

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today;
      days.push(
        <div 
          key={day} 
          className={`p-2 text-center hover:bg-green-700 cursor-pointer rounded text-sm font-medium text-white transition-all duration-200 hover:scale-110 ${
            isToday ? 'bg-green-700 ring-2 ring-white shadow-lg' : ''
          }`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card 
              key={index} 
              className={`${card.color} text-white border-0 shadow-xl overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer group`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {card.change}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold drop-shadow-lg">{card.percentage}</div>
                  <div className="text-white/90 text-sm font-medium">{card.value}</div>
                  <div className="text-lg font-semibold opacity-90">{card.title}</div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 font-medium backdrop-blur-sm transition-all duration-200 group-hover:translate-x-1"
                >
                  Open Now
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </CardContent>
              
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 transition-all duration-300 group-hover:scale-110"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 translate-x-8 transition-all duration-300 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Email - Enhanced */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-800 font-bold">Quick Email</span>
                <div className="ml-auto flex space-x-2">
                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Email to:" 
                  className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 shadow-sm"
                />
                <Input 
                  placeholder="CC/BCC" 
                  className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 shadow-sm"
                />
              </div>
              <Input 
                placeholder="Subject" 
                className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 shadow-sm"
              />
              
              {/* Enhanced Rich Text Editor Toolbar */}
              <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border rounded-lg shadow-sm">
                <select className="text-sm border-0 bg-transparent font-medium">
                  <option>Normal text</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="h-6 w-px bg-gray-300"></div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><Underline className="h-4 w-4" /></Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <Button variant="ghost" size="sm" className="text-sm hover:bg-gray-200">Small</Button>
                <Button variant="ghost" size="sm" className="text-xl hover:bg-gray-200">"</Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><List className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><ListOrdered className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><AlignLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><AlignRight className="h-4 w-4" /></Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><RotateCcw className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-200"><Image className="h-4 w-4" /></Button>
              </div>
              
              <Textarea 
                placeholder="Compose your message..." 
                className="min-h-[180px] resize-none border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                    Save Draft
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                    Schedule
                  </Button>
                </div>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar and More */}
        <div className="space-y-6">
          {/* Enhanced Calendar */}
          <Card className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendar</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-green-600 h-8 w-8 p-0">≡</Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-green-600 h-8 w-8 p-0">-</Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-green-600 h-8 w-8 p-0">×</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-lg">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-sm font-bold p-2 text-green-100">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Tasks Progress */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800 font-bold">Task Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{task.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        task.status === 'Completed' ? 'border-green-500 text-green-700' :
                        task.status === 'In Progress' ? 'border-blue-500 text-blue-700' :
                        'border-orange-500 text-orange-700'
                      }`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                      <div 
                        className={`h-3 rounded-full ${task.color} shadow-sm transition-all duration-1000 ease-out group-hover:shadow-lg`} 
                        style={{width: `${task.progress}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 min-w-[40px] group-hover:text-gray-900 transition-colors duration-200">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800 font-bold">Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform duration-200">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.type === 'payment' ? 'border-green-500 text-green-700' :
                      activity.type === 'registration' ? 'border-blue-500 text-blue-700' :
                      activity.type === 'assignment' ? 'border-purple-500 text-purple-700' :
                      'border-orange-500 text-orange-700'
                    }`}
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;