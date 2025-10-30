import { Toaster as HotToaster } from 'react-hot-toast'

export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--glass-bg) / 0.9)',
          backdropFilter: 'blur(16px)',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--glass-border) / 0.3)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: 'var(--shadow-glass)',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: 'hsl(var(--success))',
            secondary: 'hsl(var(--success-foreground))',
          },
          style: {
            border: '1px solid hsl(var(--success) / 0.3)',
          },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--destructive-foreground))',
          },
          style: {
            border: '1px solid hsl(var(--destructive) / 0.3)',
          },
        },
        loading: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--primary-foreground))',
          },
        },
      }}
    />
  )
}
