import { cn } from "@/lib/utils" // Assuming cn is a utility function for classnames
import { X } from "lucide-react"
import { useState } from "react"

const TagInput = ({ value, onChange, className, ...props }) => {
	const [inputValue, setInputValue] = useState("")

	const handleInputChange = (e) => {
		setInputValue(e.target.value)
	}

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && inputValue) {
			e.preventDefault()
			const newValue = [...value, inputValue]
			onChange(newValue)
			setInputValue("") // Reset input value after adding tag
		} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
			const newValue = value.slice(0, -1)
			onChange(newValue) // Remove last tag if input is empty
		}
	}

	const handleRemoveTag = (index) => {
		const newValue = value.filter((_, i) => i !== index)
		onChange(newValue)
	}

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
				className
			)}
		>
			{/* Display Tags */}
			{value.map((tag, index) => (
				<span
					key={index}
					className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground"
				>
					{tag}
					<button
						type="button"
						onClick={() => handleRemoveTag(index)} // Remove tag when clicking the button
						className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					>
						<X className="h-3 w-3" />
						<span className="sr-only">Remove tag</span>
					</button>
				</span>
			))}

			{/* Input field for adding new tags */}
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
				{...props}
			/>
		</div>
	)
}

export default TagInput
