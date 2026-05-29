"use client"

import { AccountSettings } from "@/components/settings/account-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { EmailVerificationTab } from "@/components/settings/email-verification-tab"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PhoneVerificationTab } from "@/components/settings/phone-verification-tab"
import { SecuritySettings } from "@/components/settings/security-settings"
import { SocialSecurityTab } from "@/components/settings/social-security-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define tabs configuration for easier maintenance
const TABS = [
	{ id: "account", label: "Profile", component: AccountSettings },
	{ id: "notifications", label: "Notifications", component: NotificationSettings },
	{ id: "security", label: "Security", component: SecuritySettings },
	{ id: "appearance", label: "Appearance", component: AppearanceSettings },
	{ id: "social-security", label: "Social Security", component: SocialSecurityTab },
	{ id: "email-verification", label: "Email Verification", component: EmailVerificationTab },
	{ id: "phone-verification", label: "Phone Verification", component: PhoneVerificationTab },
]

export function SettingsTabs({ activeTab, setActiveTab }) {
	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<div className="pb-2">
				<TabsList className="flex flex-wrap h-auto gap-1 p-1">
					{TABS.map((tab) => (
						<TabsTrigger key={tab.id} value={tab.id} className="h-9 px-3 text-xs sm:text-sm md:px-4">
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>

			{TABS.map((tab) => {
				const TabComponent = tab.component
				return (
					<TabsContent key={tab.id} value={tab.id} className="mt-4 sm:mt-6">
						<TabComponent />
					</TabsContent>
				)
			})}
		</Tabs>
	)
}
