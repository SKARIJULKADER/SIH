// src/components/certificates/CertificateModal.tsx
//
// Theme-aware modal that displays the full "Certificate of Completion"
// design for a completed certification, with a Print / Save-as-PDF action.
import { useEffect } from 'react'
import { X, Printer, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { CertificateInfo } from '@/api/types'
import { CertificatePreview } from './CertificateTemplate'

interface CertificateModalProps {
  open: boolean
  onClose: () => void
  info: CertificateInfo
  certName: string
}

export const CertificateModal = ({ open, onClose, info, certName }: CertificateModalProps) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${certName} certificate`}
    >
      <div
        className="relative w-full max-w-5xl bg-surface border border-border rounded-2xl shadow-glow-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-text-heading truncate">🎓 {certName} — Certificate</h2>
            <Badge variant="success" size="sm" className="hidden sm:inline-flex items-center gap-1 shrink-0">
              <BadgeCheck size={12} /> Verified
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-heading hover:bg-surface-2 transition-colors"
            aria-label="Close certificate"
          >
            <X size={20} />
          </button>
        </div>

        {/* certificate */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto certificate-print-wrap">
          <div className="rounded-xl overflow-hidden border border-border-light shadow-lift">
            <CertificatePreview info={info} />
          </div>
          <p className="text-xs text-text-secondary text-center mt-4">
            Issued by DigiSpark Academy · Certificate ID{' '}
            <span className="font-semibold text-text-heading">{info.certificateId}</span> · Valid till {info.validTill}
          </p>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-border">
          <p className="text-xs text-text-secondary hidden sm:block">💡 Tip: use Print to save this certificate as a PDF.</p>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5" onClick={() => window.print()}>
              <Printer size={14} /> Print / Save PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
