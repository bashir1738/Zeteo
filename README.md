# Zeteo 

Zeteo is a premium, high-performance dashboard built on the **Starknet** ecosystem. It serves as a central hub for users to manage their digital assets, monitor subscription plans, and track eligible airdrops with a focus on visual excellence and seamless user experience.

---

##  Key Features

- **Starknet Wallet Integration**: Connect seamlessly with Argent X or Braavos wallets.
- **Interactive Portfolio**: View and manage your cryptocurrencies associated with your Starknet address.
- **Airdrop Tracker**: Stay updated with active allocations and claim your tokens directly.
- **Subscription Management**: Access premium features through tiered subscription plans.
- **Stunning UI/UX**: Built with a "liquid glass" aesthetic, featuring smooth animations and a responsive design.

---

##  Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router), [React 19](https://react.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Blockchain**: [Starknet.js](https://www.starknetjs.com/), [@starknet-io/get-starknet](https://github.com/starknet-io/get-starknet)
- **State/Data**: [Redis](https://redis.io/) (via `redis` package)
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
- A filtered table of eligible airdrops.
- Direct links to claim allocations.

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