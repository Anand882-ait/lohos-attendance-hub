
import React from "react";
import { Check, X, Clock } from "lucide-react";

interface AttendanceStatusBadgeProps {
  status: "present" | "absent" | "permission";
  reason?: string;
  showText?: boolean;
}

const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({ 
  status, 
  reason,
  showText = true 
}) => {
  let statusClass = "";
  let Icon;
  let statusText = "";

  switch (status) {
    case "present":
      statusClass = "attendance-present";
      Icon = Check;
      statusText = "Present";
      break;
    case "absent":
      statusClass = "attendance-absent";
      Icon = X;
      statusText = "Absent";
      break;
    case "permission":
      statusClass = "attendance-permission";
      Icon = Clock;
      statusText = "Permission";
      break;
  }

  return (
    <div className="flex items-center">
      <div className={`attendance-chip ${statusClass} flex items-center`}>
        <Icon size={14} className="mr-1" />
        {showText && <span>{statusText}</span>}
      </div>
      {status === "permission" && reason && (
        <span className="ml-2 text-xs text-muted-foreground">
          {reason.length > 20 ? `${reason.substring(0, 20)}...` : reason}
        </span>
      )}
    </div>
  );
};

export default AttendanceStatusBadge;
