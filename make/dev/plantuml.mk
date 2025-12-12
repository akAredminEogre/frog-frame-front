# PlantUML Commands
# Commands for rendering PlantUML diagrams to images

.PHONY: plantuml plantuml-svg plantuml-server plantuml-server-stop plantuml-check

# Default diagrams directory
DIAGRAMS_DIR ?= docs/diagrams

# Render all PlantUML diagrams to PNG
plantuml:
	@echo "Rendering PlantUML diagrams to PNG..."
	@scripts/plantuml/render.sh all png $(DIAGRAMS_DIR) $(DIAGRAMS_DIR)

# Render all PlantUML diagrams to SVG
plantuml-svg:
	@echo "Rendering PlantUML diagrams to SVG..."
	@scripts/plantuml/render.sh all svg $(DIAGRAMS_DIR) $(DIAGRAMS_DIR)

# Start PlantUML server
plantuml-server:
	@echo "Starting PlantUML server..."
	@docker compose --profile plantuml up -d plantuml
	@echo "PlantUML server is running at http://localhost:$${PLANTUML_PORT:-8180}"
	@echo "Use 'make plantuml' to render diagrams"

# Stop PlantUML server
plantuml-server-stop:
	@echo "Stopping PlantUML server..."
	@docker compose --profile plantuml stop plantuml

# Check if PlantUML server is running
plantuml-check:
	@scripts/plantuml/render.sh check
