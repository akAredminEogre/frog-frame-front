# AWK script to patch pre-commit hook for custom node_modules path
# Usage: awk -v STATUS_FILE="<path>" -f patch-hook.awk <input_file>
#
# This script inserts an elif block after the @evilmartians/lefthook execution line
# to check for lefthook in host-frontend-root/frontend-src-root/node_modules

BEGIN { matched = 0; patched = 0 }

# Match the execution line for @evilmartians/lefthook (flexible pattern for arch and quote styles)
# Only patch the first occurrence to prevent duplicate patches
# Note: Pattern anchored to line start to avoid matching comments or echo statements
# Pattern handles optional single/double quotes around paths and $@
/^[ \t]*['"]?[^'"]*@evilmartians\/lefthook\/bin\/lefthook-[^/]+\/lefthook['"]?[ \t]+['"]?\$@['"]?[ \t]*$/ {
    matched = 1
    print
    # Early skip if already patched (prevents duplicate insertion)
    if (patched == 1) { next }
    patched = 1
    # Extract leading indentation from matched line (spaces and tabs only)
    match($0, /^[ \t]*/)
    base_indent = substr($0, RSTART, RLENGTH)
    # Remove one indentation level for elif/then (outer level)
    # Cascade logic: each check only runs if previous checks did not modify outer_indent
    # (detected via "outer_indent == base_indent" guard condition)
    len = length(base_indent)
    # Default: use same indentation (no removal)
    outer_indent = base_indent
    # Tab-based indentation: remove one tab (most common in shell scripts)
    if (len >= 1 && substr(base_indent, len, 1) == "\t") {
        outer_indent = substr(base_indent, 1, len - 1)
    }
    # Space-based indentation (2-space): only if tab check did not match
    if (outer_indent == base_indent && len >= 2 && substr(base_indent, len - 1, 2) == "  ") {
        outer_indent = substr(base_indent, 1, len - 2)
    }
    # Fallback for other indentation styles: only if both tab and space checks failed
    if (outer_indent == base_indent && len >= 1) {
        outer_indent = substr(base_indent, 1, len - 1)
    }
    print outer_indent "elif test -f \"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\""
    print outer_indent "then"
    print base_indent "\"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\" \"$@\""
    next
}

{ print }

END { print matched > STATUS_FILE }
