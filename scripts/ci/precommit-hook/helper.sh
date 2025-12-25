#!/bin/bash

# Helper functions for precommit-hook scripts
# Source this file to use the functions:
#   source "$(dirname "$0")/helper.sh"

# Check if a command is available, exit with error if not
# Usage: require_command <command_name> <install_hint>
# Example: require_command git "Please install Git."
# Note: Exits script on failure (use command -v directly if return value needed)
require_command() {
    local COMMAND_NAME="$1"
    local INSTALL_HINT="$2"

    if command -v "${COMMAND_NAME}" >/dev/null 2>&1; then
        return 0
    fi

    echo "Error: ${COMMAND_NAME} command not found. ${INSTALL_HINT}" >&2
    exit 1
}

# Check if a directory exists, exit with error if not
# Usage: require_directory <directory_path> <error_message>
# Example: require_directory "/path/to/dir" "Directory not found"
# Note: Exits script on failure (use directory_exists if return value needed)
require_directory() {
    local DIRECTORY_PATH="$1"
    local ERROR_MESSAGE="$2"

    if [ -d "${DIRECTORY_PATH}" ]; then
        return 0
    fi

    echo "Error: ${ERROR_MESSAGE}" >&2
    exit 1
}

# Check if a file exists, exit with error if not
# Usage: require_file <file_path> <error_message>
# Example: require_file "/path/to/file" "File not found"
# Note: Exits script on failure (use [ -f ] directly if return value needed)
require_file() {
    local FILE_PATH="$1"
    local ERROR_MESSAGE="$2"

    if [ -f "${FILE_PATH}" ]; then
        return 0
    fi

    echo "Error: ${ERROR_MESSAGE}" >&2
    exit 1
}

# Check if a directory exists (returns 0 if exists, 1 if not)
# Usage: if directory_exists "/path/to/dir"; then ...
# Note: Does not exit on failure, just returns status
directory_exists() {
    local DIRECTORY_PATH="$1"
    [ -d "${DIRECTORY_PATH}" ]
}

# Remove file with warning on failure (idempotent: returns success if file doesn't exist)
# Usage: remove_file_with_warning <file_path>
# Note: Checks existence first, then uses rm without -f to detect actual failures
remove_file_with_warning() {
    local FILE_PATH="$1"
    if [ ! -f "${FILE_PATH}" ]; then
        return 0
    fi
    if ! rm "${FILE_PATH}" 2>/dev/null; then
        echo "Warning: Failed to remove file: ${FILE_PATH}" >&2
    fi
}

# Restore a backup file to its original location
# Usage: restore_backup <backup_file> <target_file>
# Example: restore_backup "/path/to/file.backup" "/path/to/file"
# Note: Exits on failure because corrupted state is unrecoverable
restore_backup() {
    local BACKUP_FILE="$1"
    local TARGET_FILE="$2"

    if ! mv "${BACKUP_FILE}" "${TARGET_FILE}"; then
        echo "Error: Failed to restore backup. Manual recovery required: cp ${BACKUP_FILE} ${TARGET_FILE}" >&2
        exit 1
    fi
}
