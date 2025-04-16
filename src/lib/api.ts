
import { Room, Student, Attendance } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Room APIs
export const getRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("room_number");
  
  if (error) throw error;
  
  return data.map(room => ({
    id: room.id,
    roomNumber: room.room_number,
    floor: room.floor,
    capacity: room.capacity,
    occupiedCount: room.occupied_count,
    createdAt: room.created_at,
    updatedAt: room.updated_at
  }));
};

export const getRoom = async (id: string): Promise<Room | null> => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }
  
  return {
    id: data.id,
    roomNumber: data.room_number,
    floor: data.floor,
    capacity: data.capacity,
    occupiedCount: data.occupied_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const createRoom = async (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room> => {
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      room_number: roomData.roomNumber,
      floor: roomData.floor,
      capacity: roomData.capacity,
      occupied_count: roomData.occupiedCount || 0
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    roomNumber: data.room_number,
    floor: data.floor,
    capacity: data.capacity,
    occupiedCount: data.occupied_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateRoom = async (id: string, roomData: Partial<Room>): Promise<Room> => {
  const updates: any = {};
  
  if (roomData.roomNumber !== undefined) updates.room_number = roomData.roomNumber;
  if (roomData.floor !== undefined) updates.floor = roomData.floor;
  if (roomData.capacity !== undefined) updates.capacity = roomData.capacity;
  if (roomData.occupiedCount !== undefined) updates.occupied_count = roomData.occupiedCount;
  
  const { data, error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    roomNumber: data.room_number,
    floor: data.floor,
    capacity: data.capacity,
    occupiedCount: data.occupied_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteRoom = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};

// Student APIs
export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name");
  
  if (error) throw error;
  
  return data.map(student => ({
    id: student.id,
    roomId: student.room_id,
    name: student.name,
    department: student.department,
    batch: student.batch,
    fatherName: student.father_name,
    motherName: student.mother_name,
    fatherPhone: student.father_phone,
    motherPhone: student.mother_phone,
    studentPhone: student.student_phone,
    photo: student.photo,
    createdAt: student.created_at,
    updatedAt: student.updated_at
  }));
};

export const getStudentsByRoom = async (roomId: string): Promise<Student[]> => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("room_id", roomId)
    .order("name");
  
  if (error) throw error;
  
  return data.map(student => ({
    id: student.id,
    roomId: student.room_id,
    name: student.name,
    department: student.department,
    batch: student.batch,
    fatherName: student.father_name,
    motherName: student.mother_name,
    fatherPhone: student.father_phone,
    motherPhone: student.mother_phone,
    studentPhone: student.student_phone,
    photo: student.photo,
    createdAt: student.created_at,
    updatedAt: student.updated_at
  }));
};

export const getStudent = async (id: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }
  
  return {
    id: data.id,
    roomId: data.room_id,
    name: data.name,
    department: data.department,
    batch: data.batch,
    fatherName: data.father_name,
    motherName: data.mother_name,
    fatherPhone: data.father_phone,
    motherPhone: data.mother_phone,
    studentPhone: data.student_phone,
    photo: data.photo,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const createStudent = async (studentData: Omit<Student, "id" | "createdAt" | "updatedAt">): Promise<Student> => {
  const { data, error } = await supabase
    .from("students")
    .insert({
      room_id: studentData.roomId,
      name: studentData.name,
      department: studentData.department,
      batch: studentData.batch,
      father_name: studentData.fatherName,
      mother_name: studentData.motherName,
      father_phone: studentData.fatherPhone,
      mother_phone: studentData.motherPhone,
      student_phone: studentData.studentPhone,
      photo: studentData.photo
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Update room occupied count
  if (studentData.roomId) {
    const room = await getRoom(studentData.roomId);
    if (room) {
      await updateRoom(studentData.roomId, {
        occupiedCount: (room.occupiedCount || 0) + 1
      });
    }
  }
  
  return {
    id: data.id,
    roomId: data.room_id,
    name: data.name,
    department: data.department,
    batch: data.batch,
    fatherName: data.father_name,
    motherName: data.mother_name,
    fatherPhone: data.father_phone,
    motherPhone: data.mother_phone,
    studentPhone: data.student_phone,
    photo: data.photo,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
  // Get current student data for room occupancy check
  const currentStudent = await getStudent(id);
  
  const updates: any = {};
  
  if (studentData.roomId !== undefined) updates.room_id = studentData.roomId;
  if (studentData.name !== undefined) updates.name = studentData.name;
  if (studentData.department !== undefined) updates.department = studentData.department;
  if (studentData.batch !== undefined) updates.batch = studentData.batch;
  if (studentData.fatherName !== undefined) updates.father_name = studentData.fatherName;
  if (studentData.motherName !== undefined) updates.mother_name = studentData.motherName;
  if (studentData.fatherPhone !== undefined) updates.father_phone = studentData.fatherPhone;
  if (studentData.motherPhone !== undefined) updates.mother_phone = studentData.motherPhone;
  if (studentData.studentPhone !== undefined) updates.student_phone = studentData.studentPhone;
  if (studentData.photo !== undefined) updates.photo = studentData.photo;
  
  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update room occupied counts if room assignment changed
  if (currentStudent && studentData.roomId !== undefined && currentStudent.roomId !== studentData.roomId) {
    // Decrement old room count
    if (currentStudent.roomId) {
      const oldRoom = await getRoom(currentStudent.roomId);
      if (oldRoom && oldRoom.occupiedCount && oldRoom.occupiedCount > 0) {
        await updateRoom(currentStudent.roomId, {
          occupiedCount: oldRoom.occupiedCount - 1
        });
      }
    }
    
    // Increment new room count
    if (studentData.roomId) {
      const newRoom = await getRoom(studentData.roomId);
      if (newRoom) {
        await updateRoom(studentData.roomId, {
          occupiedCount: (newRoom.occupiedCount || 0) + 1
        });
      }
    }
  }
  
  return {
    id: data.id,
    roomId: data.room_id,
    name: data.name,
    department: data.department,
    batch: data.batch,
    fatherName: data.father_name,
    motherName: data.mother_name,
    fatherPhone: data.father_phone,
    motherPhone: data.mother_phone,
    studentPhone: data.student_phone,
    photo: data.photo,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteStudent = async (id: string): Promise<void> => {
  // Get student data for room occupancy update
  const student = await getStudent(id);
  
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  
  // Update room occupied count
  if (student && student.roomId) {
    const room = await getRoom(student.roomId);
    if (room && room.occupiedCount && room.occupiedCount > 0) {
      await updateRoom(student.roomId, {
        occupiedCount: room.occupiedCount - 1
      });
    }
  }
};

// Attendance APIs
export const getAttendance = async (date?: string): Promise<Attendance[]> => {
  let query = supabase
    .from("attendance")
    .select("*");
  
  if (date) {
    query = query.eq("date", date);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data.map(record => ({
    id: record.id,
    studentId: record.student_id,
    date: record.date,
    status: record.status,
    reason: record.reason,
    markedBy: record.marked_by,
    markedAt: record.marked_at
  }));
};

export const getStudentAttendance = async (studentId: string, month?: string): Promise<Attendance[]> => {
  let query = supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId);
  
  if (month) {
    // First day of month
    const startDate = `${month}-01`;
    // Last day of month (approximation)
    const endDate = month === "12" 
      ? `${parseInt(month.split('-')[0]) + 1}-01-01`
      : `${month.split('-')[0]}-${(parseInt(month.split('-')[1]) + 1).toString().padStart(2, '0')}-01`;
    
    query = query
      .gte("date", startDate)
      .lt("date", endDate);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data.map(record => ({
    id: record.id,
    studentId: record.student_id,
    date: record.date,
    status: record.status,
    reason: record.reason,
    markedBy: record.marked_by,
    markedAt: record.marked_at
  }));
};

export const markAttendance = async (attendanceData: Omit<Attendance, "id" | "markedAt">): Promise<Attendance> => {
  // Check if attendance already exists for this student and date
  const { data: existingRecords } = await supabase
    .from("attendance")
    .select("id")
    .eq("student_id", attendanceData.studentId)
    .eq("date", attendanceData.date);
  
  let result;
  
  if (existingRecords && existingRecords.length > 0) {
    // Update existing record
    const { data, error } = await supabase
      .from("attendance")
      .update({
        status: attendanceData.status,
        reason: attendanceData.reason,
        marked_by: attendanceData.markedBy
      })
      .eq("id", existingRecords[0].id)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        student_id: attendanceData.studentId,
        date: attendanceData.date,
        status: attendanceData.status,
        reason: attendanceData.reason,
        marked_by: attendanceData.markedBy
      })
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  }
  
  return {
    id: result.id,
    studentId: result.student_id,
    date: result.date,
    status: result.status,
    reason: result.reason,
    markedBy: result.marked_by,
    markedAt: result.marked_at
  };
};

export const downloadAttendance = async (month: string, format: 'csv' | 'excel' = 'excel'): Promise<Blob> => {
  // In a real implementation, this would generate a proper file from the database
  // For now, we're returning a dummy blob as in the mock implementation
  return new Blob([''], { type: 'application/octet-stream' });
};

// Dashboard data APIs
export const getStudentsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });
  
  if (error) throw error;
  
  return count || 0;
};

export const getRoomsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true });
  
  if (error) throw error;
  
  return count || 0;
};

export const getAttendanceSummary = async (): Promise<{
  presentCount: number;
  absentCount: number;
  permissionCount: number;
  date: string;
}> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from("attendance")
    .select("status")
    .eq("date", today);
  
  if (error) throw error;
  
  const presentCount = data.filter(record => record.status === "present").length;
  const absentCount = data.filter(record => record.status === "absent").length;
  const permissionCount = data.filter(record => record.status === "permission").length;
  
  return {
    presentCount,
    absentCount,
    permissionCount,
    date: today
  };
};
