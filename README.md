# Reapply — Your Ultimate Job Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Convex](https://img.shields.io/badge/Convex-22c55e?style=for-the-badge&logo=convex&logoColor=white)](https://convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Reapply** is a premium, type-safe job application tracker built for developers. Stop losing track of which resume you sent where. Manage your career hunt with a sleek, minimalist interface and powerful backend automation.

---

## Features

- **Intelligent Dashboard**: Track every stage of your application—from Pending to Offer.
- **Master CV Library**: Store and manage multiple base resumes with real-time PDF previews.
- **Custom Uploads**: Link specific resumes to specific applications, or upload a custom-tailored version on the fly.
- **AI Prep (Stay Tuned)**: AI-powered analysis of job descriptions to help you tailor your pitch.
- **Secure Auth**: Seamless login experience powered by **Clerk**.
- **Real-time Sync**: Instant data updates across devices powered by **Convex**.

---

## Technical Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly typed)
- **Database & Backend**: [Convex](https://convex.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### 1. Prerequisites

- Node.js (v18+)
- A [Convex](https://convex.dev/) account
- A [Clerk](https://clerk.com/) account

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/tomiwa-a/reapply.git

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_CONVEX_URL=your_convex_deployment_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Run Development Server

```bash
# Start Convex and Vite simultaneously
npx convex dev
npm run dev
```

---

## Open Source & Contributions

Reapply is an **Open Source** project. We welcome contributions from developers of all skill levels!

1. **Fork** the repository.
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with heart for a better job search.
</p>
