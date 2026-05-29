import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Phone, Clock } from "lucide-react"

export function PhoneVerificationTab() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Phone Verification</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your phone number for additional security and account recovery options.
        </p>
      </div>

      <Separator />

      <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Verification Pending</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              Your phone number needs to be verified. We'll send a verification code to your phone.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="phone-number">Phone Number</Label>
          <Input id="phone-number" type="tel" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
          <p className="text-xs text-muted-foreground">Enter your phone number with country code.</p>
        </div>

        <Button>Send Verification Code</Button>

        <div className="grid gap-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <div className="flex gap-2">
            <Input id="verification-code" placeholder="Enter 6-digit code" />
            <Button variant="outline">Verify</Button>
          </div>
          <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to your phone.</p>
        </div>
      </div>
    </div>
  )
}
