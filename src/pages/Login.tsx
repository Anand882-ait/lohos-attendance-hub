
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { user, login, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
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
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
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
            <p>To create test users, use the Supabase dashboard.</p>
            <p className="mt-2">Username will be converted to email format:</p>
            <p className="italic">username@lohos.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
