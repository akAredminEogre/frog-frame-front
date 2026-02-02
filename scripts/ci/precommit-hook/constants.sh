#!/bin/bash

# Shared constants for pre-commit hook scripts
# This file is sourced by both main.sh and check-and-setup.sh to ensure consistency

# Expected patch path for verification
# Note: This is a literal grep pattern; shell variables ($dir, ${osArch}, etc.) are NOT expanded
# Used to verify that the pre-commit hook has been patched correctly
readonly EXPECTED_LEFTHOOK_PATH='$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook'
