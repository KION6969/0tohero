# The Delusional Handbook — v2.0

A responsive, sarcastic personal-goals dashboard built with **Node.js, Express, HTML, CSS and vanilla JavaScript**.

## Features
- Responsive dark/light theme
- Sarcastic goals dashboard and custom goal creator
- Savings tracker in Indian rupees with local persistence
- Car EMI estimator (illustrative estimate)
- Weekly quest checklist and achievement badges
- Random excuse generator, motivation generator and roast button
- Daily journal with recent entries
- Express server and `/api/health` endpoint
- Uses browser localStorage for data; no database or account required

## Requirements
- Node.js 18 or newer
- Internet connection for Google Fonts (optional; the site still works without it)

## Run locally
1. Extract the ZIP.
2. Open a terminal in the extracted `delusional_handbook_pro` folder.
3. Run:

   ```bash
   npm install
   npm start
   ```

4. Open http://localhost:3000

## Useful URLs
- Website: http://localhost:3000
- Health check: http://localhost:3000/api/health

## Notes
- Progress is stored in this browser on this device using localStorage.
- This version does not have a database, authentication, or cross-device sync.
- The car EMI figure is an estimate and excludes fuel, insurance, maintenance, taxes, and other ownership costs.
