
import React from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RoomCardProps {
  room: Room;
  onEdit?: (room: Room) => void;
  onDelete?: (id: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <Card className="overflow-hidden card-hover shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-medium mb-1">
              {room.roomNumber}
            </h3>
            <p className="text-muted-foreground text-sm">
              Floor: {room.floor || "N/A"}
            </p>
          </div>
          <div className="flex items-center space-x-1 bg-primary/5 rounded-full px-3 py-1">
            <Users size={14} className="text-primary" />
            <span className="text-xs font-medium">
              {room.occupiedCount || 0}/{room.capacity || 0}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/rooms/${room.id}`)}
          className="w-full"
        >
          View Students
        </Button>
        
        {user?.role === "admin" && (
          <div className="flex space-x-1 ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit?.(room)}
            >
              <Edit2 size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete?.(room.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
