
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { user, login, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username is either 'Admin' or 'Staff'
    if (username !== "Admin" && username !== "Staff") {
      toast.error("Invalid username. Please use 'Admin' or 'Staff'");
      return;
    }
    
    // Validate password based on username
    const validPassword = username === "Admin" ? "lohos@" : "lohosstaff@";
    if (password !== validPassword) {
      toast.error("Invalid password");
      return;
    }
    
    await login(username, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">LOHOS</h1>
          <p className="text-lg text-muted-foreground mt-2">Hostel Attendance Management</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-border">
          <h2 className="text-2xl font-medium mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter Admin or Staff"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-destructive p-2 bg-destructive/10 rounded">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p>Use the following credentials:</p>
            <p className="mt-2 font-medium">Admin / lohos@</p>
            <p className="font-medium">Staff / lohosstaff@</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
