# AssureSphere – Insurance Intelligence Platform

AssureSphere is a no-code, AI-assisted insurance broking workspace built for intermediaries. It fuses eleven connected modules, drag-and-drop model design, bulk data automation, natural language search, OCR ingestion, and a conversational co-pilot into a single React/Next.js experience ready for Vercel deployment.

## ✨ Branding & Design Language
- **Brand name:** AssureSphere – engineered to signal insurance trust + digital intelligence
- **Logo:** `public/assets/assuresphere-logo.svg`
- **Palette:** Deep Trust `#1D3557`, Digital Steel `#457B9D`, Future Mist `#A8DADC`, Nimbus White `#F7FBFF`, Momentum Teal `#2EC4B6`
- **Design Language:** Neo-skeuomorphic cards, layered gradients, confident typography, rounded geometry for approachability, embedded accessibility (contrast ratios pass WCAG AA).

## 🧭 Core Capabilities
- Visual no-code builder with drag-reorder fields, optionality toggles, and guided schema creation
- Smart capture form with autocomplete chips sourced from live data
- Bulk import/export supporting CSV and Excel plus duplicate detection & merge cues
- AI utilities: prompt shortcuts, natural language search, OCR-powered document intake, copilot chat
- Eleven functional modules covering Client, Policy, Claims, Quotes, Renewals, Compliance, Analytics, Finance, Documents, Partnerships, and AI command center
- Persistent workspace state stored in browser `localStorage`

## 🛠️ Tech Stack
- [Next.js 14](https://nextjs.org/) with the App Router
- React 18 + TypeScript
- State via React context
- Drag and drop by `@dnd-kit`
- Parsing helpers: `papaparse`, `xlsx`
- OCR powered by `tesseract.js`
- Charts placeholder ready via `recharts` (extend as needed)

## 🚀 Local Development
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing & Quality
- `npm run lint` – Next.js lint rules
- `npm test` – Jest setup scaffolded (add suites as the platform grows)

## 📦 Deployment
Deploy straight to Vercel:
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-4545ebed
```

Then validate:
```bash
curl https://agentic-4545ebed.vercel.app
```

## 🗺️ Next Steps
- Connect real data services (CRMs, policy admin systems) through API gateways
- Layer in auth (Supabase Auth, NextAuth, etc.)
- Extend AI workflows to real LLM endpoints or automation engines
- Wire merge actions to actual reconciliation logic

Enjoy building the future of insurance intermediation with AssureSphere.
