#!/usr/bin/env bash
set -e

# Install Rust if not present (needed for WASM compilation on Vercel)
if ! command -v cargo &> /dev/null; then
  echo "Installing Rust for WASM build..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  export PATH="$HOME/.cargo/bin:$PATH"
fi

# Ensure default toolchain (handles rustup with no default) and wasm target
rustup default stable 2>/dev/null || true
rustup target add wasm32-unknown-unknown 2>/dev/null || true

# Build Rust WASM module
echo "Building Rust WASM module..."
npm run build:wasm

# Build Next.js
echo "Building Next.js..."
next build
