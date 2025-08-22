# Fusion Components

Use `pnpm` as a package manager.

## Build Embeddable Fusion Deposit/Withdraw Widget

Install dependencies, then build

```bash
pnpm install
pnpm build
```

The build emits widget files in `dist/public/`:
- `{VITE_OUTPUT_FILE_NAME}.js` - The main widget JavaScript bundle
- `{VITE_OUTPUT_FILE_NAME}.css` - The widget styles

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
- `pnpm replace-widget-filenames` - Replace placeholder widget file names in HTML files
- `pnpm build-and-copy` - Build and copy widget files in one command
- `pnpm dev` - Start development server
- `pnpm test` - Run tests

## Environment Variables

The following environment variables can be configured:

### `VITE_RPC_URL_<CHAIN_NAME>`
**Required for used chain** 

RPC URL for specific chain. Used for blockchain read interactions. If you only use Base chain, then no need to provide any other.

**Example:**
```bash
# RPC URLs for different networks
VITE_RPC_URL_MAINNET=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_RPC_URL_ARBITRUM=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_RPC_URL_BASE=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### `VITE_OUTPUT_FILE_NAME`
**Default:** `fusion-deposit-widget`

Determines the name of the generated widget files. The build process will create:
- `{VITE_OUTPUT_FILE_NAME}.js` - The main widget JavaScript bundle
- `{VITE_OUTPUT_FILE_NAME}.css` - The widget styles

**Example:**
```bash
VITE_OUTPUT_FILE_NAME=my-custom-widget
# This will generate: my-custom-widget.js and my-custom-widget.css
```
