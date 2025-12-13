'use client'
import { ConnectKitButton } from 'connectkit'

export default function Header() {
  return (
    <nav className="navbar bg-dark border-bottom navbar-dark">
      <div className="container">
        <span className="navbar-brand">FundMe Dapp</span>
        <ConnectKitButton />
      </div>
    </nav>
  )
}
