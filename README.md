# SkyTrack

SkyTrack is a polished one-page flight tracker built for a Handshake first-website project with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser. Create a production build with `pnpm build`.

## Features

- Search flights by number, airline, city, or airport, including normalized numbers such as `AS101` and `AS 101`
- Filter by All flights, On time, Boarding, Delayed, or Landed
- Select flights to view a simulated route, progress, schedule, terminal, gate, altitude, and speed
- Responsive aviation control-room interface with keyboard-accessible controls and clear empty states
- Persistent Demo data labeling and a source link in the About section

All eight flights and all schedules, routes, positions, and progress values are explicitly simulated demo data. SkyTrack is not live aviation information and does not use API keys, paid integrations, login, or personal data collection.

Live site: https://skytrack-self.vercel.app/

Source: https://github.com/Theja4/skytrack
