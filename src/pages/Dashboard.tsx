
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentsCount, getRoomsCount, getAttendanceSummary } from "@/lib/api";
import { Loader2, Users, DoorClosed, CalendarCheck, BarChart3, Clock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: studentsCount, isLoading: loadingStudents } = useQuery({
    queryKey: ["studentsCount"],
    queryFn: getStudentsCount,
  });
  
  const { data: roomsCount, isLoading: loadingRooms } = useQuery({
    queryKey: ["roomsCount"],
    queryFn: getRoomsCount,
  });
  
  const { data: attendanceSummary, isLoading: loadingAttendance } = useQuery({
    queryKey: ["attendanceSummary"],
    queryFn: getAttendanceSummary,
  });
  
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
      <div className="grid gap-6">
        {/* Welcome Card */}
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Welcome back, {user?.username}</h2>
                <p className="text-primary-foreground/80 mt-1">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Students Card */}
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStudents ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">{studentsCount || 0}</p>
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
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DoorClosed className="mr-2 h-5 w-5 text-primary" />
                Total Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRooms ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">{roomsCount || 0}</p>
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
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CalendarCheck className="mr-2 h-5 w-5 text-primary" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAttendance ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold">
                    {attendanceSummary?.presentCount || 0}
                    <span className="text-sm text-muted-foreground ml-1">/ {studentsCount || 0}</span>
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
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Overview of recent attendance activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[hsl(var(--attendance-present)/0.1)] text-[hsl(var(--attendance-present))] p-3 rounded-md">
                  <div className="text-2xl font-bold">{attendanceSummary?.presentCount || 0}</div>
                  <div className="text-xs">Present</div>
                </div>
                <div className="bg-[hsl(var(--attendance-absent)/0.1)] text-[hsl(var(--attendance-absent))] p-3 rounded-md">
                  <div className="text-2xl font-bold">{attendanceSummary?.absentCount || 0}</div>
                  <div className="text-xs">Absent</div>
                </div>
                <div className="bg-[hsl(var(--attendance-permission)/0.1)] text-[hsl(var(--attendance-permission))] p-3 rounded-md">
                  <div className="text-2xl font-bold">{attendanceSummary?.permissionCount || 0}</div>
                  <div className="text-xs">Permission</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            size="lg" 
            className="h-auto py-4 flex-col items-center gap-2" 
            onClick={() => navigate("/attendance")}
          >
            <CalendarCheck className="h-6 w-6" />
            <span>Mark Attendance</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-4 flex-col items-center gap-2"
            onClick={() => navigate("/rooms")}
          >
            <DoorClosed className="h-6 w-6" />
            <span>View Rooms</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-4 flex-col items-center gap-2"
            onClick={() => {}}
          >
            <Users className="h-6 w-6" />
            <span>Student Reports</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-4 flex-col items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <User className="h-6 w-6" />
            <span>Profile</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
