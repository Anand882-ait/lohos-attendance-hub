
import React from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Phone, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="overflow-hidden card-hover shadow-sm">
      <CardContent className="p-6 pb-0">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={student.photo} alt={student.name} />
            <AvatarFallback className="text-lg">{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-medium">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.department}</p>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-xs">
                <Phone size={12} className="text-muted-foreground" />
                <span>{student.studentPhone}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-xs">
                <Calendar size={12} className="text-muted-foreground" />
                <span>{student.batch}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/students/${student.id}`)}
          className="w-full"
        >
          View Details
        </Button>
        
        {user?.role === "admin" && (
          <div className="flex space-x-1 ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit?.(student)}
            >
              <Edit2 size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete?.(student.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
