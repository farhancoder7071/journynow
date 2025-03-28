#!/bin/bash

# Use Node.js 20 from the Nix store
NODE_PATH="/mnt/nixmodules/nix/store/hdq16s6vq9smhmcyl4ipmwfp9f2558rc-nodejs-20.10.0/bin"
export PATH="$NODE_PATH:$PATH"

# Check if Node.js and npm are available
echo "Node.js version: $($NODE_PATH/node -v)"
echo "npm version: $($NODE_PATH/npm -v)"

# Set a default SESSION_SECRET if one is not already set
if [ -z "$SESSION_SECRET" ]; then
  export SESSION_SECRET="secure-admin-dashboard-session-secret"
  echo "Using default SESSION_SECRET"
fi

# Install dependencies (if needed)
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  $NODE_PATH/npm install
else
  echo "Dependencies already installed."
fi

# Run the development server
echo "Starting the application..."
$NODE_PATH/npm run dev