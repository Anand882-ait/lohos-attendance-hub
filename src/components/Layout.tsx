
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  LogOut, 
  Home, 
  BookOpen, 
  Calendar, 
  User,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  if (!user) return <>{children}</>;

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Rooms", icon: BookOpen, path: "/rooms" },
    { name: "Attendance", icon: Calendar, path: "/attendance" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-16"
        } h-screen md:sticky fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-border flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 md:p-6">
          <h1 className={`text-2xl font-semibold text-primary tracking-tight ${!sidebarOpen && "md:hidden"}`}>LOHOS</h1>
          <p className={`text-sm text-muted-foreground ${!sidebarOpen && "md:hidden"}`}>Attendance</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors
                ${location.pathname.includes(item.path) 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <item.icon size={18} />
              <span className={!sidebarOpen ? "md:hidden" : ""}>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className={`p-4 border-t border-border ${!sidebarOpen && "md:hidden"}`}>
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
        <header className="sticky top-0 z-10 bg-white border-b border-border h-16 flex items-center px-4 md:px-6 justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="mr-2"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
            <h1 className="text-xl font-medium truncate">{title || "LOHOS Attendance"}</h1>
          </div>
          <div className="flex space-x-2">
            {/* Additional header elements */}
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
