#!/bin/bash

# Helper functions for precommit-hook scripts
# Source this file to use the functions:
#   source "$(dirname "$0")/helper.sh"

# Check if a command is available, exit with error if not
# Usage: require_command <command_name> <install_hint>
# Example: require_command git "Please install Git."
require_command() {
    local COMMAND_NAME="$1"
    local INSTALL_HINT="$2"

    if command -v "${COMMAND_NAME}" >/dev/null 2>&1; then
        return 0
    fi

    echo "Error: ${COMMAND_NAME} command not found. ${INSTALL_HINT}"
    exit 1
}

# Check if a directory exists, exit with error if not
# Usage: require_directory <directory_path> <error_message>
# Example: require_directory "/path/to/dir" "Directory not found"
require_directory() {
    local DIRECTORY_PATH="$1"
    local ERROR_MESSAGE="$2"

    if [ -d "${DIRECTORY_PATH}" ]; then
        return 0
    fi

    echo "Error: ${ERROR_MESSAGE}"
    exit 1
}

# Check if a file exists, exit with error if not
# Usage: require_file <file_path> <error_message>
# Example: require_file "/path/to/file" "File not found"
require_file() {
    local FILE_PATH="$1"
    local ERROR_MESSAGE="$2"

    if [ -f "${FILE_PATH}" ]; then
        return 0
    fi

    echo "Error: ${ERROR_MESSAGE}"
    exit 1
}

# Check if a directory exists (returns 0 if exists, 1 if not)
# Usage: if directory_exists "/path/to/dir"; then ...
# Note: Does not exit on failure, just returns status
directory_exists() {
    local DIRECTORY_PATH="$1"
    [ -d "${DIRECTORY_PATH}" ]
}

# Remove file with warning on failure
# Usage: remove_file_with_warning <file_path>
# Note: Checks existence first, then uses rm without -f to detect actual failures
remove_file_with_warning() {
    local FILE_PATH="$1"
    if [ ! -f "${FILE_PATH}" ]; then
        return 0
    fi
    if ! rm "${FILE_PATH}" 2>/dev/null; then
        echo "Warning: Failed to remove file: ${FILE_PATH}"
    fi
}
