# Pharma DVA

Landscape 16:9 pharmaceutical Digital Visual Aid for medical detailing. Local-only (Dexie/IndexedDB), no login, Capacitor Android + iOS.

## Run (web)

```bash
cd pharma-dva
npm install
npm run dev
```

Production preview:

```bash
npm run build
npm run preview
```

## Capacitor

```bash
npm run cap:sync
npx cap open android   # Android Studio → Build APK
npx cap open ios       # Xcode on macOS → Archive / IPA
```

## Features

- Categories with cover images (CRUD)
- Products under categories with slide fields (CRUD + device images)
- Multi-select → fullscreen showcase (Next/Prev, right tabs, tap-to-animate)
- Export multi-page PDF + past exports list
- Seeded BI-FOLIM-inspired demo data on first launch
