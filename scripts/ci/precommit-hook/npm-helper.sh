#!/bin/bash

# NPM helper functions for precommit-hook scripts
# Source this file to use the functions:
#   source "$(dirname "$0")/npm-helper.sh"

# Source helper.sh for directory_exists function
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/helper.sh"

# Ensure npm dependencies are installed by checking for a specific package
# Usage: ensure_npm_dependencies <frontend_dir> <package_dir> <package_name>
# Example: ensure_npm_dependencies "/path/to/frontend" "/path/to/node_modules/pkg" "package"
# Note: Returns 1 on any failure; caller handles exit
ensure_npm_dependencies() {
    local FRONTEND_DIR="$1"
    local PACKAGE_DIR="$2"
    local PACKAGE_NAME="$3"

    if directory_exists "${PACKAGE_DIR}"; then
        return 0
    fi

    echo "Installing npm dependencies..."
    # Verify package.json exists before attempting install
    if [ ! -f "${FRONTEND_DIR}/package.json" ]; then
        echo "Error: package.json not found in ${FRONTEND_DIR}" >&2
        return 1
    fi
    # Note: --no-fund speeds up install by suppressing funding messages
    if ! (cd "${FRONTEND_DIR}" && npm install --no-fund); then
        echo "Error: npm install failed. Troubleshooting tips:" >&2
        echo "  - Check disk space (df -h)" >&2
        echo "  - Verify cache integrity (npm cache verify)" >&2
        echo "  - Clear npm cache if corrupted (npm cache clean --force)" >&2
        echo "  - Verify network connectivity" >&2
        echo "  - Check file permissions in ${FRONTEND_DIR}" >&2
        return 1
    fi

    # Verify package was installed
    if ! directory_exists "${PACKAGE_DIR}"; then
        echo "Error: ${PACKAGE_NAME} not found after npm install. Installation may be incomplete." >&2
        return 1
    fi
}
