"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { authApi } from "@/lib/api"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function SecuritySettings() {
  const { toast } = useToast()
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePasswordChange = (e) => {
    const { id, value } = e.target
    // Map HTML IDs to state keys
    const key = id === "current-password" ? "current_password" : 
                id === "new-password" ? "new_password" : "confirm_new_password"
    setPasswords(prev => ({ ...prev, [key]: value }))
  }

  const submitPasswordChange = async () => {
    // Basic frontend validation
    if (!passwords.current_password || !passwords.new_password || !passwords.confirm_new_password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (passwords.current_password === passwords.new_password) {
      toast({
        title: "Error",
        description: "The new password cannot be the same as the current password.",
        variant: "destructive",
      })
      return
    }

    if (passwords.new_password !== passwords.confirm_new_password) {
      toast({
        title: "Error",
        description: "The new passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwords.new_password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Your password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await authApi.changePassword(passwords)
      
      toast({
        title: "Success",
        description: "Your password has been changed successfully.",
      })
      
      // Clear form
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_new_password: ""
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Operation Failed",
        description: error.response?.data?.detail || "An error occurred while changing the password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication methods.</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Change Password</h4>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input 
                id="current-password" 
                type={showPasswords.current ? "text" : "password"} 
                className="pr-10"
                value={passwords.current_password}
                onChange={handlePasswordChange}
              />
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input 
                id="new-password" 
                type={showPasswords.new ? "text" : "password"} 
                className="pr-10"
                value={passwords.new_password}
                onChange={handlePasswordChange}
              />
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input 
                id="confirm-password" 
                type={showPasswords.confirm ? "text" : "password"} 
                className="pr-10"
                value={passwords.confirm_new_password}
                onChange={handlePasswordChange}
              />
              <button 
                type="button" 
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button 
            className="w-full sm:w-auto" 
            onClick={submitPasswordChange}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Update Password"}
          </Button>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
          <Switch id="2fa" />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Login Sessions</h4>
        <div className="rounded-md border">
          <div className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">Current Session</div>
              <div className="text-sm text-muted-foreground">Windows • Chrome • New York, USA</div>
              <div className="text-xs text-muted-foreground mt-1">Started: Today, 10:30 AM</div>
            </div>
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
          </div>
          <Separator />
          <div className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">Mobile App</div>
              <div className="text-sm text-muted-foreground">iOS • iPhone • New York, USA</div>
              <div className="text-xs text-muted-foreground mt-1">Last active: Yesterday, 8:15 PM</div>
            </div>
            <Button variant="outline" size="sm">
              Revoke
            </Button>
          </div>
        </div>
        <Button variant="outline">Sign Out All Devices</Button>
      </div>
    </div>
  )
}
