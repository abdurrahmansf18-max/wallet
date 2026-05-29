"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InstallationPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="installation" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Installation
				</h1>
				<p className="text-muted-foreground">
					Learn how to install and set up Expenzo for your Next.js application.
				</p>
			</div>

			<div className="space-y-4">
				<h2 id="prerequisites" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Prerequisites
				</h2>
				<p>Before you begin, make sure you have the following installed on your system:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>
						<strong>Node.js 18.0.0</strong> or later
					</li>
					<li>
						<strong>npm 9.0.0</strong> or later (comes with Node.js) or <strong>yarn</strong> or <strong>pnpm</strong>
					</li>
					<li>Basic knowledge of React and Next.js</li>
				</ul>

				<h2 id="installation-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Installation Options
				</h2>
				<p>You can install Expenzo using one of the following methods:</p>

				<Tabs defaultValue="create-next-app">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="create-next-app">Create Next App</TabsTrigger>
						<TabsTrigger value="manual">Manual Setup</TabsTrigger>
						<TabsTrigger value="docker">Docker</TabsTrigger>
					</TabsList>

					<TabsContent value="create-next-app" className="space-y-4 mt-4">
						<h3 id="create-next-app" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Using Create Next App
						</h3>
						<p>The easiest way to get started with Expenzo is to use Create Next App with our template.</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>npx create-next-app@latest my-wallet-app --example https://github.com/Expenzo/template</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText(
										"npx create-next-app@latest my-wallet-app --example https://github.com/Expenzo/template",
									)
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
						<p>This will create a new Next.js project with Expenzo pre-configured and ready to use.</p>
					</TabsContent>

					<TabsContent value="manual" className="space-y-4 mt-4">
						<h3 id="manual-setup" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Manual Setup
						</h3>
						<p>If you already have an existing Next.js project, you can install Expenzo manually.</p>
						<h4 id="step-1" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 1: Create or use an existing Next.js project
						</h4>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>npx create-next-app@latest my-wallet-app</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText("npx create-next-app@latest my-wallet-app")
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

						<h4 id="step-2" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 2: Install Expenzo and its dependencies
						</h4>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>npm install @Expenzo/core @Expenzo/ui</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText("npm install @Expenzo/core @Expenzo/ui")
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

						<h4 id="step-3" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 3: Set up the configuration
						</h4>
						<p>
							Create a <code>Expenzo.config.js</code> file in the root of your project:
						</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// Expenzo.config.js
module.exports = {
  theme: {
    primaryColor: '#0070f3',
    layout: 'horizontal', // or 'vertical'
  },
  features: {
    wallets: true,
    budget: true,
    bills: true,
    goals: true,
    reports: true,
  },
  api: {
    baseUrl: process.env.API_URL || 'https://api.example.com',
  },
}`}</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText(`// Expenzo.config.js
module.exports = {
  theme: {
    primaryColor: '#0070f3',
    layout: 'horizontal', // or 'vertical'
  },
  features: {
    wallets: true,
    budget: true,
    bills: true,
    goals: true,
    reports: true,
  },
  api: {
    baseUrl: process.env.API_URL || 'https://api.example.com',
  },
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

						<h4 id="step-4" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 4: Import and use Expenzo components
						</h4>
						<p>Now you can import and use Expenzo components in your Next.js application:</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`// app/page.js
import { Dashboard } from '@Expenzo/ui'

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
  )
}`}</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText(`// app/page.js
import { Dashboard } from '@Expenzo/ui'

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
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
					</TabsContent>

					<TabsContent value="docker" className="space-y-4 mt-4">
						<h3 id="docker-setup" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Using Docker
						</h3>
						<p>You can also run Expenzo using Docker for a containerized setup.</p>
						<h4 id="docker-step-1" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 1: Create a Dockerfile
						</h4>
						<p>
							Create a <code>Dockerfile</code> in the root of your project:
						</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`}</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText(`FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`)
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

						<h4 id="docker-step-2" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 2: Create a docker-compose.yml file
						</h4>
						<p>
							Create a <code>docker-compose.yml</code> file in the root of your project:
						</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>{`version: '3'

services:
  Expenzo:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=https://api.example.com
      - NODE_ENV=production`}</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText(`version: '3'

services:
  Expenzo:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=https://api.example.com
      - NODE_ENV=production`)
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

						<h4 id="docker-step-3" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 3: Build and run the Docker container
						</h4>
						<p>Run the following command to build and start the Docker container:</p>
						<div className="relative my-4 rounded-md bg-muted p-4">
							<pre className="text-sm font-mono">
								<code>docker-compose up -d</code>
							</pre>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2"
								onClick={() => {
									navigator.clipboard.writeText("docker-compose up -d")
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
						<p>
							Your Expenzo application will now be running at <code>http://localhost:3000</code>.
						</p>
					</TabsContent>
				</Tabs>

				<h2 id="next-steps" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Next Steps
				</h2>
				<p>Now that you have installed Expenzo, you can:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>
						<a href="/docs/configuration/theme-config" className="text-primary hover:underline">
							Configure the theme
						</a>{" "}
						to match your brand
					</li>
					<li>
						<a href="/docs/guides/create-wallet" className="text-primary hover:underline">
							Create your first wallet
						</a>{" "}
						to start managing your finances
					</li>
					<li>
						<a href="/docs/api/authentication" className="text-primary hover:underline">
							Set up authentication
						</a>{" "}
						to secure your application
					</li>
				</ul>

				<h2 id="troubleshooting" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Troubleshooting
				</h2>
				<p>If you encounter any issues during installation, check the following:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Make sure you have the correct versions of Node.js and npm installed</li>
					<li>Check that all dependencies are properly installed</li>
					<li>Verify that your configuration file is correctly formatted</li>
					<li>Check the console for any error messages</li>
				</ul>
				<p className="mt-4">
					If you still have issues, please{" "}
					<a href="https://github.com/Expenzo/Expenzo/issues" className="text-primary hover:underline">
						open an issue
					</a>{" "}
					on our GitHub repository.
				</p>
			</div>
		</div>
	)
}
