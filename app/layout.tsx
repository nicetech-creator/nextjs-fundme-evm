import Script from 'next/script'
import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'FundMe Dapp',
  description: 'Next.js + Wagmi + ConnectKit'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
