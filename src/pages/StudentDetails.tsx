
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudent } from "@/lib/api";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Phone, Mail, User, MapPin, Loader2, Building, Calendar, GraduationCap } from "lucide-react";

const StudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id!),
    enabled: !!id,
  });
  
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <Layout title="Student Details">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout title="Student Details">
        <div className="text-center p-8 text-destructive">
          Failed to load student details. Please try again.
        </div>
      </Layout>
    );
  }
  
  if (!student) {
    return (
      <Layout title="Student Details">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">Student not found</p>
          <Button
            variant="outline"
            onClick={() => navigate("/rooms")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Student Details">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 text-muted-foreground"
        onClick={() => navigate(`/rooms/${student.roomId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Room
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - profile header */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={student.photo} alt={student.name} />
                <AvatarFallback className="text-2xl">{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>{student.department}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Batch: {student.batch}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Room: {student.roomId}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Left column - contact info */}
        <Card className="overflow-hidden lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                <div className="flex items-center">
                  <Phone className="mr-3 h-4 w-4 text-primary" />
                  <span>{student.studentPhone}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Father's Name</label>
                <div className="flex items-center">
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span>{student.fatherName}</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Father's Phone</label>
                <div className="flex items-center">
                  <Phone className="mr-3 h-4 w-4 text-primary" />
                  <span>{student.fatherPhone}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Mother's Name</label>
                <div className="flex items-center">
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span>{student.motherName}</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Mother's Phone</label>
                <div className="flex items-center">
                  <Phone className="mr-3 h-4 w-4 text-primary" />
                  <span>{student.motherPhone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - additional info & attendance summary */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Department</label>
                  <div className="flex items-center">
                    <GraduationCap className="mr-3 h-4 w-4 text-primary" />
                    <span>{student.department}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Batch</label>
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-4 w-4 text-primary" />
                    <span>{student.batch}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Room Number</label>
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-4 w-4 text-primary" />
                    <span>Room {student.roomId}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Joined On</label>
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-4 w-4 text-primary" />
                    <span>
                      {new Date(student.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-3">Attendance Summary</h3>
              <Button
                onClick={() => navigate(`/attendance/student/${student.id}`)}
                className="w-full sm:w-auto"
              >
                View Attendance History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDetails;
