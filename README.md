# Fusion Components

## Build Embeddable Fusion Deposit/Withdraw Widget

Install dependencies, then build

```bash
yarn install
yarn build
```

The build emits widget files in `dist`:
- `dist/public/{VITE_OUTPUT_FILE_NAME}.js` - The main widget JavaScript bundle with styles included
- `dist/build.html` - Example HTML file, demonstrates how you can use the script

Using the widget on a host page:

```html
<fusion-deposit
  data-address="vault_address_here"
  data-chain-id="vault_chain_id_here"
></fusion-deposit>
<!-- Make sure src is correct -->
<script src="/public/fusion-deposit-widget.js"></script>
```

## Using Widgets in Examples

After building, copy the widget files to example directories:

```bash
# Copy widget files to all examples
yarn copy-widget-files

# Or build and copy in one command
yarn build-and-copy
```

Then go your example and run it following script commands in `package.json` of the example.

## Development

Install dependencies, then run in dev mode

```bash
yarn install
yarn dev
```

## Available Scripts

- `yarn build` - Build the widget files
- `yarn copy-widget-files` - Copy built widget files to example directories
- `yarn build-and-copy` - Build and copy widget files in one command
- `yarn dev` - Start development server
- `yarn test` - Run tests

## Environment Variables

The following environment variables can be configured:

### `VITE_RPC_URL_<CHAIN_NAME>`
**Required for used chain** 

RPC URL for specific chain. Used for blockchain read interactions. If you only use Base chain, then no need to provide any other.

**Example:**
```bash
# RPC URLs for different networks
VITE_RPC_URL_MAINNET=PASTE_YOUR_URL
VITE_RPC_URL_ARBITRUM=PASTE_YOUR_URL
VITE_RPC_URL_BASE=PASTE_YOUR_URL
```

### `VITE_OUTPUT_FILE_NAME` - optional
**Default:** `fusion-deposit-widget`

Determines the name of the generated widget files. The build process will create:
- `{VITE_OUTPUT_FILE_NAME}.js` - The main widget JavaScript bundle

**Example:**
```bash
VITE_OUTPUT_FILE_NAME=my-custom-widget
# This will generate: my-custom-widget.js
```
