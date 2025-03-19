
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Key, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <Layout title="Profile">
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription className="capitalize text-base mt-1">{user.role}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Username</label>
                  <div className="flex items-center border rounded-md p-3 bg-muted/50">
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span>{user.username}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Email</label>
                  <div className="flex items-center border rounded-md p-3 bg-muted/50">
                    <Mail className="mr-3 h-4 w-4 text-primary" />
                    <span>{user.username.toLowerCase()}@lohos.edu</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Role</label>
                  <div className="flex items-center border rounded-md p-3 bg-muted/50">
                    <Shield className="mr-3 h-4 w-4 text-primary" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-3">Account Management</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-destructive hover:bg-destructive/10"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity & Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
              <CardDescription>Your system usage details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last login</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance entries</span>
                  <span>64</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reports generated</span>
                  <span>12</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Preferences</CardTitle>
              <CardDescription>Your personalized settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email notifications</span>
                  <span>Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Default view</span>
                  <span>Month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span>English</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
