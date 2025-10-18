#!/usr/bin/env python3
"""
Generate diagram images from PlantUML files
Requires: requests library (pip install requests)
"""

import os
import base64
import zlib
import requests
from pathlib import Path

def plantuml_encode(plantuml_text):
    """Encode PlantUML text for URL"""
    # Compress
    zlibbed_str = zlib.compress(plantuml_text.encode('utf-8'))
    # Encode in base64
    compressed_string = zlibbed_str[2:-4]  # Remove zlib header and footer
    # Encode for URL
    return base64.urlsafe_b64encode(compressed_string).decode('utf-8').replace('=', '')

def generate_plantuml_image(puml_file, output_file):
    """Generate PNG image from PlantUML file using online server"""
    print(f"Processing {puml_file}...")
    
    # Read the PlantUML file
    with open(puml_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Encode the content
    encoded = plantuml_encode(content)
    
    # Create URL for PlantUML server
    url = f"http://www.plantuml.com/plantuml/png/{encoded}"
    
    print(f"  Fetching from PlantUML server...")
    
    try:
        # Download the image
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Save the image
        with open(output_file, 'wb') as f:
            f.write(response.content)
        
        print(f"  [OK] Saved as {output_file}")
        return True
    except Exception as e:
        print(f"  [ERROR] {e}")
        return False

def main():
    print("CardSense Diagram Generator")
    print("=" * 50)
    
    # Get the directory of this script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # List of PlantUML files to process
    files_to_process = [
        ('class_diagram.puml', 'class_diagram.png'),
        ('usecase_diagram.puml', 'usecase_diagram.png'),
        ('usecase_scenarios.puml', 'usecase_scenarios.png'),
    ]
    
    success_count = 0
    
    for puml_file, output_file in files_to_process:
        if os.path.exists(puml_file):
            if generate_plantuml_image(puml_file, output_file):
                success_count += 1
        else:
            print(f"  [ERROR] File not found: {puml_file}")
    
    print()
    print("=" * 50)
    print(f"Generated {success_count} out of {len(files_to_process)} diagrams")
    print()
    print("Note: Mermaid diagrams in .md files need to be generated separately.")
    print("See GENERATE_IMAGES.md for instructions.")

if __name__ == "__main__":
    try:
        import requests
    except ImportError:
        print("Error: 'requests' library not found.")
        print("Install it with: pip install requests")
        exit(1)
    
    main()

