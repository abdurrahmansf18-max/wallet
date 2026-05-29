"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChangeLogoPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="changing-logo" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Changing the Logo
				</h1>
				<p className="text-xl text-muted-foreground">Learn how to customize the Expenzo logo to match your brand.</p>
			</div>

			<div className="space-y-4">
				<h2 id="overview" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Overview
				</h2>
				<p>
					The Expenzo logo is defined in the <code>components/logo.jsx</code> file. You can customize the logo by
					modifying this file to use your own icon, text, or both.
				</p>

				<h2 id="current-logo" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Current Logo Implementation
				</h2>
				<p>Here's the current implementation of the logo component:</p>

				<div className="relative my-6 rounded-md bg-muted p-4 overflow-x-auto">
					<pre className="text-sm font-mono">
						<code>{`import Link from "next/link"
import { Wallet } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-base",
    },
    default: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-12 h-12",
      icon: "h-7 w-7",
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center bg-primary rounded-md", sizeConfig.container)}>
        <Wallet className={cn("text-primary-foreground", sizeConfig.icon)} />
      </div>
      {showText && <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>Expenzo</span>}
    </Link>
  )
}`}</code>
					</pre>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-2 top-2"
						onClick={() => {
							navigator.clipboard.writeText(`import Link from "next/link"
import { Wallet } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-base",
    },
    default: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-12 h-12",
      icon: "h-7 w-7",
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center bg-primary rounded-md", sizeConfig.container)}>
        <Wallet className={cn("text-primary-foreground", sizeConfig.icon)} />
      </div>
      {showText && <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>Expenzo</span>}
    </Link>
  )
}`)
						}}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
						>
							<path
								d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
								fill="currentColor"
								fillRule="evenodd"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="sr-only">Copy code</span>
					</Button>
				</div>

				<h2 id="customization-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Customization Options
				</h2>

				<Tabs defaultValue="icon">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="icon">Change Icon</TabsTrigger>
						<TabsTrigger value="text">Change Text</TabsTrigger>
						<TabsTrigger value="custom">Custom Logo</TabsTrigger>
					</TabsList>

					<TabsContent value="icon" className="space-y-4 mt-4">
						<h3 id="changing-icon" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Changing the Icon
						</h3>
						<p>
							The current logo uses the <code>Wallet</code> icon from the <code>lucide-react</code> package. You can
							replace it with any other icon from the same package or use a custom SVG.
						</p>

						<h4 className="text-lg font-medium mt-4">Using a Different Lucide Icon</h4>
						<p>
							To use a different icon from <code>lucide-react</code>, simply import the desired icon and replace the{" "}
							<code>Wallet</code> component:
						</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Import a different icon
import { CreditCard } from 'lucide-react'

// Then replace the Wallet component with CreditCard
<CreditCard className={cn("text-primary-foreground", sizeConfig.icon)} />`}</code>
							</pre>
						</div>

						<h4 className="text-lg font-medium mt-4">Using a Custom SVG</h4>
						<p>You can also use a custom SVG icon by replacing the Lucide icon with an inline SVG:</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Replace the Wallet icon with a custom SVG
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className={cn("text-primary-foreground", sizeConfig.icon)}
>
  {/* Your custom SVG path here */}
  <path d="M12 2L2 7l10 5 10-5-10-5z" />
  <path d="M2 17l10 5 10-5" />
  <path d="M2 12l10 5 10-5" />
</svg>`}</code>
							</pre>
						</div>

						<h4 className="text-lg font-medium mt-4">Using an Image</h4>
						<p>
							If you prefer to use an image file (PNG, JPG, etc.) for your logo, you can use the Next.js{" "}
							<code>Image</code> component:
						</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`import Image from "next/image"

// Then replace the icon with an Image component
<div className={cn("relative flex items-center justify-center", sizeConfig.container)}>
  <Image
    src="/your-logo.png"
    alt="Your Logo"
    width={24}
    height={24}
    className={cn("object-contain", sizeConfig.icon)}
  />
</div>`}</code>
							</pre>
						</div>
					</TabsContent>

					<TabsContent value="text" className="space-y-4 mt-4">
						<h3 id="changing-text" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Changing the Text
						</h3>
						<p>
							You can change the text of the logo by modifying the text content in the <code>span</code> element:
						</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Change the text from "Expenzo" to your brand name
{showText && <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>YourBrandName</span>}`}</code>
							</pre>
						</div>

						<h4 className="text-lg font-medium mt-4">Styling the Text</h4>
						<p>You can also customize the styling of the text by modifying the classes:</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Add custom styling to the text
{showText && (
  <span className={cn(
    "font-semibold tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500",
    sizeConfig.text
  )}>
    YourBrandName
  </span>
)}`}</code>
							</pre>
						</div>

						<h4 className="text-lg font-medium mt-4">Using a Custom Font</h4>
						<p>
							If you want to use a custom font for your logo text, you can add the font to your project and apply it to
							the text:
						</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// In your globals.css file
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

/* Then in your Logo component */
{showText && (
  <span className={cn(
    "font-semibold tracking-tight font-pacifico",
    sizeConfig.text
  )}>
    YourBrandName
  </span>
)}`}</code>
							</pre>
						</div>

						<p className="mt-4">
							Don't forget to add the custom font to your Tailwind configuration in <code>tailwind.config.js</code>:
						</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// In tailwind.config.js
module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      },
      // ...
    },
  },
  // ...
}`}</code>
							</pre>
						</div>
					</TabsContent>

					<TabsContent value="custom" className="space-y-4 mt-4">
						<h3 id="custom-logo" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Implementing a Completely Custom Logo
						</h3>
						<p>
							If you want to completely replace the logo with a custom design, you can modify the entire{" "}
							<code>Logo</code> component:
						</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      logo: { width: 24, height: 24 },
      text: "text-base",
    },
    default: {
      logo: { width: 32, height: 32 },
      text: "text-xl",
    },
    large: {
      logo: { width: 48, height: 48 },
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/your-custom-logo.svg"
        alt="Your Brand Logo"
        width={sizeConfig.logo.width}
        height={sizeConfig.logo.height}
        className="object-contain"
      />
      {showText && (
        <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>
          YourBrandName
        </span>
      )}
    </Link>
  )
}`}</code>
							</pre>
						</div>

						<h4 className="text-lg font-medium mt-4">Logo Only (No Text)</h4>
						<p>If you prefer to use only a logo without any text, you can simplify the component:</p>

						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: { width: 24, height: 24 },
    default: { width: 32, height: 32 },
    large: { width: 48, height: 48 },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/your-custom-logo.svg"
        alt="Your Brand Logo"
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="object-contain"
      />
    </Link>
  )
}`}</code>
							</pre>
						</div>
					</TabsContent>
				</Tabs>

				<h2 id="complete-example" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Complete Example
				</h2>
				<p>Here's a complete example of a customized logo component:</p>

				<div className="relative my-6 rounded-md bg-muted p-4 overflow-x-auto">
					<pre className="text-sm font-mono">
						<code>{`import Link from "next/link"
import { CreditCard } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-base",
    },
    default: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-12 h-12",
      icon: "h-7 w-7",
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center bg-blue-600 rounded-full", sizeConfig.container)}>
        <CreditCard className={cn("text-white", sizeConfig.icon)} />
      </div>
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400",
          sizeConfig.text
        )}>
          FinanceTracker
        </span>
      )}
    </Link>
  )
}`}</code>
					</pre>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-2 top-2"
						onClick={() => {
							navigator.clipboard.writeText(`import Link from "next/link"
import { CreditCard } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-base",
    },
    default: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-12 h-12",
      icon: "h-7 w-7",
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center bg-blue-600 rounded-full", sizeConfig.container)}>
        <CreditCard className={cn("text-white", sizeConfig.icon)} />
      </div>
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400",
          sizeConfig.text
        )}>
          FinanceTracker
        </span>
      )}
    </Link>
  )
}`)
						}}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
						>
							<path
								d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
								fill="currentColor"
								fillRule="evenodd"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="sr-only">Copy code</span>
					</Button>
				</div>

				<h2 id="best-practices" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Best Practices
				</h2>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>Responsive Design</strong> - Ensure your logo looks good at all sizes by using the size variants.
					</li>
					<li>
						<strong>Accessibility</strong> - Make sure your logo has sufficient contrast and includes proper alt text
						for images.
					</li>
					<li>
						<strong>File Formats</strong> - Use SVG for vector logos when possible for better scaling and smaller file
						sizes.
					</li>
					<li>
						<strong>Performance</strong> - Optimize image files to keep them as small as possible without sacrificing
						quality.
					</li>
					<li>
						<strong>Consistency</strong> - Keep your logo consistent with your brand guidelines and overall design
						aesthetic.
					</li>
				</ul>
			</div>
		</div>
	)
}
