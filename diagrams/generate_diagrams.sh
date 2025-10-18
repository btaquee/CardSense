#!/bin/bash

# Generate diagram images from PlantUML files
# Requires: plantuml.jar or plantuml command

echo "Generating CardSense Diagrams..."

# Check if plantuml is available
if command -v plantuml &> /dev/null; then
    echo "Using plantuml command..."
    plantuml class_diagram.puml
    plantuml usecase_diagram.puml
    plantuml usecase_scenarios.puml
    echo "✓ PlantUML diagrams generated"
elif [ -f "plantuml.jar" ]; then
    echo "Using plantuml.jar..."
    java -jar plantuml.jar class_diagram.puml
    java -jar plantuml.jar usecase_diagram.puml
    java -jar plantuml.jar usecase_scenarios.puml
    echo "✓ PlantUML diagrams generated"
else
    echo "❌ PlantUML not found. Please install plantuml or download plantuml.jar"
    echo "Visit: https://plantuml.com/download"
fi

# Check if mermaid-cli is available for Mermaid diagrams
if command -v mmdc &> /dev/null; then
    echo "Generating Mermaid diagrams..."
    mmdc -i ER_diagram.md -o ER_diagram.png
    echo "✓ Mermaid diagrams generated"
else
    echo "⚠ mermaid-cli not found. Skipping Mermaid diagrams."
    echo "Install with: npm install -g @mermaid-js/mermaid-cli"
fi

echo ""
echo "Done! Check for .png files in this directory."
echo "For manual generation, see GENERATE_IMAGES.md"

