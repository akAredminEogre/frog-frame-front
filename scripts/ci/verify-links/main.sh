#!/bin/bash

# Verify internal links in markdown files
# This script checks that all relative links in markdown files point to existing files.
#
# 使用例:
#   ./scripts/ci/verify-links/main.sh [directory]
#   ./scripts/ci/verify-links/main.sh           # Default: docs/
#   ./scripts/ci/verify-links/main.sh docs/adr  # Check specific directory
#
# 終了コード:
#   0: すべてのリンクが有効
#   1: 壊れたリンクが見つかった

set -e

# Get script directory and repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

# Default target directory
TARGET_DIR="${1:-docs}"

# Change to repo root
cd "${REPO_ROOT}"

# Verify target directory exists
if [ ! -d "${TARGET_DIR}" ]; then
  echo "Error: Directory '${TARGET_DIR}' not found"
  exit 1
fi

echo "Verifying links in ${TARGET_DIR}..."

# Track broken links
declare -a broken_links
checked_count=0
file_count=0

# Find all markdown files and process them
while IFS= read -r md_file; do
  file_count=$((file_count + 1))
  md_dir="$(dirname "${md_file}")"

  # Extract markdown links using grep
  # Pattern: [text](path) where path doesn't start with http://, https://, mailto:, or #
  links=$(grep -oE '\[[^]]*\]\([^)]+\)' "${md_file}" 2>/dev/null || true)

  while IFS= read -r full_link; do
    # Skip empty lines
    [ -z "${full_link}" ] && continue

    # Extract just the path part from [text](path)
    link=$(echo "${full_link}" | sed -E 's/\[[^]]*\]\(([^)]+)\)/\1/')

    # Remove optional title part (e.g., "title" or 'title') from links like [text](path "title")
    link="${link%%[[:space:]]*}"

    # Skip external links (http, https, mailto)
    [[ "${link}" =~ ^https?:// ]] && continue
    [[ "${link}" =~ ^mailto: ]] && continue

    # Skip pure anchor links
    [[ "${link}" =~ ^# ]] && continue

    # Skip placeholder/example paths (commonly used in documentation examples)
    [[ "${link}" =~ XXX ]] && continue
    [[ "${link}" =~ path/to/ ]] && continue
    [[ "${link}" =~ \<.*\> ]] && continue

    # Remove anchor part for file existence check
    link_without_anchor="${link%%#*}"

    # Skip if link is empty after removing anchor
    [ -z "${link_without_anchor}" ] && continue

    checked_count=$((checked_count + 1))

    # Resolve the target path relative to the markdown file's directory
    if [[ "${link_without_anchor}" == /* ]]; then
      # Absolute path from repo root
      target_path="${REPO_ROOT}${link_without_anchor}"
    else
      # Relative path from the markdown file's directory
      target_path="${md_dir}/${link_without_anchor}"
    fi

    # Check if target exists (file or directory)
    if [ ! -e "${target_path}" ]; then
      broken_links+=("${md_file}|${link}")
    fi
  done <<< "${links}"

done < <(find "${TARGET_DIR}" -name "*.md" -type f 2>/dev/null | sort)

# Report results
echo ""
echo "=== Link Verification Report ==="
echo "Files checked: ${file_count}"
echo "Links checked: ${checked_count}"

if [ ${#broken_links[@]} -eq 0 ]; then
  echo "Status: All links are valid"
  exit 0
else
  echo "Status: Found ${#broken_links[@]} broken link(s)"
  echo ""
  echo "Broken links:"
  for broken in "${broken_links[@]}"; do
    file="${broken%%|*}"
    link="${broken#*|}"
    echo "  ${file}"
    echo "    -> ${link}"
  done
  exit 1
fi
