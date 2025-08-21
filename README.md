# Fusion Components

Use `pnpm` as a package manager.

## Build Embeddable Fusion Deposit/Withdraw Widget

Install dependencies, then build

```bash
pnpm install
pnpm build
```

The build emits widget files in `dist/public/`:
- `fusion-deposit-widget.js` - The main widget JavaScript bundle
- `fusion-deposit-widget.css` - The widget styles

## Using Widgets in Examples

After building, copy the widget files to example directories:

```bash
# Copy widget files to all examples
pnpm copy-widget-files

# Or build and copy in one command
pnpm build-and-copy
```

Use the widget on a host page:

```html
<fusion-deposit />
<script src="/fusion-deposit-widget.js"></script>
<link rel="stylesheet" href="/fusion-deposit-widget.css">
```

## Development

Install dependencies, then run in dev mode

```bash
pnpm install
pnpm dev
```

## Available Scripts

- `pnpm build` - Build the widget files
- `pnpm copy-widget-files` - Copy built widget files to example directories
- `pnpm build-and-copy` - Build and copy widget files in one command
- `pnpm dev` - Start development server
- `pnpm test` - Run tests
