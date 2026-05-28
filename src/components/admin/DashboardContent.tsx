import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Activity } from "lucide-react";

const DashboardContent = () => {
  const statCards = [{
    title: "Franchise Panel",
    percentage: "79%",
    color: "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600",
    textColor: "text-white",
    shadowColor: "shadow-blue-500/20"
  }, {
    title: "Faculty Panel",
    percentage: "98%",
    color: "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
    textColor: "text-white",
    shadowColor: "shadow-red-500/20"
  }, {
    title: "Students Panel",
    percentage: "94%",
    color: "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600",
    textColor: "text-white",
    shadowColor: "shadow-orange-500/20"
  }, {
    title: "Total Collection",
    percentage: "98%",
    color: "bg-gradient-to-br from-pink-500 via-red-500 to-red-600",
    textColor: "text-white",
    shadowColor: "shadow-pink-500/20"
  }];

  const tasks = [{
    name: "Task #1",
    progress: 90,
    color: "bg-green-500"
  }, {
    name: "Task #2",
    progress: 70,
    color: "bg-blue-500"
  }, {
    name: "Task #3",
    progress: 60,
    color: "bg-orange-500"
  }, {
    name: "Task #4",
    progress: 40,
    color: "bg-red-500"
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <Home className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Admin Dashboard</h1>
              <p className="text-primary-foreground/80">Monitor and manage your educational platform</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {statCards.map((card, index) => (
            <Card key={index} className={`${card.color} ${card.textColor} border-0 shadow-2xl ${card.shadowColor} hover:shadow-3xl hover-scale transition-all duration-300 ease-out overflow-hidden relative group`}>
              <CardContent className="p-8 relative z-10">
                <div className="text-5xl font-extrabold mb-3 drop-shadow-lg">{card.percentage}</div>
                <div className="text-xl font-semibold mb-6 opacity-90">{card.title}</div>
                <Button variant="outline" size="sm" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 font-semibold px-6 py-2 rounded-xl backdrop-blur-sm transition-all duration-200">
                  Open Now
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            </Card>
          ))}
        </div>

        {/* Enhanced Tasks Progress */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center space-x-3 text-xl font-bold">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tasks Progress</span>
                <p className="text-sm text-muted-foreground font-normal">Monitor ongoing tasks and completion status</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-background/80 to-background/60 rounded-xl hover:from-background/90 hover:to-background/70 shadow-md hover:shadow-lg transition-all duration-300 group border border-border/50">
                <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">{task.name}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-muted rounded-full h-4 shadow-inner">
                    <div className={`h-4 rounded-full ${task.color} shadow-sm transition-all duration-500 ease-out group-hover:shadow-lg`} style={{width: `${task.progress}%`}}></div>
                  </div>
                  <span className="text-base font-bold text-foreground min-w-[50px] group-hover:text-primary transition-colors duration-300">{task.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;