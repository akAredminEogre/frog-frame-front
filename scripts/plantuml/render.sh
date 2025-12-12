#!/bin/bash
# PlantUML Rendering Script
# Converts .puml files to images using PlantUML server

set -e

# Configuration
PLANTUML_SERVER_URL="${PLANTUML_SERVER_URL:-http://localhost:8180}"
OUTPUT_FORMAT="${1:-png}"  # png or svg
DIAGRAMS_DIR="${2:-docs/diagrams}"
OUTPUT_DIR="${3:-$DIAGRAMS_DIR}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to render a single file using POST request
render_file() {
    local puml_file="$1"
    local format="$2"
    local output_dir="$3"

    local basename=$(basename "$puml_file" .puml)
    local output_file="$output_dir/$basename.$format"

    echo -e "${YELLOW}Rendering:${NC} $puml_file -> $output_file"

    # POST the PlantUML source directly to the server
    # The server accepts source code via POST and returns the rendered image
    if curl -sf -X POST \
        --data-urlencode "text@$puml_file" \
        "$PLANTUML_SERVER_URL/$format/" \
        -o "$output_file"; then
        echo -e "${GREEN}Success:${NC} $output_file"
        return 0
    else
        echo -e "${RED}Failed:${NC} $puml_file"
        return 1
    fi
}

# Function to check if PlantUML server is available
check_server() {
    if ! curl -sf "$PLANTUML_SERVER_URL" > /dev/null 2>&1; then
        echo -e "${RED}Error:${NC} PlantUML server is not running at $PLANTUML_SERVER_URL"
        echo "Please start the PlantUML server with: make plantuml-server"
        exit 1
    fi
}

# Function to render all files
render_all() {
    local format="$1"
    local diagrams_dir="$2"
    local output_dir="$3"

    check_server

    # Create output directory if it doesn't exist
    mkdir -p "$output_dir"

    local success_count=0
    local fail_count=0

    # Find all .puml files
    while IFS= read -r -d '' puml_file; do
        if render_file "$puml_file" "$format" "$output_dir"; then
            ((success_count++))
        else
            ((fail_count++))
        fi
    done < <(find "$diagrams_dir" -name "*.puml" -print0)

    echo ""
    echo -e "${GREEN}Completed:${NC} $success_count files rendered successfully"
    if [ $fail_count -gt 0 ]; then
        echo -e "${RED}Failed:${NC} $fail_count files"
        exit 1
    fi
}

# Main execution
main() {
    case "${1:-all}" in
        all)
            render_all "$OUTPUT_FORMAT" "$DIAGRAMS_DIR" "$OUTPUT_DIR"
            ;;
        file)
            if [ -z "$2" ]; then
                echo "Usage: $0 file <puml_file> [format]"
                exit 1
            fi
            check_server
            render_file "$2" "${3:-$OUTPUT_FORMAT}" "$OUTPUT_DIR"
            ;;
        check)
            check_server
            echo -e "${GREEN}PlantUML server is running at $PLANTUML_SERVER_URL${NC}"
            ;;
        *)
            echo "Usage: $0 [all|file|check] [options]"
            echo ""
            echo "Commands:"
            echo "  all          Render all .puml files in diagrams directory (default)"
            echo "  file <path>  Render a specific .puml file"
            echo "  check        Check if PlantUML server is running"
            echo ""
            echo "Environment variables:"
            echo "  PLANTUML_SERVER_URL  PlantUML server URL (default: http://localhost:8180)"
            echo "  OUTPUT_FORMAT        Output format: png or svg (default: png)"
            exit 1
            ;;
    esac
}

main "$@"
