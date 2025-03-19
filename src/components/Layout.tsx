
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  User 
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Rooms", icon: BookOpen, path: "/rooms" },
    { name: "Attendance", icon: Calendar, path: "/attendance" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 h-screen sticky top-0 bg-white border-r border-border flex flex-col transition-all duration-300 ease-in-out">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-primary tracking-tight">LOHOS</h1>
          <p className="text-sm text-muted-foreground">Attendance Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors
                ${location.pathname.includes(item.path) 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-2 justify-start text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 max-h-screen overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-border h-16 flex items-center px-6 justify-between">
          <h1 className="text-xl font-medium">{title || "LOHOS Attendance"}</h1>
          <div className="flex space-x-2">
            {/* Additional header elements can go here */}
          </div>
        </header>

        {/* Content */}
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
