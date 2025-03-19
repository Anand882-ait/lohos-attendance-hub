
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import { getStudent, getStudentAttendance } from "@/lib/api";
import Layout from "@/components/Layout";
import AttendanceStatusBadge from "@/components/AttendanceStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const StudentAttendance = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for date and month navigation
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  
  // Helper function to get initials from name
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  // Fetch student data
  const {
    data: student,
    isLoading: isStudentLoading,
    error: studentError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id!),
    enabled: !!id,
  });
  
  // Format the current month for API call
  const formattedMonth = format(currentMonth, "yyyy-MM");
  
  // Fetch attendance data for the student in the current month
  const {
    data: attendanceData,
    isLoading: isAttendanceLoading,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ["student-attendance", id, formattedMonth],
    queryFn: () => getStudentAttendance(id!, formattedMonth),
    enabled: !!id,
  });
  
  // Effect to refetch attendance when month changes
  useEffect(() => {
    refetchAttendance();
  }, [currentMonth, refetchAttendance]);
  
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });
  
  // Generate attendance summary statistics
  const attendanceSummary = React.useMemo(() => {
    if (!attendanceData) return { present: 0, absent: 0, permission: 0, total: 0 };
    
    const present = attendanceData.filter(a => a.status === "present").length;
    const absent = attendanceData.filter(a => a.status === "absent").length;
    const permission = attendanceData.filter(a => a.status === "permission").length;
    const total = daysInMonth.length;
    
    return { present, absent, permission, total };
  }, [attendanceData, daysInMonth]);
  
  // Calculate attendance percentage
  const attendancePercentage = React.useMemo(() => {
    if (!attendanceSummary.total) return 0;
    return Math.round((attendanceSummary.present / attendanceSummary.total) * 100);
  }, [attendanceSummary]);
  
  // Generate calendar day modifiers for the attendance status
  const dayStatus = React.useMemo(() => {
    if (!attendanceData) return {};

    return attendanceData.reduce((acc, record) => {
      const date = new Date(record.date);
      return {
        ...acc,
        [format(date, "yyyy-MM-dd")]: record.status,
      };
    }, {});
  }, [attendanceData]);
  
  const isLoading = isStudentLoading || isAttendanceLoading;
  
  if (isLoading) {
    return (
      <Layout title="Student Attendance">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (studentError || !student) {
    return (
      <Layout title="Student Attendance">
        <div className="text-center p-8 text-destructive">
          <p className="mb-4">Failed to load student data. Please try again.</p>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Student Attendance">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 text-muted-foreground"
        onClick={() => navigate(`/students/${student.id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Student Details
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={student.photo} alt={student.name} />
                <AvatarFallback className="text-lg">{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <p className="text-muted-foreground">
                  {student.department} • Room {student.roomId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Attendance Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Present</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {attendanceSummary.present} days
                    </span>
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-present))]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Absent</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {attendanceSummary.absent} days
                    </span>
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-absent))]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Permission</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {attendanceSummary.permission} days
                    </span>
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-permission))]"></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Attendance Rate</span>
                    <span className="text-lg font-bold">{attendancePercentage}%</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-present))] mr-3"></div>
                  <span>Present</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-absent))] mr-3"></div>
                  <span>Absent</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-permission))] mr-3"></div>
                  <span>Permission</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full border border-border mr-3"></div>
                  <span>No Record</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Attendance Details */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
                  <TabsList>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <TabsContent value="calendar" className="m-0">
                <div className="rounded-md border">
                  <Calendar
                    mode="default"
                    month={currentMonth}
                    defaultMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="p-3 pointer-events-auto"
                    modifiers={{
                      present: Object.entries(dayStatus)
                        .filter(([_, status]) => status === "present")
                        .map(([date]) => new Date(date)),
                      absent: Object.entries(dayStatus)
                        .filter(([_, status]) => status === "absent")
                        .map(([date]) => new Date(date)),
                      permission: Object.entries(dayStatus)
                        .filter(([_, status]) => status === "permission")
                        .map(([date]) => new Date(date)),
                    }}
                    modifiersClassNames={{
                      present: "bg-[hsl(var(--attendance-present)/0.2)] text-[hsl(var(--attendance-present))] font-medium",
                      absent: "bg-[hsl(var(--attendance-absent)/0.2)] text-[hsl(var(--attendance-absent))] font-medium",
                      permission: "bg-[hsl(var(--attendance-permission)/0.2)] text-[hsl(var(--attendance-permission))] font-medium",
                    }}
                    selected={[]}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="m-0">
                {attendanceData && attendanceData.length > 0 ? (
                  <div className="space-y-3">
                    {attendanceData.map((record) => (
                      <div
                        key={record.id}
                        className="flex justify-between items-center p-3 rounded-md border"
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-4">
                            {format(new Date(record.date), "MMMM d, yyyy")}
                          </span>
                          <AttendanceStatusBadge
                            status={record.status}
                            reason={record.reason}
                          />
                        </div>
                        
                        {record.status === "permission" && record.reason && (
                          <span className="text-sm text-muted-foreground">
                            {record.reason}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    No attendance records for this month.
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StudentAttendance;
