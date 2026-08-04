# 🎮 Valorant Squad Synergy Tracker — iOS 26 Liquid Glass Edition

A high-tech Valorant squad analytics and synergy web application built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**, rendered in Apple's **iOS 26 "Liquid Glass"** design language.

![iOS 26 Liquid Glass](https://img.shields.io/badge/Design-iOS%2026%20Liquid%20Glass-ff4655?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 🔥 Key Features

### 💎 iOS 26 "Liquid Glass" Visual Design System
- **Real Translucent Refractive Surfaces**: Layered glass recipe combining `background: rgba(255,255,255,0.08)`, `backdrop-filter: blur(24px) saturate(180%) brightness(1.1)`, squircle corners (`rounded-[28px]`), and specular gradient borders.
- **Animated Refraction Background**: 4 soft-edged color blobs drifting on 60–90s loops in Valorant red, magenta, deep purple, and cyan tones over `#0a0b0f`.
- **Framer Motion iOS Spring Interaction**: Asymmetrical tap physics (fast compress `scale: 0.96`, springy release `scale: 1.02, y: -3`).
- **Floating Dynamic Island Navigation**: Rounded navigation bar floating over the viewport.

---

### 📊 Squad Synergy Analytics Engine
- **Cross-Referencing AP Match History**: Identifies matches where 2+ squad members queued together on the same team.
- **Map Win Rates & Squad ACS**: Computes per-map win rates, squad average ACS, K/D ratios, and highlights top MVP performers on each map.
- **Complete Multi-Filter Suite**:
  - **Episode & Act Filter**: Comprehensive coverage for all Episodes 1–9 and Year 2026 Acts.
  - **Game Mode Filter**: Competitive, Unrated, Swiftplay, Deathmatch.
  - **Outcome Filter**: All Outcomes, Victories (Wins) Only, Defeats (Losses) Only.
  - **Squad Member Filter**: Filter matches by specific squad members.
  - **1-Click Reset Filters**: Instantly clear active filters back to defaults.

---

### 🛡️ High-Tech Player Profile Dossiers (tracker.gg Inspired)
- **Shared-Element Morph Transition**: Tapping any player chip, avatar, or name opens a full high-tech profile overlay.
- **Hero Profile Header**: Large player card art background, Riot ID (`Name#Tag`), rank badge (`Platinum 1`, RR points), account level, and 4 floating vital stat glass chips.
- **Rank Progression Area Chart**: Interactive match-by-match RR/Elo trend line with hover tooltips.
- **Agent Mastery Grid**: Agent cards with glowing main accents and tap-to-expand inline per-map statistics.
- **Player Map Performance Grid**: Scoped player map cards with splash art backgrounds.
- **Recent Match History & Scoreboards**: Match rows with tap-to-expand compact 10-player scoreboard tables.
- **Role Distribution Donut Chart**: Donut chart showing role breakdown (% Duelist, Controller, Initiator, Sentinel).

---

### ⚡ User-Triggered Live API Integration & Custom Loader
- **Henrik Dev API & valorant-api.com Integration**: Fetch live account info, competitive ranks, and match histories.
- **Custom Valorant Loader (`ValorantLoader.jsx`)**: Glowing Valorant "V" logo with animated gradient backlights and `"SABAR KARLE MC"` typography during live API sync.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yashmks1998/valtrack.git
   cd valtrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for higher Henrik API rate limits):
   Create a `.env` file in the root directory:
   ```env
   VITE_HENRIK_API_KEY=HDEV-your-henrik-api-key-here
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Vanilla CSS tokens & Tailwind CSS 3
- **Animations & Physics**: Framer Motion
- **Icons**: Lucide React
- **Data Sources**: [Henrik Dev API](https://docs.henrikdev.xyz/) & [valorant-api.com](https://valorant-api.com/)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
