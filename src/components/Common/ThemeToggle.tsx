"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-9 w-9 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center overflow-hidden transition-colors hover:bg-neutral-200 dark:hover:bg-white/20 border border-neutral-200 dark:border-white/10"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "light" ? (
            <Sun className="h-[1.1rem] w-[1.1rem] text-neutral-800" />
          ) : (
            <Moon className="h-[1.1rem] w-[1.1rem] text-white" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
