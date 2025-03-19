import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays, subDays, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getStudents, getAttendance, markAttendance, downloadAttendance } from "@/lib/api";
import { Attendance, Student, StudentWithAttendance } from "@/types";
import Layout from "@/components/Layout";
import AttendanceStatusBadge from "@/components/AttendanceStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  Download,
  Search,
  X,
  Check,
  Clock,
  Filter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AttendancePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [markingDialogOpen, setMarkingDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithAttendance | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "permission">("present");
  const [permissionReason, setPermissionReason] = useState("");
  
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const currentMonth = format(selectedDate, "yyyy-MM");
  
  const { data: students, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
  
  const {
    data: attendanceData,
    isLoading: isAttendanceLoading,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ["attendance", formattedDate],
    queryFn: () => getAttendance(formattedDate),
  });
  
  const markAttendanceMutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", formattedDate] });
      toast.success("Attendance marked successfully");
      setMarkingDialogOpen(false);
      resetAttendanceForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark attendance: ${error.message}`);
    },
  });
  
  const downloadAttendanceMutation = useMutation({
    mutationFn: () => downloadAttendance(currentMonth),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${currentMonth}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Attendance report downloaded");
    },
    onError: (error: Error) => {
      toast.error(`Failed to download attendance: ${error.message}`);
    },
  });
  
  useEffect(() => {
    refetchAttendance();
  }, [selectedDate, refetchAttendance]);
  
  const resetAttendanceForm = () => {
    setSelectedStudent(null);
    setAttendanceStatus("present");
    setPermissionReason("");
  };
  
  const handlePreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };
  
  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };
  
  const handleMarkAttendance = (student: StudentWithAttendance) => {
    setSelectedStudent(student);
    
    if (student.attendance) {
      setAttendanceStatus(student.attendance.status);
      setPermissionReason(student.attendance.reason || "");
    } else {
      setAttendanceStatus("present");
      setPermissionReason("");
    }
    
    setMarkingDialogOpen(true);
  };
  
  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !user) return;
    
    markAttendanceMutation.mutate({
      studentId: selectedStudent.id,
      date: formattedDate,
      status: attendanceStatus,
      reason: attendanceStatus === "permission" ? permissionReason : undefined,
      markedBy: user.id,
    });
  };
  
  const handleDownloadAttendance = () => {
    downloadAttendanceMutation.mutate();
  };
  
  const processedStudents = React.useMemo(() => {
    if (!students) return [];
    
    return students
      .filter(student => {
        if (
          searchTerm &&
          !student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !student.department.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        
        if (filterStatus !== "all" && attendanceData) {
          const attendance = attendanceData.find(a => a.studentId === student.id);
          if (!attendance || attendance.status !== filterStatus) {
            return false;
          }
        }
        
        return true;
      })
      .map(student => {
        const attendance = attendanceData?.find(
          (a: Attendance) => a.studentId === student.id
        );
        
        return {
          ...student,
          attendance: attendance || null,
        } as StudentWithAttendance;
      });
  }, [students, attendanceData, searchTerm, filterStatus]);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  const isLoading = isStudentsLoading || isAttendanceLoading;
  
  return (
    <Layout title="Attendance">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center w-full md:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousDay}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 md:flex-none md:min-w-[240px] justify-start text-left font-normal text-sm md:text-base"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => {
                    if (date) {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              className="ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
              className="ml-2 text-muted-foreground hover:text-foreground hidden md:flex"
            >
              Today
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                </SelectContent>
              </Select>
              
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={handleDownloadAttendance}
                  disabled={downloadAttendanceMutation.isPending}
                  className="hidden sm:flex"
                >
                  {downloadAttendanceMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex md:hidden justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Today
          </Button>
          
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAttendance}
              disabled={downloadAttendanceMutation.isPending}
              className="flex sm:hidden ml-2 text-xs"
            >
              {downloadAttendanceMutation.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Download className="mr-1 h-3 w-3" />
              )}
              Export
            </Button>
          )}
        </div>
        
        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : processedStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Student</TableHead>
                    <TableHead className="w-[120px] hidden sm:table-cell">Room</TableHead>
                    <TableHead className="w-[150px] hidden md:table-cell">Department</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[200px] hidden md:table-cell">Reason</TableHead>
                    {!isAdmin && <TableHead className="w-[120px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo} alt={student.name} />
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[120px] sm:max-w-full">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">Room {student.roomId}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.department}</TableCell>
                      <TableCell>
                        {student.attendance ? (
                          <AttendanceStatusBadge
                            status={student.attendance.status}
                            reason={student.attendance.reason}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.attendance?.status === "permission" && student.attendance?.reason ? (
                          <span className="text-sm">{student.attendance.reason}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      {!isAdmin && (
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAttendance(student)}
                            className="text-xs px-2 sm:px-4"
                          >
                            {student.attendance ? "Update" : "Mark"}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 md:p-16">
              <p className="text-muted-foreground text-sm">
                {searchTerm || filterStatus !== "all"
                  ? "No students match your search criteria."
                  : "No students available to mark attendance."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={markingDialogOpen} onOpenChange={setMarkingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.attendance ? "Update Attendance" : "Mark Attendance"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <form onSubmit={handleSubmitAttendance} className="space-y-4 py-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedStudent.photo} alt={selectedStudent.name} />
                  <AvatarFallback>{getInitials(selectedStudent.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {selectedStudent.roomId} • {format(selectedDate, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Attendance Status</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={attendanceStatus === "present" ? "default" : "outline"}
                    className={`flex-1 ${
                      attendanceStatus === "present" ? "" : "text-muted-foreground"
                    }`}
                    onClick={() => setAttendanceStatus("present")}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Present
                  </Button>
                  
                  <Button
                    type="button"
                    variant={attendanceStatus === "absent" ? "default" : "outline"}
                    className={`flex-1 ${
                      attendanceStatus === "absent" ? "" : "text-muted-foreground"
                    }`}
                    onClick={() => setAttendanceStatus("absent")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Absent
                  </Button>
                  
                  <Button
                    type="button"
                    variant={attendanceStatus === "permission" ? "default" : "outline"}
                    className={`flex-1 ${
                      attendanceStatus === "permission" ? "" : "text-muted-foreground"
                    }`}
                    onClick={() => setAttendanceStatus("permission")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Permission
                  </Button>
                </div>
              </div>
              
              {attendanceStatus === "permission" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Permission</label>
                  <Textarea
                    value={permissionReason}
                    onChange={e => setPermissionReason(e.target.value)}
                    placeholder="Enter reason for permission..."
                    className="min-h-[80px]"
                    required
                  />
                </div>
              )}
              
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    markAttendanceMutation.isPending ||
                    (attendanceStatus === "permission" && !permissionReason)
                  }
                >
                  {markAttendanceMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {selectedStudent.attendance ? "Update Attendance" : "Mark Attendance"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AttendancePage;
