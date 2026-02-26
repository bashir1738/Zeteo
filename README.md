# Zeteo 

Zeteo is a premium, high-performance dashboard built on the **Starknet** ecosystem. It serves as a central hub for users to manage their digital assets, monitor subscription plans, and track eligible airdrops with a focus on visual excellence and seamless user experience.

---

- **Starknet Wallet Integration**: Connect seamlessly with Argent X or Braavos wallets.
- **Interactive Portfolio Tracking**: Real-time monitoring of your digital assets on Starknet.
- **ZK-Privacy Airdrop Claims**: Securely claim allocations using Garaga-powered ZK-proofs to protect your eligibility data.
- **Bitcoin Bridge**: Integrated trustless bridging capabilities for Bitcoin assets.
- **Subscription Management**: Access premium features through tiered plans (Basic, Standard, Premium).
- **Stunning UI/UX**: Built with a "liquid glass" aesthetic, featuring smooth animations and a responsive design.

---

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Blockchain**: [Starknet.js](https://www.starknetjs.com/), [Garaga](https://github.com/keep-starknet-strange/garaga) (ZK-Proof Verification)
- **State/Data**: [Redis](https://redis.io/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

---

##  Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **Package Manager**: `npm` or `yarn`
- **Redis**: A running Redis instance for data caching
- **Starknet Wallet**: [Argent X](https://www.argent.xyz/argent-x/) or [Braavos](https://braavos.app/) browser extension

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/bashir1738/Zeteo.git
    cd Zeteo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add your configuration (e.g., Redis URL, API keys).

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

##  Platform Architecture

Zeteo is designed with a modern decoupled architecture:

1.  **Next.js Frontend**: Handles the UI, animations, and client-side wallet interactions.
2.  **API Routes**: Serverless functions located in `app/api` for fetching airdrop data and prices.
3.  **Redis Cache**: Stores user data and subscription status with a 24-hour TTL for performance.
4.  **Cairo Smart Contracts**: Located in the `contracts` directory, handling on-chain logic.
5.  **Worker Service**: (In `worker` directory) For background tasks and data synchronization.

---

##  How it Works

### 1. Connecting Your Wallet
Upon entering Zeteo, users can connect their Starknet wallet via the navigation bar. This establishes a secure connection to fetch the wallet address and interact with the blockchain.

### 2. Choosing a Subscription
Zeteo offers tiered subscription plans (Basic, Standard, Premium). Subscribing unlocks the full potential of the dashboard, allowing users to track a wider range of airdrops and portfolio metrics.

### 3. Using the Dashboard
Once subscribed and connected, the **Dashboard** (`/dashboard`) becomes your mission control. It displays:
- Your current subscription plan and expiry date.
- **Live Portfolio**: Track your token balances and values in real-time.
- **Airdrop Management**: View eligible and suggested airdrops.
- **ZK-Privacy Mode**: Toggle ZK-Privacy to claim allocations without revealing your full eligibility profile on-chain.

### 4. Bitcoin Bridging
Users can utilize the integrated Bitcoin Bridge component to move assets trustlessly into the Starknet ecosystem for use with Zeteo-supported protocols.

---

##  Project Structure

```text
├── app/              # Next.js App Router (Pages, Components, API, Context)
├── contracts/        # Starknet Smart Contracts (Cairo)
├── public/           # Static assets (Images, Videos)
├── worker/           # Background worker service
├── redis_schema.md   # Documentation for Redis data structures
└── package.json      # Project dependencies and scripts
```

---

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.