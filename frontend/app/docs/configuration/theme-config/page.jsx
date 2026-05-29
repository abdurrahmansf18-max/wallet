"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ThemeConfigPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="theme-configuration" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Theme Configuration
				</h1>
				<p className="text-xl text-muted-foreground">
					Customize the appearance and behavior of your Expenzo application.
				</p>
			</div>

			<div className="space-y-4">
				<h2 id="overview" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Overview
				</h2>
				<p>
					Expenzo provides a flexible theme configuration system that allows you to customize the layout, direction,
					and theme of your application. The configuration is defined in the <code>components/theme/config.jsx</code>{" "}
					file.
				</p>

				<h2 id="default-configuration" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Default Configuration
				</h2>
				<p>Here's the default theme configuration:</p>

				<div className="relative my-6 rounded-md bg-muted p-4 overflow-x-auto">
					<pre className="text-sm font-mono">
						<code>{`// Theme configuration options
const defaultConfig = {
  // Default layout (vertical or horizontal)
  defaultLayout: "vertical",

  // Default direction (ltr or rtl)
  defaultDirection: "ltr",

  // Theme options for next-themes
  themeOptions: {
    // Default theme (light, dark, or system)
    defaultTheme: "system",

    // Enable system theme detection
    enableSystem: true,

    // Disable automatic theme detection
    disableTransitionOnChange: false,
  },

  // Available layout options
  availableLayouts: ["vertical", "horizontal"],

  // Available direction options
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`}</code>
					</pre>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-2 top-2"
						onClick={() => {
							navigator.clipboard.writeText(`// Theme configuration options
const defaultConfig = {
  // Default layout (vertical or horizontal)
  defaultLayout: "vertical",

  // Default direction (ltr or rtl)
  defaultDirection: "ltr",

  // Theme options for next-themes
  themeOptions: {
    // Default theme (light, dark, or system)
    defaultTheme: "system",

    // Enable system theme detection
    enableSystem: true,

    // Disable automatic theme detection
    disableTransitionOnChange: false,
  },

  // Available layout options
  availableLayouts: ["vertical", "horizontal"],

  // Available direction options
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`)
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

				<h2 id="configuration-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Configuration Options
				</h2>

				<h3 id="layout-options" className="scroll-m-20 text-xl font-semibold tracking-tight pt-4">
					Layout Options
				</h3>
				<p>Expenzo supports two layout options:</p>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>vertical</strong> - The navigation menu is displayed on the left side of the screen. This is the
						default layout.
					</li>
					<li>
						<strong>horizontal</strong> - The navigation menu is displayed at the top of the screen.
					</li>
				</ul>
				<p>
					You can set the default layout using the <code>defaultLayout</code> option:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`defaultLayout: "vertical", // or "horizontal"`}</code>
					</pre>
				</div>
				<p>
					The available layout options are defined in the <code>availableLayouts</code> array:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`availableLayouts: ["vertical", "horizontal"],`}</code>
					</pre>
				</div>

				<h3 id="direction-options" className="scroll-m-20 text-xl font-semibold tracking-tight pt-6">
					Direction Options
				</h3>
				<p>Expenzo supports two text direction options:</p>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>ltr</strong> - Left-to-right text direction. This is the default direction and is used for languages
						like English, Spanish, etc.
					</li>
					<li>
						<strong>rtl</strong> - Right-to-left text direction. This is used for languages like Arabic, Hebrew, etc.
					</li>
				</ul>
				<p>
					You can set the default direction using the <code>defaultDirection</code> option:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`defaultDirection: "ltr", // or "rtl"`}</code>
					</pre>
				</div>
				<p>
					The available direction options are defined in the <code>availableDirections</code> array:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`availableDirections: ["ltr", "rtl"],`}</code>
					</pre>
				</div>

				<h3 id="theme-options" className="scroll-m-20 text-xl font-semibold tracking-tight pt-6">
					Theme Options
				</h3>
				<p>
					Expenzo uses <code>next-themes</code> for theme management. The theme options are defined in the{" "}
					<code>themeOptions</code> object:
				</p>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>defaultTheme</strong> - The default theme to use. Can be <code>"light"</code>, <code>"dark"</code>,
						or <code>"system"</code>.
					</li>
					<li>
						<strong>enableSystem</strong> - Whether to enable system theme detection. When set to <code>true</code>, the
						theme will automatically match the user's system preferences.
					</li>
					<li>
						<strong>disableTransitionOnChange</strong> - Whether to disable CSS transitions when changing themes. This
						can help prevent flickering when switching themes.
					</li>
				</ul>

				<h2 id="customizing-configuration" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Customizing Configuration
				</h2>
				<p>
					You can customize the theme configuration by modifying the <code>components/theme/config.jsx</code> file. Here
					are some examples:
				</p>

				<Tabs defaultValue="horizontal-layout">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="horizontal-layout">Horizontal Layout</TabsTrigger>
						<TabsTrigger value="rtl-support">RTL Support</TabsTrigger>
						<TabsTrigger value="dark-theme">Dark Theme</TabsTrigger>
					</TabsList>

					<TabsContent value="horizontal-layout" className="space-y-4 mt-4">
						<h3 id="horizontal-layout" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Setting Horizontal Layout as Default
						</h3>
						<p>To set the horizontal layout as the default:</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Theme configuration options
const defaultConfig = {
  // Set horizontal layout as default
  defaultLayout: "horizontal",
  
  // Other options remain the same
  defaultDirection: "ltr",
  themeOptions: {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`}</code>
							</pre>
						</div>
					</TabsContent>

					<TabsContent value="rtl-support" className="space-y-4 mt-4">
						<h3 id="rtl-support" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Enabling RTL Support
						</h3>
						<p>To set right-to-left (RTL) as the default direction:</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Theme configuration options
const defaultConfig = {
  defaultLayout: "vertical",
  
  // Set RTL as default direction
  defaultDirection: "rtl",
  
  themeOptions: {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`}</code>
							</pre>
						</div>
					</TabsContent>

					<TabsContent value="dark-theme" className="space-y-4 mt-4">
						<h3 id="dark-theme" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Setting Dark Theme as Default
						</h3>
						<p>To set the dark theme as the default:</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Theme configuration options
const defaultConfig = {
  defaultLayout: "vertical",
  defaultDirection: "ltr",
  
  themeOptions: {
    // Set dark theme as default
    defaultTheme: "dark",
    
    // Disable system theme detection
    enableSystem: false,
    
    disableTransitionOnChange: false,
  },
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`}</code>
							</pre>
						</div>
					</TabsContent>
				</Tabs>

				<h2 id="using-configuration" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Using Configuration in Your Application
				</h2>
				<p>
					The theme configuration is used by the <code>ThemeProvider</code> component to set up the theme for your
					application. Here's how it's used:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`// components/theme/theme-provider.jsx
import { ThemeProvider as NextThemesProvider } from "next-themes"
import defaultConfig from "./config"

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultConfig.themeOptions.defaultTheme}
      enableSystem={defaultConfig.themeOptions.enableSystem}
      disableTransitionOnChange={defaultConfig.themeOptions.disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  )
}`}</code>
					</pre>
				</div>

				<h2 id="advanced-customization" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Advanced Customization
				</h2>
				<p>
					For more advanced customization, you can modify the theme configuration to include additional options. For
					example, you might want to add custom color schemes or font options:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`// Theme configuration options with advanced customization
const defaultConfig = {
  defaultLayout: "vertical",
  defaultDirection: "ltr",
  
  themeOptions: {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  
  // Custom color schemes
  colorSchemes: {
    default: {
      primary: "#0070f3",
      secondary: "#7928ca",
      accent: "#f5a623",
    },
    blue: {
      primary: "#2563eb",
      secondary: "#3b82f6",
      accent: "#60a5fa",
    },
    green: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
    },
  },
  
  // Default color scheme
  defaultColorScheme: "default",
  
  // Font options
  fonts: {
    sans: "Inter, sans-serif",
    mono: "Menlo, monospace",
  },
  
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`}</code>
					</pre>
				</div>
				<p>You would then need to update your application to use these additional configuration options.</p>

				<h2 id="best-practices" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Best Practices
				</h2>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>User Preferences</strong> - Allow users to change theme settings through a settings page.
					</li>
					<li>
						<strong>Persistence</strong> - Save user preferences in local storage or a database to persist them across
						sessions.
					</li>
					<li>
						<strong>Accessibility</strong> - Ensure that all themes have sufficient contrast ratios for accessibility.
					</li>
					<li>
						<strong>Testing</strong> - Test your application with different theme configurations to ensure it works
						correctly.
					</li>
				</ul>
			</div>
		</div>
	)
}
