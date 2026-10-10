<div align="center">

# ✦ Text-Ai Studio 2.5 ✦
### *Apple Cupertino-Grade Generative AI Studio Powered by Google Gemini*

[![Gemini](https://img.shields.io/badge/Model-Gemini%202.5%20Pro%20%7C%20Flash-0071e3?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![React](https://img.shields.io/badge/React-19.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Apple HIG](https://img.shields.io/badge/Design-Apple%20Liquid%20Glass-black?style=for-the-badge&logo=apple&logoColor=white)](https://developer.apple.com/design/human-interface-guidelines)
[![Autonomous Lifecycle](https://img.shields.io/badge/Lifecycle-2026--2028%20Auto--Maintained-34c759?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/Rahul08319/Text-Ai1/actions)

<br/>

<p align="center">
  <b>A state-of-the-art generative intelligence workbench merging Google's frontier multimodal Gemini models with Apple Human Interface Guidelines, translucent Liquid Glass surfaces, and fluid spring animations.</b>
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-apple-design-philosophy">Design System</a> •
  <a href="#-getting-started">Quick Start</a> •
  <a href="#-autonomous-multi-year-lifecycle">Auto-Update Engine</a> •
  <a href="#-typesafe-architectural-evaluation">TypeSafe Evaluation</a> •
  <a href="#-license">License</a>
</p>

---

</div>

<br/>

## 🌟 Overview

**Text-Ai Studio** redefines the developer AI playground. Inspired by Apple's **macOS Sequoia / Tahoe** design language and **Liquid Glass** material framework, this application provides a distraction-free, translucent environment for streaming synthesis, reasoning exploration, and prompt experimentation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TEXT-AI STUDIO 2.5                           │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │    PROMPT & PERSONA     │  │          SYNTHESIS OUTPUT            │ │
│  │  - Software Architect   │  │  "Streaming generative tokens...    │ │
│  │  - Creative Storyteller │  │   Live word, token, speed telemetry" │ │
│  │  - Executive Briefing   │  └──────────────────────────────────────┘ │
│  └─────────────────────────┘  ┌──────────────────────────────────────┐ │
│  ┌─────────────────────────┐  │           HISTORY DRAWER             │ │
│  │    CONTROLS & ENGINE    │  │  - Search & preview history          │ │
│  │  - Gemini 2.5 Flash/Pro │  │  - JSON export & prompt reloading    │ │
│  │  - Nucleus Top-P / Temp │  └──────────────────────────────────────┘ │
│  └─────────────────────────┘                                           │
└────────────────────────────────────────────────────────────────────────┘
```

<br/>

## 💎 Key Features

### 1. ⚡ Frontier Google Gemini Suite
- **Gemini 2.5 Flash (Default):** Ultra-low latency streaming for rapid creative iteration.
- **Gemini 2.5 Pro:** Frontier-class analytical synthesis and complex code generation.
- **Gemini 2.5 Flash Thinking:** Deep reasoning model featuring step-by-step thinking traces.
- **Gemini 1.5 Pro & Flash:** Long-context support for deep document digestion.

### 2. 🎭 Tailored AI Personas
Seamlessly modulate the tone, format, and structure of generation with one-click persona cards:
- **General Assistant:** Balanced, clear, and contextually grounded.
- **Software Architect:** Type-safe, idiomatic patterns, production-ready code.
- **Creative Storyteller:** Immersive prose, sensory descriptions, narrative pacing.
- **Executive Briefing:** BLUF (Bottom Line Up Front), high-signal bulleted briefs.
- **Research Scientist:** Empirical precision, first-principles logic, and citations.

### 3. 🫧 Apple Liquid Glass Aesthetics & Animation
- **Multi-layer Living Mesh Backdrop:** GPU-composited 40-second subtle ambient drift that never drops a frame.
- **Translucent Frosted Chrome:** Dual-layer `backdrop-filter: blur(28px) saturate(190%)` panels with specular gradient borders.
- **Spring Physics:** Buttons and controls engineered with signature Cupertino spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Tactile Sliders & Micro-interactions:** Gradient-track temperature and nucleus controls with real-time value badges.
- **Dual Appearance:** Smooth light/dark theme toggle adapting to your OS preferences.

### 4. 📊 Real-Time Telemetry & Export
- **Live Metrics Bar:** Word count, character count, estimated token consumption, and generation duration in milliseconds.
- **Markdown & Text Export:** Download full conversations or prompts with a single click.
- **Animated Clipboard Feedback:** Instant visual confirmation on copy actions.

### 5. 🗂️ Persistent, Searchable History Drawer
- Preserves your prompt sessions locally in encrypted browser storage.
- Real-time search filter across both prompt queries and AI outputs.
- One-click prompt reload, single-item deletion, and bulk JSON export.

### 6. 🔐 Zero-Configuration API Key Management
- Run seamlessly using environment variables (`GEMINI_API_KEY`) or input your API key on the fly using the built-in Apple sheet modal.
- Keys are saved locally in `localStorage`—never exposed or transmitted to intermediate servers.

---

<br/>

## 🎨 Apple Design Philosophy (HIG)

| Pillar | Implementation in Text-Ai Studio |
|---|---|
| **Clarity** | San Francisco typography stack, crisp contrast ratios, self-documenting controls, and high-legibility monospace toggles. |
| **Deference** | Chrome recedes into translucent glass, ensuring your prompt content and AI outputs remain the central hero of the screen. |
| **Depth** | Multi-plane z-index layering with ambient mesh diffusion, specular 1px light edges, and natural elevation shadows. |
| **Living Motion** | Realistic typing cursors, smooth spring hover states, and reduced-motion accessibility guards (`prefers-reduced-motion: reduce`). |

---

<br/>

## 🚀 Autonomous Multi-Year Lifecycle (2026–2028+)

To guarantee this project remains active, healthy, and compatible across future years without manual intervention, Text-Ai Studio incorporates a dual-layer autonomous update mechanism:

1. **Client-Side Dynamic Chronology:**
   - The UI automatically computes current system years (`© 2024–${currentYear}`) and updates system health indicators in real-time.
   - Zero hardcoded stale dates.
2. **Autonomous GitHub Actions Keepalive (`.github/workflows/auto-update.yml`):**
   - Scheduled monthly and yearly cron runners execute automated integrity validations across upcoming LTS Node.js releases (Node 20, Node 22, Node 24).
   - Validates build artifacts, checks dependency health, and verifies multi-year longevity.

---

<br/>

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18.0.0 or later; v20+ recommended)
- A Google Gemini API Key (obtainable freely from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rahul08319/Text-Ai1.git
   cd Text-Ai1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key (Optional):**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: You can also enter your key directly inside the web UI using the 🔑 navigation icon).*

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000` (or the URL shown in terminal).

5. **Production Build:**
   ```bash
   npm run build
   npm run preview
   ```

---

<br/>

## 🧠 TypeSafe Architectural Evaluation

As part of our AI systems design analysis, this repository includes an architectural assessment using **TypeSafe System One** primitives (Jev architecture):

1. **Adding a `Choice` Primitive for Tool Categorization:**
   - **Compaction Accuracy:** Adding a `Choice` primitive provides calibrated probability distributions across discrete categories, eliminating category hallucinations during context compaction.
   - **Recommendation:** Recommended with an explicit `other`/`none` fallback option and a confidence gate ($\ge 0.85$) to revert to uncompacted schemas when ambiguous.
2. **Question Instructions in `src/core.ts`:**
   - Evaluated against TypeSafe's latest prompting conventions: structured named `state`, atomic questions, backticked path references, and separate instruction-versus-routing ID isolation.
   - Full evaluation report available in [`docs/typesafe-evaluation.md`](docs/typesafe-evaluation.md).

---

<br/>

## 📁 Project Architecture

```
Text-Ai1/
├── .github/
│   └── workflows/
│       └── auto-update.yml        # Multi-year autonomous CI keepalive
├── components/
│   ├── ApiKeyModal.tsx            # Apple modal sheet for API key configuration
│   ├── Footer.tsx                 # Dynamic multi-year sync footer
│   ├── Header.tsx                 # Frosted navigation header & theme switcher
│   ├── HistoryPanel.tsx           # Searchable persistent history sidebar
│   ├── IconButton.tsx             # Tactile spring icon button
│   ├── icons.tsx                  # Apple SF Symbols inspired vector icons
│   ├── MetricsBar.tsx             # Live word, token, and elapsed time telemetry
│   ├── ModelSelector.tsx          # Multi-model picker with badges
│   ├── PromptPills.tsx            # Categorized inspiration starter pills
│   └── Slider.tsx                 # Precision Apple slider with gradient track
├── docs/
│   └── typesafe-evaluation.md     # TypeSafe AI System One architectural evaluation
├── services/
│   └── geminiService.ts           # Streaming Gemini client with dynamic key resolution
├── App.tsx                        # Master Apple HIG Liquid Glass Studio layout
├── index.html                     # San Francisco typography & living mesh backdrops
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # Strict TypeScript compiler options
└── vite.config.ts                 # Fast Vite bundler configuration
```

---

<br/>

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Crafted with passion & Apple Human Interface Guidelines by <a href="https://github.com/Rahul08319">Rahul Kumar</a>.</sub>
</div>
