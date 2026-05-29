import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, CheckCircle } from "lucide-react"

export function EmailVerificationTab() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Email Verification</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your email address to secure your account and receive important notifications.
        </p>
      </div>

      <Separator />

      <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/30">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-400">Email Verified</h3>
            <p className="text-sm text-green-700 dark:text-green-500 mt-1">
              Your email address (john.doe@example.com) has been successfully verified.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="current-email">Current Email</Label>
          <div className="flex items-center gap-2">
            <Input id="current-email" value="john.doe@example.com" readOnly />
            <Badge className="bg-green-500">Verified</Badge>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Change Email Address</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-email">New Email Address</Label>
              <Input id="new-email" type="email" placeholder="Enter new email address" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="Enter your current password" />
            </div>
            <Button variant="outline">Update Email</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
