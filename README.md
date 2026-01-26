# FocusApp - Multi-Economy Productivity PWA

A production-grade PWA for building discipline through cash/token staking.

## Features
- **PWA Support**: Installable on Android, iOS, Windows. Offline ready.
- **Staking Modes**: Cash (Refund/Penalty), Tokens (Stake/Burn), Charity.
- **Wallet**: Razorpay integration for adding funds.
- **Anti-Cheat Timer**: Detects tab switching to enforce focus.
- **Cron Job**: Automatically evaluates expired targets.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Axios
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Instance (Atlas or Local)

### 2. Installation

Clone the repo (or use the created folder).

**Backend:**
```bash
cd server
npm install
# Update .env with your MongoDB URI and Razorpay keys
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

### 3. Build for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
Host `server/src/server.js` on Render/Railway.

## Directory Structure
- `client/`: React PWA
- `server/`: Node API
- `docs/`: Documentation

## Deployment
1. Set `VITE_API_URL` in Client `dist` to your production backend URL.
2. Deploy Server to Render (Set Build Command: `npm install`, Start Command: `npm start`).
3. Deploy Client `dist` to Vercel.

## Staking & Economy validation
- **Cash**: Staked amount deducted immediately. On success -> Refunded. On failure -> Kept/Donated.
- **Tokens**: 1 INR = 1 Token. Tokens used for vouchers or staking. 
