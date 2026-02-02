#!/bin/bash

# AWK helper functions for precommit-hook scripts
# Source this file to use the functions:
#   source "$(dirname "$0")/awk-helper.sh"

# Run awk patch script and verify pattern matched
# Usage: run_awk_patch <awk_script> <input_file> <output_file> <status_file>
# Example: run_awk_patch "./patch-hook.awk" "/path/to/hook" "/tmp/out" "/tmp/status"
# Note: Exits on awk failure or pattern mismatch
# Note: Requires EXPECTED_LEFTHOOK_PATH to be set (from constants.sh)
run_awk_patch() {
    local AWK_SCRIPT="$1"
    local INPUT_FILE="$2"
    local OUTPUT_FILE="$3"
    local STATUS_FILE="$4"

    # Pass EXPECTED_LEFTHOOK_PATH to awk to maintain single source of truth
    if ! awk -v STATUS_FILE="${STATUS_FILE}" -v LEFTHOOK_PATH="${EXPECTED_LEFTHOOK_PATH}" -f "${AWK_SCRIPT}" "${INPUT_FILE}" > "${OUTPUT_FILE}"; then
        echo "Error: awk processing failed. Check input file exists and output location is writable." >&2
        exit 1
    fi

    # Verify awk pattern matched
    # Check status file exists and is non-empty (distinguishes awk failure from pattern mismatch)
    if [ ! -s "${STATUS_FILE}" ]; then
        echo "Error: AWK script did not write status file. This may indicate a script failure." >&2
        exit 1
    fi

    local PATTERN_MATCHED
    read -r PATTERN_MATCHED < "${STATUS_FILE}"
    if [ "${PATTERN_MATCHED}" != "1" ]; then
        echo "Error: Failed to patch pre-commit hook. The awk pattern did not match lefthook format." >&2
        echo "This may indicate lefthook version incompatibility. Check generated hook format." >&2
        exit 1
    fi
}
