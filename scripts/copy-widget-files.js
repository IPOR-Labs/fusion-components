#!/usr/bin/env node

/**
 * Copy Widget Files Script
 * 
 * This script copies the built widget files from dist/public/ to the public/ directory 
 * of each example in the examples/ folder. The file names are determined by the 
 * VITE_OUTPUT_FILE_NAME environment variable.
 * 
 * Usage:
 *   node scripts/copy-widget-files.js
 *   pnpm copy-widget-files
 *   pnpm build-and-copy  (builds first, then copies)
 * 
 * Prerequisites:
 *   - Run 'pnpm build' first to generate the files in dist/public/
 *   - Set VITE_OUTPUT_FILE_NAME environment variable (defaults to 'fusion-deposit-widget')
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (scripts directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root directory (parent of scripts directory)
const projectRoot = path.resolve(__dirname, '..');

// Get output file name from environment variable
const outputFileName = process.env.VITE_OUTPUT_FILE_NAME || 'fusion-deposit-widget';

// Source files to copy (from dist/public where they are built)
const sourceFiles = [
  path.join(projectRoot, 'dist/public', `${outputFileName}.js`),
  path.join(projectRoot, 'dist/public', `${outputFileName}.css`)
];

// Get all example directories
const examplesDir = path.join(projectRoot, 'examples');
const exampleDirs = fs.readdirSync(examplesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log('Found example directories:', exampleDirs);
console.log(`Using output file name: ${outputFileName}`);

// Copy files to each example's public directory
exampleDirs.forEach(exampleDirName => {
  const targetPublicDir = path.join(examplesDir, exampleDirName, 'public');
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(targetPublicDir)) {
    fs.mkdirSync(targetPublicDir, { recursive: true });
    console.log(`Created directory: ${targetPublicDir}`);
  }
  
  // Copy each source file
  sourceFiles.forEach(sourceFile => {
    const fileName = path.basename(sourceFile);
    const targetFile = path.join(targetPublicDir, fileName);
    
    try {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✓ Copied ${fileName} to ${targetPublicDir}`);
    } catch (error) {
      console.error(`✗ Failed to copy ${fileName} to ${targetPublicDir}:`, error.message);
    }
  });
});

console.log('\nCopy operation completed!');
