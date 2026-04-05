# 🍡 gh-mochi-org

> Sweet, cozy, and robust open-source tools and projects. Built with simplicity and modern architecture.

**Author**: [`idotconfig`](https://github.com/idotconfig) / gh-mochi-org  
**License**: [GNU Affero General Public License v2.0 (AGPL-2.0)](#license) with Copyleft

---

## About

gh-mochi-org is a collaborative open-source organization dedicated to building powerful, user-friendly, and accessible tools. This repository contains the main community website showcasing our projects, news, supporters, and contributor community.

### Core Values

- **Open Source First** - All projects are freely available and community-driven
- **Security Conscious** - Building with privacy and security at the foundation
- **User-Centric** - Tools designed for simplicity and accessibility
- **Community-Driven** - Contributions and feedback from the community shape our direction

---

## Features

- 🎨 **Modern Design System** - Consistent, accessible UI with Tailwind CSS
- ⚡ **Performance First** - Built on Svelte 5 and SvelteKit 2 for optimal speed
- 🔐 **Security Hardened** - XSS prevention, rate limiting, CSRF protection
- 📧 **Professional Email System** - Styled transactional emails with secure tokens
- 🌙 **Dark Mode** - Beautiful dark theme with theme toggling
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🔗 **Social Integration** - GitHub, X (Twitter), Matrix, Discord links
- 💬 **Community Features** - Newsletter signup, supporter management, news system

---

## Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev) + [SvelteKit 2](https://svelte.dev/docs/kit)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Email**: [Resend](https://resend.com)
- **Hosting**: [Vercel](https://vercel.com) compatible
- **Package Manager**: [Bun](https://bun.sh)

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- PostgreSQL database (or Neon serverless)
- Environment variables configured (see `.env.example`)

### Installation

```bash
# Clone the repository
git clone https://github.com/gh-mochi-org/gh-mochi-org-site.git
cd gh-mochi-org-site

# Install dependencies
bun install
# or: npm install / yarn install / pnpm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables
# - NEON_DB_CONNECTION_STRING (PostgreSQL)
# - RESEND_API_KEY (Email service)
# - ADMIN_SECRET (Admin authentication)
```

### Development

```bash
# Start development server
bun run dev

# or with auto-open
bun run dev -- --open
```

Server runs at `http://localhost:5173`

### Database

```bash
# Generate database migrations
bun run db:generate

# Push schema to database
bun run db:push

# Open Drizzle Studio
bun run db:studio
```

### Building

```bash
# Create production build
bun run build

# Preview production build locally
bun run preview
```

### Type Checking

```bash
# Check for TypeScript errors
bun run check

# Watch mode
bun run check:watch
```

---

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable UI components
│   │   ├── magic/        # Animated/magical components
│   │   ├── mochi/        # Brand-specific components
│   │   └── ui/           # Base UI components
│   ├── server/           # Server utilities & security
│   │   ├── db/           # Database schema & client
│   │   ├── email-*.ts    # Email templates & utilities
│   │   ├── csrf.ts       # CSRF protection
│   │   ├── rate-limit.ts # Rate limiting
│   │   └── discord.ts    # Discord webhooks
│   └── utils.ts          # Utility functions
├── routes/               # SvelteKit routes
│   ├── +layout.svelte   # Root layout
│   ├── +page.svelte     # Home page
│   ├── api/             # API endpoints
│   ├── admin/           # Admin dashboard
│   ├── news/            # News pages
│   ├── projects/        # Projects showcase
│   ├── support/         # Support/donation
│   └── contributors/    # Contributors page
├── app.d.ts            # TypeScript types
├── app.html            # HTML template
├── hooks.server.ts     # Server hooks
```

---

## Security Features

- ✅ **XSS Prevention** - HTML escaping on all user inputs
- ✅ **CSRF Protection** - Token-based CSRF defense with SameSite cookies
- ✅ **Rate Limiting** - IP-based rate limiting on public APIs
- ✅ **Secure Cookies** - HttpOnly, Secure, SameSite flags configured
- ✅ **Email Privacy** - HMAC-signed tokens for sensitive links
- ✅ **Input Validation** - RFC 5322 email validation
- ✅ **Password Security** - Ready for bcrypt implementation

See [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md) for detailed security audit.

---

## Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Guidelines

- Write TypeScript for type safety
- Follow existing code style
- Add comments for complex logic
- Test your changes locally
- Update documentation as needed

### Development Guidelines

- Use `bun` for dependency management
- Run type checking: `bun run check`
- Keep components small and reusable
- Maintain accessibility (WCAG 2.1 AA)
- Follow security best practices

---

## Deployment

### Vercel (Recommended)

```bash
# Vercel automatically detects SvelteKit
# Connect your GitHub repository and deploy

# Environment variables needed:
# - NEON_DB_CONNECTION_STRING
# - RESEND_API_KEY
# - ADMIN_SECRET
# - DISCORD_WEBHOOK_URL (optional)
```

### Self-Hosted

```bash
# Build
bun run build

# Deploy the .svelte-kit/output directory to your server
# Configure your environment variables
# Start the Node.js server
```

---

## Project Info

### Changelog

See [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) for recent major updates.

### Known Issues

- Firefox may have slight rendering differences with animations
- Rate limiting uses in-memory storage (upgrade to Redis for distributed systems)

### Roadmap

- [ ] Email preference center
- [ ] Advanced analytics dashboard
- [ ] Newsletter segmentation
- [ ] A/B testing for campaigns
- [ ] Webhook system for integrations
- [ ] Plugin architecture

---

## Support

### Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/gh-mochi-org/gh-mochi-org-site/issues)
- **Discussions**: [Community discussions](https://github.com/gh-mochi-org/gh-mochi-org-site/discussions)
- **Email**: Send inquiries to the maintainers
- **Matrix**: Connect with us on Matrix [@idotconfig:matrix.org](https://matrix.to/#/@idotconfig:matrix.org)
- **Discord**: Join our community server

### Reporting Security Issues

Please report security vulnerabilities responsibly to the maintainers. Do not file public issues for security-sensitive bugs.

---

## Sponsorship & Support

If you find gh-mochi-org useful, consider supporting our work:

- ⭐ Star this repository on GitHub
- 💬 Share feedback and ideas
- 🐛 Report bugs and suggest improvements
- 💰 [Sponsor the project](https://gh-mochi.org/support)

---

## License

This project is licensed under the **GNU Affero General Public License v2.0 (AGPL-2.0)**.

### What This Means

The AGPL-2.0 license is a copyleft license, meaning:

#### ✅ You Can:

- **Use** the software freely for any purpose
- **Modify** the source code to suit your needs
- **Distribute** copies of the software
- **Study** how the software works

#### ⚠️ You Must:

- **Provide source code** when you distribute modified versions
- **Disclose your modifications** to users
- **Include the license** with any distribution
- **Share improvements** with the community
- **Network use triggers copyleft** - If you run this as a service, users accessing it over the network have the right to access the source code

#### 📋 In Plain English:

This is **free and open-source software**. If you use it, modify it, or run it as a service, you must make your changes available to others and include this license.

### License Details

```
GNU Affero General Public License v2.0 (AGPL-2.0)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/agpl-2.0.html>.

---

AGPL-2.0 Specific Clause:
If you operate a modified version of this program as a service accessible
over the network, you must provide users with means to obtain the complete
source code of your modified version under the AGPL-2.0 license.
```

### Full License Text

See [LICENSE](LICENSE) file for the complete AGPL-2.0 license text.

### Compliance Notes

- If you create a **modified fork**, you must publish your changes
- If you **offer this as a service**, you must offer source code to users
- If you **create a proprietary version**, you must still comply with AGPL terms
- Commercial use is allowed as long as you comply with the license

---

## Authors & Contributors

### Primary Author

- **idotconfig** ([@idotconfig](https://github.com/idotconfig))
  - GitHub: https://github.com/idotconfig
  - X (Twitter): https://x.com/idotconfig
  - Matrix: [@idotconfig:matrix.org](https://matrix.to/#/@idotconfig:matrix.org)

### Organization

**gh-mochi-org** - The collaborative open-source community

- GitHub: https://github.com/gh-mochi-org
- Website: https://gh-mochi.org

### Contributors

See [Contributors](https://github.com/gh-mochi-org/gh-mochi-org-site/contributors) on GitHub for a list of all contributors.

---

## Acknowledgments

- [Svelte](https://svelte.dev) - Compiler-driven UI framework
- [SvelteKit](https://svelte.dev/docs/kit) - Web framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Resend](https://resend.com) - Email API
- [Neon](https://neon.tech) - Serverless Postgres
- Community contributors and supporters

---

## Quick Links

- 🏠 [Website](https://gh-mochi.org)
- 📦 [GitHub Organization](https://github.com/gh-mochi-org)
- 💬 [Discussions](https://github.com/gh-mochi-org/gh-mochi-org-site/discussions)
- 🐛 [Report an Issue](https://github.com/gh-mochi-org/gh-mochi-org-site/issues)
- 💰 [Support Us](https://gh-mochi.org/support)

---

**Made with ❤️ by the idotconfig gh-mochi-org community**
(I didnt have any UI/UX design Im really proud of what i have made :))

**Last Updated**: April 5, 2026  
**License**: AGPL-2.0 (Copyleft)
