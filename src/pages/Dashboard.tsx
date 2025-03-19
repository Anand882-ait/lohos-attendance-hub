
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getStudents, 
  getRooms, 
  getAttendance,
  getStudentsCount, 
  getRoomsCount, 
  getAttendanceSummary 
} from "@/lib/api";
import { Loader2, Users, DoorClosed, CalendarCheck, BarChart3, Clock, User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch all students to get actual count
  const { data: allStudents, isLoading: loadingAllStudents } = useQuery({
    queryKey: ["allStudents"],
    queryFn: getStudents,
  });
  
  // Fetch all rooms to get actual count
  const { data: allRooms, isLoading: loadingAllRooms } = useQuery({
    queryKey: ["allRooms"],
    queryFn: getRooms,
  });
  
  // Fetch today's attendance
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ["todayAttendance"],
    queryFn: () => getAttendance(new Date().toISOString().split("T")[0]),
  });
  
  // Calculate attendance stats from the actual data
  const attendanceSummary = React.useMemo(() => {
    if (!attendanceData || !allStudents) return null;
    
    const presentCount = attendanceData.filter(record => record.status === "present").length;
    const absentCount = attendanceData.filter(record => record.status === "absent").length;
    const permissionCount = attendanceData.filter(record => record.status === "permission").length;
    
    return {
      presentCount,
      absentCount,
      permissionCount,
      date: new Date().toISOString(),
    };
  }, [attendanceData, allStudents]);
  
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Layout title="Dashboard">
      <div className="grid gap-4 md:gap-6">
        {/* Welcome Card */}
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h2 className="text-xl md:text-3xl font-bold">Welcome back, {user?.username}</h2>
                <p className="text-primary-foreground/80 mt-1 text-sm md:text-base">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {formattedTime} • {formattedDate}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Students Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <Users className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAllStudents ? (
                <div className="flex justify-center py-2 md:py-4">
                  <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-baseline">
                  <p className="text-2xl md:text-3xl font-bold">{allStudents?.length || 0}</p>
                  <Button
                    variant="link"
                    className="ml-auto text-xs"
                    onClick={() => navigate("/rooms")}
                  >
                    View All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Rooms Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <DoorClosed className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                Total Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAllRooms ? (
                <div className="flex justify-center py-2 md:py-4">
                  <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-baseline">
                  <p className="text-2xl md:text-3xl font-bold">{allRooms?.length || 0}</p>
                  <Button
                    variant="link"
                    className="ml-auto text-xs"
                    onClick={() => navigate("/rooms")}
                  >
                    Manage
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Attendance Card */}
          <Card className="sm:col-span-2 md:col-span-1 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <CalendarCheck className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAttendance || loadingAllStudents ? (
                <div className="flex justify-center py-2 md:py-4">
                  <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-baseline">
                  <p className="text-2xl md:text-3xl font-bold">
                    {attendanceSummary?.presentCount || 0}
                    <span className="text-sm text-muted-foreground ml-1">/ {allStudents?.length || 0}</span>
                  </p>
                  <Button
                    variant="link"
                    className="ml-auto text-xs"
                    onClick={() => navigate("/attendance")}
                  >
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <BarChart3 className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Overview of recent attendance activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[hsl(var(--attendance-present)/0.1)] text-[hsl(var(--attendance-present))] p-2 md:p-3 rounded-md">
                  <div className="text-xl md:text-2xl font-bold">{attendanceSummary?.presentCount || 0}</div>
                  <div className="text-xs">Present</div>
                </div>
                <div className="bg-[hsl(var(--attendance-absent)/0.1)] text-[hsl(var(--attendance-absent))] p-2 md:p-3 rounded-md">
                  <div className="text-xl md:text-2xl font-bold">{attendanceSummary?.absentCount || 0}</div>
                  <div className="text-xs">Absent</div>
                </div>
                <div className="bg-[hsl(var(--attendance-permission)/0.1)] text-[hsl(var(--attendance-permission))] p-2 md:p-3 rounded-md">
                  <div className="text-xl md:text-2xl font-bold">{attendanceSummary?.permissionCount || 0}</div>
                  <div className="text-xs">Permission</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Button 
            size="lg" 
            className="h-auto py-3 md:py-4 flex-col items-center gap-2 text-xs md:text-sm" 
            onClick={() => navigate("/attendance")}
          >
            <CalendarCheck className="h-5 w-5 md:h-6 md:w-6" />
            <span>Mark Attendance</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-3 md:py-4 flex-col items-center gap-2 text-xs md:text-sm"
            onClick={() => navigate("/rooms")}
          >
            <DoorClosed className="h-5 w-5 md:h-6 md:w-6" />
            <span>View Rooms</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-3 md:py-4 flex-col items-center gap-2 text-xs md:text-sm"
            onClick={() => {}}
          >
            <Users className="h-5 w-5 md:h-6 md:w-6" />
            <span>Student Reports</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-3 md:py-4 flex-col items-center gap-2 text-xs md:text-sm"
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5 md:h-6 md:w-6" />
            <span>Profile</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
