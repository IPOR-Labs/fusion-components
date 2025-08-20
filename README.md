# Fusion Components

Use `pnpm` as a package manager.

## Build Embeddable Fusion Deposit/Withdraw Widget

Install dependencies, then build

```bash
pnpm install
pnpm build
```

The build emits simple HTML page with JavaScript files in `dist/assets`.

Use it on a host page

```html
<fusion-deposit />
<script src="/path/to/build-[hash].js"></script>
```

# Development

Install dependencies, then run in dev mode

```bash
pnpm install
pnpm dev
```
