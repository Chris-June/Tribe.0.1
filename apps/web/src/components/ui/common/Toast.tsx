import React from 'react'
import { Toaster, toast } from 'sonner'

export const Toast = {
  success: (message: string, description?: string) => 
    toast.success(message, { description }),
  
  error: (message: string, description?: string) => 
    toast.error(message, { description }),
  
  info: (message: string, description?: string) => 
    toast.info(message, { description }),
  
  warning: (message: string, description?: string) => 
    toast.warning(message, { description }),
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
      />
    </>
  )
}
