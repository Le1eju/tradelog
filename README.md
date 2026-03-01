# TradeLog

A personal trading journal web application for tracking forex and financial market positions.
Built with React + Vite as a university project for the Web Technologies course.

## 🔗 Live Demo

[tradelog-rose.vercel.app](https://tradelog-rose.vercel.app)

## Features

- **Dashboard** — account stats: Total P&L, Win Rate, Avg RRR, current balance
- **Trading Journal** — monthly calendar view with color-coded winning/losing days
- **Trade History** — full trade log with open/closed position separation and per-trade RRR
- **Settings** — configure your initial account balance
- Add, edit and delete trades with a full-featured form
- Automatic risk % ↔ risk amount calculation based on current balance
- Data persisted locally via localStorage — no backend required
- Click any calendar day to add a trade with that date pre-filled

## Tech Stack

- React 18
- Vite 5
- JavaScript (ES2022+)
- localStorage (client-side data persistence)
- Google Fonts (Space Mono + DM Sans)
- Deployed on Vercel

## Local Setup
```bash
git clone https://github.com/Le1eju/tradelog.git
cd tradelog
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build
```bash
npm run build
