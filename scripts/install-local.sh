#!/bin/bash
set -e

echo "📦 Installing n8n-nodes-solana locally..."

# Build the project
./scripts/build.sh

# Create n8n custom directory if it doesn't exist
mkdir -p ~/.n8n/nodes

# Remove existing installation if present
rm -rf ~/.n8n/nodes/n8n-nodes-solana

# Copy the entire package to n8n nodes directory
cp -r "$(pwd)" ~/.n8n/nodes/n8n-nodes-solana

echo "✅ Installation complete!"
echo "🔄 Please restart n8n to load the new node."
