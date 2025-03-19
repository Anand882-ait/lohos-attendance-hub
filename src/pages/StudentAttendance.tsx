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
  
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  const {
    data: student,
    isLoading: isStudentLoading,
    error: studentError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id!),
    enabled: !!id,
  });
  
  const formattedMonth = format(currentMonth, "yyyy-MM");
  
  const {
    data: attendanceData,
    isLoading: isAttendanceLoading,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ["student-attendance", id, formattedMonth],
    queryFn: () => getStudentAttendance(id!, formattedMonth),
    enabled: !!id,
  });
  
  useEffect(() => {
    refetchAttendance();
  }, [currentMonth, refetchAttendance]);
  
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });
  
  const attendanceSummary = React.useMemo(() => {
    if (!attendanceData) return { present: 0, absent: 0, permission: 0, total: 0 };
    
    const present = attendanceData.filter(a => a.status === "present").length;
    const absent = attendanceData.filter(a => a.status === "absent").length;
    const permission = attendanceData.filter(a => a.status === "permission").length;
    const total = daysInMonth.length;
    
    return { present, absent, permission, total };
  }, [attendanceData, daysInMonth]);
  
  const attendancePercentage = React.useMemo(() => {
    if (!attendanceSummary.total) return 0;
    return Math.round((attendanceSummary.present / attendanceSummary.total) * 100);
  }, [attendanceSummary]);
  
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
        className="mb-4 md:mb-6 text-muted-foreground"
        onClick={() => navigate(`/students/${student.id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Student Details
      </Button>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-14 w-14 md:h-16 md:w-16 border-2 border-primary/10">
                <AvatarImage src={student.photo} alt={student.name} />
                <AvatarFallback className="text-lg">{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold">{student.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {student.department} • Room {student.roomId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Present</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {attendanceSummary.present} days
                      </span>
                      <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-present))]"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Absent</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {attendanceSummary.absent} days
                      </span>
                      <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-absent))]"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Permission</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {attendanceSummary.permission} days
                      </span>
                      <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-permission))]"></div>
                    </div>
                  </div>
                  
                  <div className="pt-3 md:pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm md:text-base">Attendance Rate</span>
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
            
            <Card className="hidden sm:block">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-present))] mr-3"></div>
                    <span className="text-sm">Present</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-absent))] mr-3"></div>
                    <span className="text-sm">Absent</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-permission))] mr-3"></div>
                    <span className="text-sm">Permission</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full border border-border mr-3"></div>
                    <span className="text-sm">No Record</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-base md:text-lg font-semibold">
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
                  <div className="rounded-md border overflow-x-auto">
                    <Calendar
                      mode="default"
                      month={currentMonth}
                      defaultMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                      className="p-2 md:p-3 pointer-events-auto"
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
                    <div className="space-y-2 md:space-y-3">
                      {attendanceData.map((record) => (
                        <div
                          key={record.id}
                          className="flex justify-between items-center p-2 md:p-3 rounded-md border"
                        >
                          <div className="flex flex-col md:flex-row md:items-center">
                            <span className="font-medium text-sm mb-1 md:mb-0 md:mr-4">
                              {format(new Date(record.date), "MMM d, yyyy")}
                            </span>
                            <AttendanceStatusBadge
                              status={record.status}
                              reason={record.reason}
                            />
                          </div>
                          
                          {record.status === "permission" && record.reason && (
                            <span className="text-xs md:text-sm text-muted-foreground hidden md:block truncate max-w-[180px]">
                              {record.reason}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 md:p-8 text-muted-foreground">
                      No attendance records for this month.
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="sm:hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-present))] mr-2"></div>
                <span className="text-xs">Present</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-absent))] mr-2"></div>
                <span className="text-xs">Absent</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--attendance-permission))] mr-2"></div>
                <span className="text-xs">Permission</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full border border-border mr-2"></div>
                <span className="text-xs">No Record</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentAttendance;
