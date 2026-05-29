"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import defaultConfig from "./config"

// Create the context
const ThemeContext = createContext({
  layout: defaultConfig.defaultLayout,
  setLayout: () => {},
  direction: defaultConfig.defaultDirection,
  setDirection: () => {},
  primaryColor: defaultConfig.colors?.defaultPrimaryColor || "teal",
  setPrimaryColor: () => {},
  config: defaultConfig,
})

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext)

// Custom hook that combines theme context with next-themes
export const useTheme = () => {
  const nextTheme = useNextTheme()
  const themeContext = useThemeContext()

  return {
    ...nextTheme,
    ...themeContext,
  }
}

export function ThemeProvider({ children }) {
  // Layout and direction state
  const [layout, setLayout] = useState(defaultConfig.defaultLayout)
  const [direction, setDirection] = useState(defaultConfig.defaultDirection)
  const [primaryColor, setPrimaryColor] = useState(defaultConfig.colors?.defaultPrimaryColor || "teal")
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Load saved preferences from localStorage if available
    try {
      const savedLayout = localStorage.getItem("layout")
      const savedDirection = localStorage.getItem("direction")
      const savedColor = localStorage.getItem("primaryColor")

      if (savedLayout && defaultConfig.availableLayouts.includes(savedLayout)) {
        setLayout(savedLayout)
      }

      if (savedDirection && defaultConfig.availableDirections.includes(savedDirection)) {
        setDirection(savedDirection)
      }

      if (savedColor) {
        setPrimaryColor(savedColor)
        document.documentElement.style.setProperty("--primary", `var(--${savedColor})`)
        document.documentElement.style.setProperty("--primary-foreground", `var(--${savedColor}-foreground)`)
      } else {
        const defaultCol = defaultConfig.colors?.defaultPrimaryColor || "teal"
        document.documentElement.style.setProperty("--primary", `var(--${defaultCol})`)
        document.documentElement.style.setProperty("--primary-foreground", `var(--${defaultCol}-foreground)`)
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error)
    }
  }, [])

  // Handle layout change
  const handleLayoutChange = (newLayout) => {
    if (newLayout !== layout) {
      setLayout(newLayout)
    }
  }

  // Handle direction change
  const handleDirectionChange = (newDirection) => {
    if (newDirection !== direction) {
      setDirection(newDirection)
    }
  }

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("layout", layout)
        localStorage.setItem("direction", direction)

        // Apply direction to html element
        document.documentElement.dir = direction
      } catch (error) {
        console.error("Error saving theme preferences:", error)
      }
    }
  }, [layout, direction, mounted])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      layout,
      setLayout: handleLayoutChange,
      direction,
      setDirection: handleDirectionChange,
      primaryColor,
      setPrimaryColor,
      config: defaultConfig,
    }),
    [layout, direction, primaryColor],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={defaultConfig.themeOptions.defaultTheme}
        enableSystem={defaultConfig.themeOptions.enableSystem}
        disableTransitionOnChange={defaultConfig.themeOptions.disableTransitionOnChange}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}
