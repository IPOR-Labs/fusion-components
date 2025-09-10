# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Setup and Development:**
- `yarn setup` - Install dependencies and setup lavamoat allow-scripts
- `yarn dev` - Start Vite development server
- `yarn build` - Build TypeScript and create production bundle
- `yarn build-and-copy` - Build and copy widget files to examples

**Testing:**
- `yarn test` - Run vitest tests once  
- `yarn test:watch` or `yarn t` - Run tests in watch mode

**Code Quality:**
- `yarn lint` - Run ESLint
- `yarn find-unused-exports` - Find unused TypeScript exports

**Storybook:**
- `yarn storybook` or `yarn sb` - Start Storybook dev server on port 6006
- `yarn build-storybook` - Build Storybook

**Widget Distribution:**
- `yarn copy-widget-files` - Copy built widget files to example directories

## Architecture

This is a Web3 DeFi widget library that builds embeddable Fusion deposit/withdraw components. The main entry point creates a web component (`<fusion-deposit>`) that can be embedded in any HTML page.

**Core Structure:**
- `/src/main.tsx` - Main entry point that registers the `fusion-deposit` web component
- `/src/widgets/fusion-deposit/` - Web component wrapper and widget logic
- `/src/fusion/` - Core Fusion deposit/withdraw functionality
- `/src/app/` - Shared application utilities (allowance, RPC, etc.)

**Widget Architecture:**
- Built with React, TypeScript, and Vite
- Uses Web Components API for embeddability
- Built bundle includes styles and all dependencies
- Output filename configurable via `VITE_OUTPUT_FILE_NAME` env var

**DeFi Integration:**
- Built on wagmi/viem for Web3 interactions
- Supports multiple chains via `VITE_RPC_URL_<CHAIN_NAME>` env vars
- Uses React Hook Form with Zod validation
- TanStack Query for async state management

**Testing:**
- Vitest for unit testing with jsdom environment
- Testing Library for React component testing
- Browser testing with @vitest/browser

## Key Patterns

**Environment Variables:**
- RPC URLs: `VITE_RPC_URL_MAINNET`, `VITE_RPC_URL_ARBITRUM`, `VITE_RPC_URL_BASE`  
- Widget output name: `VITE_OUTPUT_FILE_NAME` (default: `fusion-deposit-widget`)

**Component Structure:**
- Fusion components use context patterns with `.context.tsx`, `.form.tsx`, `.hooks.ts`
- Actions separated into `/actions/` directories
- Tests colocated in `__tests__/` directories

**Build Output:**
- `dist/public/{VITE_OUTPUT_FILE_NAME}.js` - Main widget bundle
- `dist/build.html` - Example implementation

## Usage Example

The built widget is used as:
```html
<fusion-deposit
  data-address="vault_address_here" 
  data-chain-id="vault_chain_id_here"
></fusion-deposit>
<script src="/public/fusion-deposit-widget.js"></script>
```