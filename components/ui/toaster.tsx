"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <AnimatePresence>
        {toasts.map(({ id, title, description, action, ...props }) => {
          const Icon = props.variant === "destructive" ? AlertCircle : props.variant === "success" ? CheckCircle : Info

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Toast {...props}>
                <div className="flex items-start gap-2">
                  <Icon
                    className={`h-5 w-5 ${
                      props.variant === "destructive"
                        ? "text-destructive"
                        : props.variant === "success"
                          ? "text-green-500"
                          : "text-primary"
                    }`}
                  />
                  <div className="grid gap-1">
                    {title && <ToastTitle>{title}</ToastTitle>}
                    {description && <ToastDescription>{description}</ToastDescription>}
                  </div>
                </div>
                {action}
                <ToastClose />
              </Toast>
            </motion.div>
          )
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  )
}
