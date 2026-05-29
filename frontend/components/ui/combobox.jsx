"use client"

import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from "react"

const Combobox = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<div ref={ref} className={cn("relative", className)} {...props} />
	)
})
Combobox.displayName = "Combobox"

const ComboboxTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<PopoverTrigger asChild>
			<Button
				ref={ref}
				variant="outline"
				role="combobox"
				className={cn(
					"w-full justify-between",
					className
				)}
				{...props}
			>
				{children}
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>
	)
})
ComboboxTrigger.displayName = "ComboboxTrigger"

const ComboboxContent = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<Popover>
			<PopoverContent className="w-full p-0">
				<Command>
					{children}
				</Command>
			</PopoverContent>
		</Popover>
	)
})
ComboboxContent.displayName = "ComboboxContent"

const ComboboxInput = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<CommandInput
			ref={ref}
			className={cn("", className)}
			{...props}
		/>
	)
})
ComboboxInput.displayName = "ComboboxInput"

const ComboboxEmpty = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<CommandEmpty
			ref={ref}
			className={cn("py-6 text-center text-sm", className)}
			{...props}
		/>
	)
})
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxGroup = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<CommandGroup
			ref={ref}
			className={cn("", className)}
			{...props}
		/>
	)
})
ComboboxGroup.displayName = "ComboboxGroup"

const ComboboxItem = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<CommandItem
			ref={ref}
			className={cn("", className)}
			{...props}
		>
			{children}
			<Check className={cn(
				"ml-auto h-4 w-4",
				props.selected ? "opacity-100" : "opacity-0"
			)} />
		</CommandItem>
	)
})
ComboboxItem.displayName = "ComboboxItem"

export {
	Combobox, ComboboxContent, ComboboxEmpty,
	ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxTrigger
}

