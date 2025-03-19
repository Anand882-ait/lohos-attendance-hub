export interface User {
  id: string;
  username: string;
  role: "admin" | "staff";
}

export interface Room {
  id: string;
  roomNumber: string;
  floor?: string;
  capacity?: number;
  occupiedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  roomId: string;
  name: string;
  department: string;
  batch: string;
  fatherName: string;
  motherName: string;
  fatherPhone: string;
  motherPhone: string;
  studentPhone: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "permission";
  reason?: string;
  markedBy: string;
  markedAt: string;
}

export interface AttendanceRecord {
  id: string;
  student: Student;
  date: string;
  status: "present" | "absent" | "permission";
  reason?: string;
  markedBy: string;
  markedAt: string;
}

// New interface for students with attendance information
export interface StudentWithAttendance extends Student {
  attendance: Attendance | null;
}

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};
