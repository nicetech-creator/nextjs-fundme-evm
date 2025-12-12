# FundMe Dapp — Next.js + Wagmi + ConnectKit

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![React](https://img.shields.io/badge/React-18-149eca?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)  
![wagmi](https://img.shields.io/badge/wagmi-2.x-1f1f1f) ![viem](https://img.shields.io/badge/viem-2.x-1f1f1f) ![ConnectKit](https://img.shields.io/badge/ConnectKit-2.x-1f1f1f) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)

An Ethereum “Fund Me” dapp built with modern Next.js App Router, wallet connection via ConnectKit, contract interactions via wagmi/viem, and a clean Bootstrap UI.

## Features
- Wallet connect with `ConnectKitButton`
- Fund the contract using `fund` with ETH value
- Read on-chain data (owner) with `getOwner`
- Transaction tracking with confirmation status and a modal
- Client-side input validation and friendly error modals

## Tech Stack
- Next.js 14, React 18, TypeScript 5
- wagmi 2.x + viem 2.x
- ConnectKit 2.x
- Bootstrap 5.3 via CDN
- TanStack Query 5 for async data management

## Quick Start

### Prerequisites
- Node.js 20.12.0 or later is recommended (per Next.js guidance)
- A browser wallet (e.g., MetaMask)
- A deployed FundMe contract on `Sepolia` or `Mainnet`

### Setup
```bash
# Install dependencies
npm install

# Configure environment
# Copy the template and set your contract address
cp .env.template .env.local
# Edit .env.local:
# NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourFundMeContractAddress

# Start the dev server
npm run dev
# Open http://localhost:3000
```

### Production
```bash
npm run build
npm run start
```
Ensure `.env.local` (or appropriate env file) is present on the server with `NEXT_PUBLIC_CONTRACT_ADDRESS`.

## Configuration
- Contract address: `NEXT_PUBLIC_CONTRACT_ADDRESS` (must be prefixed with `NEXT_PUBLIC_` to be exposed to the client)
- The app trims the address (`lib/abi/FundMe.ts`) to avoid trailing spaces.

## Contract & ABI
- ABI and address are stored in `lib/abi/FundMe.ts`
- Example usage in the UI:
  - Read owner: `components/Interact.tsx` calls `useReadContract({ abi: fundMeAbi, address: fundMeAddress, functionName: 'getOwner' })`
  - Fund: `writeContract({ abi: fundMeAbi, address: fundMeAddress, functionName: 'fund', value: parseEther(amount) })`

## Transaction Tracking
- After sending a transaction, the app tracks confirmation with `useWaitForTransactionReceipt`
- A modal shows:
  - Hash (with a Copy button)
  - Block number
  - Etherscan link for `Mainnet` and `Sepolia`

## Project Structure
```
next/
├─ app/
│  ├─ layout.tsx         # App shell, Bootstrap CSS/JS via CDN
│  ├─ page.tsx           # Main page
│  └─ providers.tsx      # Wagmi, ConnectKit, QueryClient providers (client)
├─ components/
│  ├─ Header.tsx         # Navbar + ConnectKitButton (client)
│  ├─ Interact.tsx       # Contract UI: fund, read owner (client)
│  └─ Footer.tsx         # Simple footer
├─ lib/
│  ├─ wagmi.ts           # Wagmi config (chains and transports)
│  └─ abi/
│     └─ FundMe.ts       # ABI and address source
├─ next.config.js
├─ package.json
├─ tsconfig.json
├─ .env.template         # Env template (copy to .env.local)
└─ README.md
```

## Scripts
- `npm run dev` — Run the dev server
- `npm run build` — Build for production
- `npm run start` — Start the production server

## Troubleshooting
- Fund button disabled:
  - Connect your wallet
  - Fix invalid amount input
  - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` and restart the dev server
- Wrong network:
  - Switch your wallet to `Sepolia` or `Mainnet` to match the contract
- Bootstrap modal not opening:
  - The bundle is injected in `app/layout.tsx` via CDN; ensure network access
- Windows PowerShell execution policy blocks `npm`:
  - Use `npm.cmd run ...` or adjust execution policy per Microsoft docs

## Notes
- Client Components must include `'use client'` at the top; see `components/Interact.tsx`, `components/Header.tsx`, and `app/providers.tsx`.
- Environment variables with `NEXT_PUBLIC_` are statically injected; changes require a server restart.

## License
This project is provided as-is for learning and experimentation.

