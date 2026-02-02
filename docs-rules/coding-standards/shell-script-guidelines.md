# Shell Script Coding Guidelines

## Error Output Convention

All error messages MUST be written to stderr (`>&2`), not stdout.

### Rule

```bash
# CORRECT: Error messages go to stderr
echo "Error: Something went wrong" >&2

# INCORRECT: Error messages to stdout
echo "Error: Something went wrong"
```

### Rationale

1. **Separation of concerns**: stdout is for normal output, stderr is for errors
2. **Pipeline safety**: Errors won't pollute pipelines (`cmd1 | cmd2`)
3. **Logging**: stderr can be redirected separately for error logs
4. **Script composition**: Calling scripts can distinguish success output from errors

### Examples

```bash
# File existence check
if [ ! -f "${CONFIG_FILE}" ]; then
    echo "Error: Config file not found at ${CONFIG_FILE}" >&2
    exit 1
fi

# Command execution failure
if ! some_command; then
    echo "Error: some_command failed" >&2
    exit 1
fi

# Multi-line error messages
if [ ! -d "${REQUIRED_DIR}" ]; then
    echo "Error: Required directory not found: ${REQUIRED_DIR}" >&2
    echo "Please run setup script first." >&2
    exit 1
fi
```

### Warning Messages

Warning messages (non-fatal) should also go to stderr:

```bash
echo "Warning: Optional dependency not found. Some features disabled." >&2
```

### Info Messages

Informational messages that are part of normal operation go to stdout:

```bash
echo "Installing dependencies..."
echo "Setup complete!"
```

## npm Check Logic Consistency

When checking for Node.js tooling availability, ensure consistency between:
- npx availability
- npm availability
- Node.js version requirements

### Rule

If a script requires npm operations (like `npm install`), check for both `npx` AND `npm`:

```bash
# Check if npx is available
if ! command -v npx >/dev/null 2>&1; then
    echo "Warning: npx command not found. Skipping setup." >&2
    exit 0
fi

# Check if npm is available (required for npm install)
if ! command -v npm >/dev/null 2>&1; then
    echo "Warning: npm command not found. Skipping setup." >&2
    exit 0
fi
```

### Rationale

- npx and npm are typically installed together, but not guaranteed
- Some environments may have npx without npm (e.g., custom tooling)
- Scripts that run `npm install` will fail cryptically if npm is missing

## Exit Code Convention

| Exit Code | Meaning |
|-----------|---------|
| 0 | Success |
| 0 | Graceful skip (optional dependency not met) |
| 1 | Error (with stderr message) |

### Graceful Skip Example

```bash
# Git not installed - skip gracefully
if ! command -v git >/dev/null 2>&1; then
    echo "Warning: git not found. Skipping pre-commit hook setup." >&2
    exit 0  # Not an error, just skipping
fi
```
