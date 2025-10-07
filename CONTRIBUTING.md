# Contributing to remove-bg

Thank you for your interest in contributing! This guide will help you get started with development.

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
git clone https://github.com/ras-sh/remove-bg.git
cd remove-bg
pnpm install
```

### Development Commands

```bash
# Start development server
pnpm dev

# Check types
pnpm check-types

# Run linting
pnpm check

# Fix linting issues
pnpm fix

# Build for production
pnpm build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking: `pnpm check-types`
5. Run linting: `pnpm check`
6. Submit a pull request

### Code Quality

This project uses:
- **TypeScript**: Strict type checking
- **Ultracite (Biome)**: Fast formatter and linter
- **TanStack Start**: React framework
- **Tailwind CSS**: Utility-first CSS

## License

MIT - see [LICENSE](LICENSE) file for details.
