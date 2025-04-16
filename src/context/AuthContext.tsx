
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, AuthContextType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile data including role
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, role")
            .eq("id", session.user.id)
            .single();
          
          setUser({
            id: session.user.id,
            username: profile?.username || session.user.email?.split('@')[0] || 'User',
            role: profile?.role as "admin" | "staff"
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch user profile data including role
        supabase
          .from("profiles")
          .select("username, role")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              id: session.user.id,
              username: profile?.username || session.user.email?.split('@')[0] || 'User',
              role: profile?.role as "admin" | "staff"
            });
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Map username to the correct email format for authentication
      const email = `${username.toLowerCase()}@lohos.edu`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success(`Welcome back, ${username}!`);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err.message);
      setError("Invalid login credentials. Please try again.");
      toast.error("Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Failed to log out");
      return;
    }
    
    setUser(null);
    setSession(null);
    navigate("/login");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
