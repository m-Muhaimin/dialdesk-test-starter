import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex',
  weight: ['400', '500', '600', '700'],
})
const spaceGroteskHeading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
})
const url = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: 'DialDesk: AI phone receptionist for plumbers and HVAC companies', template: '%s | DialDesk' },
  description: 'Answers every call while you are on the job, flags emergencies to your on-call tech, and books repairs into arrival windows.',
  icons: {
    icon: [{ url: '/dialdesk-mark.svg', type: 'image/svg+xml' }],
    shortcut: ['/dialdesk-mark.svg'],
    apple: [{ url: '/dialdesk-mark.svg', type: 'image/svg+xml' }],
  },
  openGraph: { type: 'website', title: 'DialDesk', description: 'Every call answered, every emergency flagged, every job booked.', url },
  robots: { index: true, follow: true },
}
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f6f7fb' }, { media: '(prefers-color-scheme: dark)', color: '#0d0e1a' }],
  width: 'device-width', initialScale: 1,
}

const THEME_INIT = "try{var t=localStorage.getItem('dd-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(ibmPlexSans.variable, spaceGroteskHeading.variable, 'font-sans')} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body className="min-h-screen bg-canvas text-ink antialiased">{children}</body>
    </html>
  )
}
