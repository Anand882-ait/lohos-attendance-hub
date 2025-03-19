
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRoom, getStudentsByRoom, createStudent, updateStudent, deleteStudent } from "@/lib/api";
import { Student } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import StudentCard from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Search, BookOpen, Loader2 } from "lucide-react";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [photo, setPhoto] = useState("");
  
  // Fetch room data
  const {
    data: room,
    isLoading: isRoomLoading,
    error: roomError,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoom(id!),
    enabled: !!id,
  });
  
  // Fetch students in this room
  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ["students", "room", id],
    queryFn: () => getStudentsByRoom(id!),
    enabled: !!id,
  });
  
  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", "room", id] });
      toast.success("Student added successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add student: ${error.message}`);
    },
  });
  
  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) => updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", "room", id] });
      toast.success("Student updated successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });
  
  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", "room", id] });
      toast.success("Student removed successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove student: ${error.message}`);
    },
  });
  
  const resetForm = () => {
    setName("");
    setDepartment("");
    setBatch("");
    setFatherName("");
    setMotherName("");
    setFatherPhone("");
    setMotherPhone("");
    setStudentPhone("");
    setPhoto("");
    setCurrentStudent(null);
  };
  
  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setCurrentStudent(student);
      setName(student.name);
      setDepartment(student.department);
      setBatch(student.batch);
      setFatherName(student.fatherName);
      setMotherName(student.motherName);
      setFatherPhone(student.fatherPhone);
      setMotherPhone(student.motherPhone);
      setStudentPhone(student.studentPhone);
      setPhoto(student.photo || "");
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (id: string) => {
    const student = students?.find(s => s.id === id);
    if (student) {
      setCurrentStudent(student);
      setIsDeleteDialogOpen(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      roomId: id!,
      name,
      department,
      batch,
      fatherName,
      motherName,
      fatherPhone,
      motherPhone,
      studentPhone,
      photo,
    };
    
    if (currentStudent) {
      updateStudentMutation.mutate({ id: currentStudent.id, data });
    } else {
      createStudentMutation.mutate(data);
    }
  };
  
  const handleDelete = () => {
    if (currentStudent) {
      deleteStudentMutation.mutate(currentStudent.id);
    }
  };
  
  const isLoading = isRoomLoading || isStudentsLoading;
  const error = roomError || studentsError;
  
  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title={room ? `Room ${room.roomNumber}` : "Room Details"}>
      <div className="mb-6 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => navigate("/rooms")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        
        {room && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-primary/10 text-primary rounded-full">
                <BookOpen size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Room {room.roomNumber}</h2>
                <p className="text-muted-foreground">
                  Floor: {room.floor || "N/A"} | Capacity: {room.capacity || 0} | 
                  Occupancy: {room.occupiedCount || 0}/{room.capacity || 0}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {user?.role === "admin" && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center p-8 text-destructive">
          Failed to load room details. Please try again.
        </div>
      ) : filteredStudents && filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={user?.role === "admin" ? handleOpenDialog : undefined}
              onDelete={user?.role === "admin" ? handleOpenDeleteDialog : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-secondary/50 rounded-lg">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No students found matching your search."
              : "No students assigned to this room yet."}
          </p>
          {user?.role === "admin" && !searchTerm && (
            <Button
              variant="outline"
              onClick={() => handleOpenDialog()}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Student
            </Button>
          )}
        </div>
      )}
      
      {/* Create/Edit Student Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch">Batch *</Label>
                <Input
                  id="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. 2025-2028"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentPhone">Student Phone *</Label>
                <Input
                  id="studentPhone"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Phone Number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Father's Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherPhone">Father's Phone *</Label>
                <Input
                  id="fatherPhone"
                  value={fatherPhone}
                  onChange={(e) => setFatherPhone(e.target.value)}
                  placeholder="Father's Phone"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Mother's Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherPhone">Mother's Phone *</Label>
                <Input
                  id="motherPhone"
                  value={motherPhone}
                  onChange={(e) => setMotherPhone(e.target.value)}
                  placeholder="Mother's Phone"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="photo">Photo URL (optional)</Label>
                <Input
                  id="photo"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="Profile Photo URL"
                />
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={createStudentMutation.isPending || updateStudentMutation.isPending}
              >
                {(createStudentMutation.isPending || updateStudentMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {currentStudent ? "Update Student" : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {currentStudent?.name} from Room {room?.roomNumber}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteStudentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default RoomDetails;
