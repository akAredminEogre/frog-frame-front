#!/bin/bash

# Main entry point for frog-frame-front shell functions
# Add this to your shell profile: source /path/to/frog-frame-front/scripts/main.sh

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source all shell function scripts
source "$SCRIPT_DIR/wt-cd.sh"
