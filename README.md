# Zeteo

Starknet users currently juggle fragmented and risky tools for portfolio tracking, airdrop claims, and bridging. Zeteo unifies the entire lifecycle into a single, privacy-first dashboard powered by ZK-proofs, our custom Bitcoin bridge, and on-chain intelligence subscriptions.

## The Problem
Navigating the Starknet ecosystem today is fragmented and risky. Users juggle multiple tools to track portfolios, hunt for airdrops, and bridge assets often exposing sensitive wallet data on-chain in the process. There is no unified, privacy-first platform that lets users manage their entire Starknet lifecycle in one place.

## How Zeteo Solves It
- **Unified Dashboard**: A real-time portfolio manager lets users monitor token balances and values across their Starknet wallets (Argent X & Braavos) in a single, sleek interface.
- **Privacy-Preserving Airdrop Claims (ZK-Privacy Mode)**: Zeteo integrates Garaga-powered Zero-Knowledge proofs so users can verify airdrop eligibility and claim allocations without revealing their wallet data on-chain. This is a first-of-its-kind privacy layer for airdrop distribution on Starknet.
- **Bitcoin Bridge via Zeteo Bridge**: Zeteo integrates the Zeteo Bridge directly into the platform, allowing users to bridge BTC assets into Starknet.
- **On-Chain Subscription System**: A Cairo smart contract manages tiered subscription plans (Basic, Standard, Premium) entirely on-chain. Subscriptions are additive, upgrading mid-cycle rolls remaining time into the new tier. Pricing integrates with Pragma Oracle for real-time ETH/USD conversion.
- **Airdrop Intelligence**: A curated, real-time tracker surfaces the most valuable airdrops on Starknet and other L2s, with priority notifications and advanced analytics for premium subscribers.

## Tech Stack
- **Frontend**: Next.js 16 (App Router) + React 19, styled with Tailwind CSS 4 and Framer Motion animations
- **Smart Contracts**: Cairo (Starknet), featuring subscription management, ZK-proof verification via Garaga, and Pragma Oracle integration
- **Bridge**: Zeteo Bridge (Our own platform bridge for Bitcoin assets)
- **Backend Services**: Next.js API Routes + Redis caching (24-hour TTL) + background worker service for data sync
- **Blockchain**: Starknet.js for on-chain interaction

## Why It Matters
Zeteo redefines how users interact with Starknet by combining portfolio management, privacy-first airdrop claims, Zeteo-powered Bitcoin bridging, and on-chain subscriptions into a single, beautifully designed platform proving that decentralized tools can be both powerful and accessible.

Looking ahead, we aim to expand Zeteo into a cross-chain intelligence hub extending beyond Starknet to cover all major L2s, integrating deeper with DeFi protocols, and building a community-driven airdrop discovery engine powered by on-chain analytics. The goal is simple: if there's value in the ecosystem, Zeteo helps you find it privately, efficiently, and beautifully.

---

## Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **Package Manager**: `npm` or `yarn`
- **Redis**: A running Redis instance for data caching
- **Starknet Wallet**: [Argent X](https://www.argent.xyz/argent-x/) or [Braavos](https://braavos.app/) browser extension

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/bashir1738/Zeteo.git
   cd Zeteo
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add your configuration.
4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Project Structure
```text
├── app/              # Next.js App Router (Pages, Components, API, Context)
├── contracts/        # Starknet Smart Contracts (Cairo)
├── public/           # Static assets (Images, Videos)
├── worker/           # Background worker service
└── package.json      # Project dependencies and scripts
```