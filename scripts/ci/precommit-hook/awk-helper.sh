#!/bin/bash

# AWK helper functions for precommit-hook scripts
# Source this file to use the functions:
#   source "$(dirname "$0")/awk-helper.sh"

# Run awk patch script and verify pattern matched
# Usage: run_awk_patch <awk_script> <input_file> <output_file> <status_file>
# Example: run_awk_patch "./patch-hook.awk" "/path/to/hook" "/tmp/out" "/tmp/status"
# Note: Exits on awk failure or pattern mismatch
run_awk_patch() {
    local AWK_SCRIPT="$1"
    local INPUT_FILE="$2"
    local OUTPUT_FILE="$3"
    local STATUS_FILE="$4"

    if ! awk -v STATUS_FILE="${STATUS_FILE}" -f "${AWK_SCRIPT}" "${INPUT_FILE}" > "${OUTPUT_FILE}"; then
        echo "Error: awk processing failed."
        exit 1
    fi

    # Verify awk pattern matched
    # Check status file exists and is non-empty (distinguishes awk failure from pattern mismatch)
    if [ ! -s "${STATUS_FILE}" ]; then
        echo "Error: Internal processing error. Status file is empty or missing."
        exit 1
    fi

    local PATTERN_MATCHED
    PATTERN_MATCHED=$(cat "${STATUS_FILE}")
    if [ "${PATTERN_MATCHED}" != "1" ]; then
        echo "Error: Failed to patch pre-commit hook. The awk pattern did not match lefthook format."
        echo "This may indicate lefthook version incompatibility. Check generated hook format."
        exit 1
    fi
}
