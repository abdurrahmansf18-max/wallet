import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { authApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function SocialSecurityTab() {
  const [ssn, setSsn] = useState("")
  const [dob, setDob] = useState("")
  const [fullName, setFullName] = useState("")
  
  const [status, setStatus] = useState("unverified")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authApi.getCurrentUser()
        setStatus(user.identity_verification_status || "unverified")
        if (user.date_of_birth) setDob(user.date_of_birth)
        if (user.full_legal_name) setFullName(user.full_legal_name)
      } catch (error) {
        console.error("Failed to fetch user data for identity verification", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const formatSSN = (value) => {
    // Remove all non-digits
    const val = value.replace(/\D/g, "")
    let formatted = val
    if (val.length > 3) {
      formatted = val.slice(0, 3) + "-" + val.slice(3)
    }
    if (val.length > 5) {
      formatted = val.slice(0, 3) + "-" + val.slice(3, 5) + "-" + val.slice(5, 9)
    }
    return formatted
  }

  const handleSsnChange = (e) => {
    setSsn(formatSSN(e.target.value))
  }

  const handleSubmit = async () => {
    if (!ssn || ssn.length !== 11) {
      toast({ title: "Error", description: "Please enter a valid 9-digit SSN.", variant: "destructive" })
      return
    }
    if (!dob || !fullName) {
      toast({ title: "Error", description: "Please provide your Date of Birth and Full Legal Name.", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      const response = await authApi.verifyIdentity({
        ssn: ssn,
        date_of_birth: dob,
        full_legal_name: fullName
      })
      setStatus(response.identity_verification_status)
      toast({ title: "Success", description: "Identity verification submitted successfully. Status is pending." })
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: error.response?.data?.detail || "Failed to submit identity verification.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
            Unverified
          </Badge>
        )
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "verified":
        return "Your identity has been successfully verified."
      case "pending":
        return "Your Social Security verification is currently pending review."
      case "rejected":
        return "Your verification was rejected. Please check your information and try again."
      default:
        return "Your Social Security Card verification is not yet complete."
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  const isEditable = status === "unverified" || status === "rejected"

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Social Security Card Verification</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your identity by providing your Social Security information.
        </p>
      </div>

      <Separator />

      <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Security Notice</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              Your Social Security information is encrypted and securely stored. We use this information only for
              identity verification purposes and comply with all relevant privacy regulations.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="ssn">Social Security Number</Label>
          <Input 
            id="ssn" 
            type={status === "verified" ? "password" : "text"} 
            placeholder={status === "verified" || status === "pending" ? "***-**-****" : "XXX-XX-XXXX"} 
            value={ssn}
            onChange={handleSsnChange}
            disabled={!isEditable}
            maxLength={11}
          />
          {isEditable && <p className="text-xs text-muted-foreground">Enter your 9-digit Social Security Number (SSN).</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} disabled={!isEditable} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Legal Name</Label>
          <Input id="full-name" placeholder="As it appears on your Social Security Card" value={fullName} onChange={e => setFullName(e.target.value)} disabled={!isEditable} />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium mb-2">Verification Status</h3>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-sm text-muted-foreground">
            {getStatusMessage()}
          </span>
        </div>
      </div>

      {isEditable && (
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Identity
        </Button>
      )}
    </div>
  )
}
