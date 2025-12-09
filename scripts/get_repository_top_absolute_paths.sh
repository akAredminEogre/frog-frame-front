#!/bin/bash
# Get the absolute path of the repository top directory
# This script provides a function to resolve the repository root path
# regardless of the current working directory

# Get the absolute path of the repository top directory
# Uses the script's location to determine the repository root (2 levels up from scripts/)
get_repository_top_absolute_paths() {
    # Get the directory of this script using BASH_SOURCE for correct resolution when sourced
    local SCRIPT_DIR
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    # Go up 1 level from scripts/ to repository root
    (cd "$SCRIPT_DIR/.." && pwd)
}

# Allow direct execution for use in Makefiles
# Usage: ./scripts/get_repository_top_absolute_paths.sh get_repository_top_absolute_paths
if [ -n "$1" ]; then
    "$@"
fi
