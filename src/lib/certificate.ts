// src/lib/certificate.ts
//
// Resolves the CertificateInfo used by CertificateTemplate. Certifications
// with explicit `certificate` data (e.g. Python Developer, Web Development)
// use it verbatim; other completed certifications get a sensible generated
// fallback so every "View Certificate" button works.
import type { Certification, CertificateInfo } from '@/api/types'

/** Deterministic pseudo-ID from the cert id so previews are stable */
const hashId = (id: string): string => {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return String(1000 + (h % 9000))
}

const sealFor = (name: string): CertificateInfo['seal'] => {
  if (/python/i.test(name)) return 'python'
  if (/web|full.?stack|javascript|react|sql|database|cloud|dev/i.test(name)) return 'code'
  return 'star'
}

export function buildCertificateInfo(cert: Certification): CertificateInfo {
  if (cert.certificate) return cert.certificate
  const initials = (cert.name.match(/\b[A-Za-z]/g) ?? ['G']).join('').toUpperCase().slice(0, 3)
  return {
    title: cert.name.toUpperCase(),
    recipient: 'Taniya Singh',
    certificateId: `DS-${initials}-2024-${hashId(cert.id)}`,
    issueDate: '25 May 2024',
    validTill: '25 May 2026',
    note: `This certification acknowledges the recipient's proficiency in ${cert.description.replace(/\.$/, '')}, and building real-world projects.`,
    seal: sealFor(cert.name),
  }
}
