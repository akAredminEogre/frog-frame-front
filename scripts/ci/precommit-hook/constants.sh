#!/bin/bash

# Shared constants for pre-commit hook scripts
# This file is sourced by both main.sh and check-and-setup.sh to ensure consistency

# Expected lefthook path for patching and verification (SINGLE SOURCE OF TRUTH)
# This value is used by:
#   1. patch-hook.awk - Inserts this path into the pre-commit hook
#   2. main.sh / check-and-setup.sh - Verifies the patch was applied correctly (via grep)
#
# Note: This is a literal string; shell variables ($dir, ${osArch}, etc.) are NOT expanded
# The variables are expanded at runtime by the pre-commit hook itself
readonly EXPECTED_LEFTHOOK_PATH='$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook'
