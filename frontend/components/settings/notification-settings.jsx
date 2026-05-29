"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function NotificationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    email_alerts_transactions: true,
    email_alerts_bills: true,
    email_alerts_budgets: true,
    email_alerts_marketing: false,
    push_alerts_transactions: true,
    push_alerts_bills: true,
    push_alerts_budgets: true,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = await authApi.getCurrentUser()
        setSettings({
          email_alerts_transactions: user.email_alerts_transactions ?? true,
          email_alerts_bills: user.email_alerts_bills ?? true,
          email_alerts_budgets: user.email_alerts_budgets ?? true,
          email_alerts_marketing: user.email_alerts_marketing ?? false,
          push_alerts_transactions: user.push_alerts_transactions ?? true,
          push_alerts_bills: user.push_alerts_bills ?? true,
          push_alerts_budgets: user.push_alerts_budgets ?? true,
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notification settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [toast])

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authApi.updateProfile(settings)
      toast({
        title: "Success",
        description: "Notification preferences updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Configure how and when you receive notifications.</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Email Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-transactions" className="flex flex-col space-y-1">
              <span>Transaction Alerts</span>
              <span className="font-normal text-xs text-muted-foreground">
                Receive emails for deposits, withdrawals, and transfers.
              </span>
            </Label>
            <Switch 
              id="email-transactions" 
              checked={settings.email_alerts_transactions}
              onCheckedChange={() => handleToggle('email_alerts_transactions')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-bills" className="flex flex-col space-y-1">
              <span>Bill Reminders</span>
              <span className="font-normal text-xs text-muted-foreground">
                Get notified when bills are due or have been paid.
              </span>
            </Label>
            <Switch 
              id="email-bills" 
              checked={settings.email_alerts_bills}
              onCheckedChange={() => handleToggle('email_alerts_bills')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-budgets" className="flex flex-col space-y-1">
              <span>Budget Alerts</span>
              <span className="font-normal text-xs text-muted-foreground">
                Receive alerts when you're approaching budget limits.
              </span>
            </Label>
            <Switch 
              id="email-budgets" 
              checked={settings.email_alerts_budgets}
              onCheckedChange={() => handleToggle('email_alerts_budgets')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-marketing" className="flex flex-col space-y-1">
              <span>Marketing & Promotions</span>
              <span className="font-normal text-xs text-muted-foreground">
                Receive updates about new features and special offers.
              </span>
            </Label>
            <Switch 
              id="email-marketing" 
              checked={settings.email_alerts_marketing}
              onCheckedChange={() => handleToggle('email_alerts_marketing')}
            />
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Push Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-transactions" className="flex flex-col space-y-1">
              <span>Transaction Alerts</span>
              <span className="font-normal text-xs text-muted-foreground">
                Receive push notifications for account activity.
              </span>
            </Label>
            <Switch 
              id="push-transactions" 
              checked={settings.push_alerts_transactions}
              onCheckedChange={() => handleToggle('push_alerts_transactions')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-bills" className="flex flex-col space-y-1">
              <span>Bill Reminders</span>
              <span className="font-normal text-xs text-muted-foreground">Get notified when bills are due.</span>
            </Label>
            <Switch 
              id="push-bills" 
              checked={settings.push_alerts_bills}
              onCheckedChange={() => handleToggle('push_alerts_bills')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-budgets" className="flex flex-col space-y-1">
              <span>Budget Alerts</span>
              <span className="font-normal text-xs text-muted-foreground">Receive alerts for budget thresholds.</span>
            </Label>
            <Switch 
              id="push-budgets" 
              checked={settings.push_alerts_budgets}
              onCheckedChange={() => handleToggle('push_alerts_budgets')}
            />
          </div>
        </div>
      </div>
      <Separator />
      <Button onClick={handleSave} disabled={isLoading || isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </div>
  )
}
