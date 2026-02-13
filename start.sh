#!/bin/bash
echo ""
echo "  ========================================"
echo "   RetroCord Communicator - Starting..."
echo "  ========================================"
echo ""

cd "$(dirname "$0")/backend"
node src/index.js
