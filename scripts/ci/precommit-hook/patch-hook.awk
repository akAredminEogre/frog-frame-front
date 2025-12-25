# AWK script to patch pre-commit hook for custom node_modules path
# Usage: awk -v STATUS_FILE="<path>" -f patch-hook.awk <input_file>
#
# This script inserts an elif block after the @evilmartians/lefthook execution line
# to check for lefthook in host-frontend-root/frontend-src-root/node_modules

# Remove one indentation level from the given indent string
# Supports: tab, 4-space, 2-space indentation styles
# Returns: indent string with one level removed, or original if cannot determine style
function remove_one_indent_level(indent,    len, result) {
    len = length(indent)
    result = indent
    # Tab-based indentation: remove one tab (most common in shell scripts)
    if (len >= 1 && substr(indent, len, 1) == "\t") {
        return substr(indent, 1, len - 1)
    }
    # Space-based indentation (4-space)
    if (len >= 4 && substr(indent, len - 3, 4) == "    ") {
        return substr(indent, 1, len - 4)
    }
    # Space-based indentation (2-space)
    if (len >= 2 && substr(indent, len - 1, 2) == "  ") {
        return substr(indent, 1, len - 2)
    }
    # Fallback: remove one character
    if (len >= 1) {
        return substr(indent, 1, len - 1)
    }
    return result
}

BEGIN { pattern_matched = 0; already_patched = 0 }

# Match the execution line for @evilmartians/lefthook (flexible pattern for arch and quote styles)
# Only patch the first occurrence to prevent duplicate patches
# Note: Pattern anchored to line start to avoid matching comments or echo statements
# Pattern handles optional single/double quotes around paths and $@
/^[ \t]*['"]?[^'"]*@evilmartians\/lefthook\/bin\/lefthook-[^/]+\/lefthook['"]?[ \t]+['"]?\$@['"]?[ \t]*$/ {
    pattern_matched = 1
    print
    # Early skip if already patched (prevents duplicate insertion)
    if (already_patched == 1) { next }
    already_patched = 1
    # Extract leading indentation from matched line (spaces and tabs only)
    # Note: Pattern /^[ \t]*/ always matches (can match zero chars), so direct assignment is safe
    match($0, /^[ \t]*/)
    base_indent = substr($0, RSTART, RLENGTH)
    # Remove one indentation level for elif/then (outer level)
    # Note: lefthook-generated scripts typically use tab indentation
    outer_indent = remove_one_indent_level(base_indent)
    print outer_indent "elif test -f \"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\""
    print outer_indent "then"
    print base_indent "\"$dir/host-frontend-root/frontend-src-root/node_modules/@evilmartians/lefthook/bin/lefthook-${osArch}-${cpuArch}/lefthook\" \"$@\""
    next
}

{ print }

END {
    print pattern_matched > STATUS_FILE
    # Note: close() return value checking removed for portability (mawk and older AWK
    # implementations may not handle it consistently). Write errors are detected by
    # the caller via status file validation.
    close(STATUS_FILE)
}
