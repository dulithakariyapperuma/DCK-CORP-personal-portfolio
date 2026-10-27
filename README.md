# DCK CORP OS

An interactive portfolio desktop inspired by the supplied Lex OS reference, with a monochrome angular logo, muted silver desktop, black project imagery, floating windows, and a responsive taskbar. The clean desktop shows only Profile, Projects, and Terminal shortcuts.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` folder to any static hosting provider.

## Stack

React 19, TypeScript, Vite, Three.js with React Three Fiber, Framer Motion, and Lucide icons. This portfolio is entirely browser-based; it does not need MongoDB or Express. Add a backend when you need accounts, saved content, or server-side contact delivery.

## Features

- Animated Three.js architectural background, with a reduced-motion preference.
- Draggable windows with close, minimize, maximize, and focus controls.
- Project explorer with folders and live name filtering.
- Three concept project dossiers and next-project navigation.
- Terminal: `help`, `ls`, `about`, `projects`, `date`, `status`, and `clear`.
- Local session settings, an optional original synthesized cinematic ambient soundscape with metallic click effects, and a guest lock screen.
- Cmd/Ctrl + K opens Files; Escape closes the top window or unlocks the guest desktop.
- Mobile layout and keyboard focus indicators.

The lock screen is a visual guest lock, not authentication. Minimized windows can be reopened from the taskbar; session state is not persisted after refresh.

## Customize

- `src/main.tsx`: profile copy, projects array, terminal commands, and application components.
- `src/style.css`: layout, colors, responsive rules, and type styles.
- `public/logo.svg`: a monochrome vector recreation of the angular reference mark; replace with your original logo asset when available.
- `index.html`: page title, description, and favicon.

The three projects are explicitly marked concept studies, not claims of completed client work. Replace the sample project names, descriptions, and remote Unsplash images with your own portfolio. Google Fonts and Unsplash images require an internet connection; system font and background-color fallbacks are included.

## Desktop atmosphere

The angular arrow and hexagon cursors are local SVG assets in `public/`. Sound starts only when enabled by the user, fades out when muted, and pauses while the tab is hidden. The soundscape is synthesized with Web Audio in `src/audio.ts`; it contains no film soundtrack samples. Session settings reset on refresh.

## Application menu and introduction

Click the top-left logo to open the searchable application launcher. It includes Profile, Projects, Terminal, Settings, Show desktop, Introduction, Sound, and Lock session. Arrow keys navigate menu buttons; Escape dismisses the menu. The first-visit introduction is remembered in localStorage and can be replayed from the menu or with `intro`.

## Integrated application terminal

The terminal operates the website's actual session state. It is a browser application shell, not an operating-system shell or remote server console. Terminal history and working directory survive closing/reopening its window within a visit. Notes persist across visits in this browser's localStorage; clearing site data removes them.

Examples:

```text
help
ls /
cd /projects
cat monolith.txt
open signal
open settings
motion off
sound on
windows
close settings
write /notes/idea.txt "A new project idea"
cat /notes/idea.txt
rm /notes/idea.txt
status
intro
lock
```

Additional commands: `pwd`, `projects`, `about`, `settings`, `date`, `whoami`, `uname`, `echo`, `history`, `clear`. Tab completes commands and paths, Up/Down recalls commands, and Ctrl+L clears the terminal output. Project and profile files are read-only; only `/notes` can be modified. The terminal does not execute arbitrary JavaScript, host commands, pipes, or network requests.

## Certification archive

Profile opens a reference-inspired certification archive with WSO2 and Cloud folders, search by title/issuer/skill, and individual credential dossiers. The four records are intentionally mock credentials, with custom decorative emblems rather than official issuer logos. All dates, IDs, and titles are illustrative.

Edit `src/data/certifications.ts` to replace the samples. Each dossier supports exporting its current details as a text file. Exports of sample records are explicitly labeled as unverified mock data.
