// src/components/ui/Modal.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open, onClose, title, size = 'md', closeOnOverlayClick = true, children, ...props }, ref) => {
    if (!open) return null
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    }
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <div
          ref={ref}
          className={cn(
            'relative w-full mx-4 bg-surface border border-border rounded-xl shadow-glow-lg',
            sizes[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text-heading">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-heading hover:bg-surface-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    )
  },
)
Modal.displayName = 'Modal'
