"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export function WalletsHeader() {
	return (
		<div className="mb-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold sm:text-3xl">My Wallets</h1>
					<p className="mt-1 text-muted-foreground">Manage and track all your financial accounts</p>
				</div>
				<Button asChild>
					<Link href="/add-wallet">
						<PlusCircle className="mr-2 h-4 w-4" />
						Add New Wallet
					</Link>
				</Button>
			</div>

			<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Input type="search" placeholder="Search wallets..." className="pl-4 pr-10" />
				</div>
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-9 gap-1">
								<Filter className="h-4 w-4" />
								Filter
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Filter By Type</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem checked>All Wallets</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Savings</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Budget</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Investment</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-9 gap-1">
								<SlidersHorizontal className="h-4 w-4" />
								Sort
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Sort By</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem checked>Name (A-Z)</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Name (Z-A)</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Balance (High-Low)</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Balance (Low-High)</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Last Updated</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	)
}
