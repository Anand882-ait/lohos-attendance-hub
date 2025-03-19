import { Room, Student, Attendance } from "@/types";

// Mock data - this would be replaced with actual Supabase calls
let rooms: Room[] = [
  {
    id: "1",
    roomNumber: "101",
    floor: "1",
    capacity: 4,
    occupiedCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    roomNumber: "102",
    floor: "1",
    capacity: 4,
    occupiedCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    roomNumber: "201",
    floor: "2",
    capacity: 2,
    occupiedCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let students: Student[] = [
  {
    id: "1",
    roomId: "1",
    name: "John Doe",
    department: "Computer Science",
    batch: "2025-2028",
    fatherName: "Michael Doe",
    motherName: "Sarah Doe",
    fatherPhone: "9876543210",
    motherPhone: "8765432109",
    studentPhone: "7654321098",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    roomId: "1",
    name: "Jane Smith",
    department: "Electrical Engineering",
    batch: "2024-2027",
    fatherName: "Robert Smith",
    motherName: "Emily Smith",
    fatherPhone: "9876543211",
    motherPhone: "8765432110",
    studentPhone: "7654321099",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    roomId: "1",
    name: "Alex Johnson",
    department: "Mechanical Engineering",
    batch: "2025-2028",
    fatherName: "David Johnson",
    motherName: "Lisa Johnson",
    fatherPhone: "9876543212",
    motherPhone: "8765432111",
    studentPhone: "7654321100",
    photo: "https://randomuser.me/api/portraits/men/2.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    roomId: "2",
    name: "Emma Davis",
    department: "Civil Engineering",
    batch: "2023-2026",
    fatherName: "William Davis",
    motherName: "Olivia Davis",
    fatherPhone: "9876543213",
    motherPhone: "8765432112",
    studentPhone: "7654321101",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    roomId: "2",
    name: "Daniel Wilson",
    department: "Information Technology",
    batch: "2025-2028",
    fatherName: "James Wilson",
    motherName: "Sophia Wilson",
    fatherPhone: "9876543214",
    motherPhone: "8765432113",
    studentPhone: "7654321102",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let attendanceRecords: Attendance[] = [
  {
    id: "1",
    studentId: "1",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    markedBy: "2",
    markedAt: new Date().toISOString()
  },
  {
    id: "2",
    studentId: "2",
    date: new Date().toISOString().split("T")[0],
    status: "absent",
    markedBy: "2",
    markedAt: new Date().toISOString()
  },
  {
    id: "3",
    studentId: "3",
    date: new Date().toISOString().split("T")[0],
    status: "permission",
    reason: "Medical appointment",
    markedBy: "2",
    markedAt: new Date().toISOString()
  }
];

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Room APIs
export const getRooms = async (): Promise<Room[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return [...rooms];
};

export const getRoom = async (id: string): Promise<Room | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return rooms.find(room => room.id === id) || null;
};

export const createRoom = async (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newRoom: Room = {
    id: generateId(),
    ...roomData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  rooms = [...rooms, newRoom];
  return newRoom;
};

export const updateRoom = async (id: string, roomData: Partial<Room>): Promise<Room> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const roomIndex = rooms.findIndex(room => room.id === id);
  if (roomIndex === -1) throw new Error("Room not found");
  
  const updatedRoom = {
    ...rooms[roomIndex],
    ...roomData,
    updatedAt: new Date().toISOString()
  };
  
  rooms = [
    ...rooms.slice(0, roomIndex),
    updatedRoom,
    ...rooms.slice(roomIndex + 1)
  ];
  
  return updatedRoom;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  rooms = rooms.filter(room => room.id !== id);
};

// Student APIs
export const getStudents = async (): Promise<Student[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...students];
};

export const getStudentsByRoom = async (roomId: string): Promise<Student[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return students.filter(student => student.roomId === roomId);
};

export const getStudent = async (id: string): Promise<Student | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return students.find(student => student.id === id) || null;
};

export const createStudent = async (studentData: Omit<Student, "id" | "createdAt" | "updatedAt">): Promise<Student> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newStudent: Student = {
    id: generateId(),
    ...studentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  students = [...students, newStudent];
  return newStudent;
};

export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex === -1) throw new Error("Student not found");
  
  const updatedStudent = {
    ...students[studentIndex],
    ...studentData,
    updatedAt: new Date().toISOString()
  };
  
  students = [
    ...students.slice(0, studentIndex),
    updatedStudent,
    ...students.slice(studentIndex + 1)
  ];
  
  return updatedStudent;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  students = students.filter(student => student.id !== id);
};

// Attendance APIs
export const getAttendance = async (date?: string): Promise<Attendance[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!date) return [...attendanceRecords];
  return attendanceRecords.filter(record => record.date === date);
};

export const getStudentAttendance = async (studentId: string, month?: string): Promise<Attendance[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let records = attendanceRecords.filter(record => record.studentId === studentId);
  
  if (month) {
    records = records.filter(record => {
      const recordMonth = record.date.split('-')[1];
      return recordMonth === month;
    });
  }
  
  return records;
};

export const markAttendance = async (attendanceData: Omit<Attendance, "id" | "markedAt">): Promise<Attendance> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if attendance already exists for this student and date
  const existingIndex = attendanceRecords.findIndex(
    record => record.studentId === attendanceData.studentId && record.date === attendanceData.date
  );
  
  const newAttendance: Attendance = {
    id: existingIndex >= 0 ? attendanceRecords[existingIndex].id : generateId(),
    ...attendanceData,
    markedAt: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    // Update existing record
    attendanceRecords = [
      ...attendanceRecords.slice(0, existingIndex),
      newAttendance,
      ...attendanceRecords.slice(existingIndex + 1)
    ];
  } else {
    // Add new record
    attendanceRecords = [...attendanceRecords, newAttendance];
  }
  
  return newAttendance;
};

export const downloadAttendance = async (month: string, format: 'csv' | 'excel' = 'excel'): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is a mock function - in a real app, this would generate a proper file
  // For now it just returns an empty blob
  return new Blob([''], { type: 'application/octet-stream' });
};

// Adding new API functions for dashboard
export const getStudentsCount = async (): Promise<number> => {
  // This would fetch from Supabase in a real implementation
  return 42; // Mock data
};

export const getRoomsCount = async (): Promise<number> => {
  // This would fetch from Supabase in a real implementation
  return 12; // Mock data
};

export const getAttendanceSummary = async (): Promise<{
  presentCount: number;
  absentCount: number;
  permissionCount: number;
  date: string;
}> => {
  // This would fetch from Supabase in a real implementation
  return {
    presentCount: 36,
    absentCount: 4,
    permissionCount: 2,
    date: new Date().toISOString(),
  }; // Mock data
};
