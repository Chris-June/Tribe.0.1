# Tribes: Private Social Platform

A modern, invite-only community platform with a cosmic-inspired design.

## Features

- 🌌 Cosmic-inspired dark theme with aurora animations
- 🔒 Private, invite-only communities
- 💬 Secure messaging
- 🎨 Modern, responsive UI
- 🚀 Optimized performance

## Project Structure

### Apps
- `backend/`: Backend services and API
- `web/`: Web application frontend

### Packages
- `types/`: Shared TypeScript type definitions
- `ui/`: Shared UI components

## Tech Stack

- React + TypeScript
- Vite for blazing fast builds
- TailwindCSS for styling
- Netlify for deployment
- Turborepo for monorepo management

## Prerequisites
- Node.js 18+
- npm 9+

## Setup
1. Clone the repository
```bash
git clone https://github.com/Chris-June/TribeV0.1.git
cd tribes
```

2. Install dependencies
```bash
npm install
```

3. Start development
```bash
npm run dev
```

## Available Commands
- `npm run dev`: Start development servers
- `npm run build`: Build all projects
- `npm run lint`: Run linters
- `npm run test`: Run tests
- `npm run clean`: Clean all build artifacts
- `npm run netlify:dev`: Run Netlify development server
- `npm run netlify:deploy`: Deploy to Netlify

## Deployment

### Netlify Deployment
1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
npm run netlify:deploy
```

## Architecture
Tribes is a monorepo using Turborepo for efficient development and build processes. The application features a cosmic-inspired design system with dynamic animations and effects.

## Contributing
Please read our contribution guidelines before submitting a pull request.

## License
MIT
