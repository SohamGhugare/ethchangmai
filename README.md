# Scout - Location-Based Prediction Markets

A decentralized prediction market platform built on Ethereum that enables users to create and participate in location-based polls with stake-based voting.

## Introduction

Scout transforms real-world presence into valuable predictions. Users can create polls tied to specific geographic locations, and participants within range can vote by staking ETH on their chosen option. When polls conclude, winners receive proportional rewards from the total stake pool.

**Key Features:**
- Location-based poll creation with geofencing (100km radius)
- Stake-based voting system with ETH
- Real-time countdown timers for poll expiry
- Portfolio tracking for hosted and participated polls
- Reward distribution to winning voters

## Architecture

```
frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API Routes
│   │   ├── faucet/              # Test ETH faucet
│   │   ├── polls/               # Poll CRUD operations
│   │   │   ├── all/             # Fetch all polls
│   │   │   ├── create/          # Create new poll
│   │   │   ├── fetch/           # Fetch user's polls
│   │   │   ├── finalize/        # Finalize and distribute rewards
│   │   │   ├── save/            # Save poll to database
│   │   │   └── stats/           # Poll statistics
│   │   ├── portfolio/           # User portfolio data
│   │   ├── user/                # User management
│   │   └── votes/               # Vote operations
│   ├── polls/                   # Polls page
│   ├── portfolio/               # Portfolio page
│   ├── how-it-works/            # Info page
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── components/
│   ├── WalletProvider.tsx       # ETH wallet context provider
│   ├── Navbar.tsx               # Navigation with wallet connection
│   ├── Hero.tsx                 # Landing page hero section
│   └── LocationPolls.tsx        # Main voting interface
├── lib/
│   ├── mongodb.ts               # Database connection
│   ├── models/Poll.ts           # TypeScript interfaces
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

**Tech Stack:**
- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB
- **Blockchain:** Ethereum (Sepolia Testnet)

**Data Flow:**
1. User connects wallet via WalletProvider
2. Polls are fetched from MongoDB and filtered by location
3. Votes are submitted as transactions and cached in MongoDB
4. Poll finalization distributes rewards proportionally

## Build Instructions

### Prerequisites
- Node.js 18+ or Bun
- MongoDB instance (local or Atlas)

### Environment Setup

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_MODULE_ADDRESS=your_contract_address
FAUCET_PRIVATE_KEY=your_faucet_wallet_private_key
```

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

### Development

The app runs on `http://localhost:3000` by default.

**Available Scripts:**
- `bun dev` - Start development server with hot reload
- `bun build` - Create production build
- `bun start` - Run production server
- `bun lint` - Run ESLint

### Testing the App

1. Connect a wallet (MetaMask, Coinbase, etc.)
2. Allow location access when prompted
3. Create a poll or vote on existing polls within your area
4. Request test ETH from the faucet in the Portfolio page

