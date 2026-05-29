"use client"

import { Layout } from "@/components/layout"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState("account")

	return (
		<Layout>
			<div>
				<div className="mb-4 sm:mb-6">
					<h1 className="text-xl sm:text-2xl font-semibold">Settings</h1>
					<p className="text-muted-foreground text-sm">Manage your account preferences and settings.</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Account Settings</CardTitle>
						<CardDescription>Manage your account preferences and settings.</CardDescription>
					</CardHeader>
					<CardContent>
						<SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
					</CardContent>
				</Card>
			</div>
		</Layout>
	)
}
