# How to Generate Diagram Images

This guide explains how to convert the PlantUML and Mermaid diagrams into image files.

## Method 1: PlantUML Online Server (Easiest)

### For PlantUML Diagrams (.puml files)

1. **Visit the PlantUML Online Server**
   - Go to: http://www.plantuml.com/plantuml/uml/

2. **Upload Your Diagram**
   - Open any `.puml` file from this directory
   - Copy the entire contents
   - Paste into the online editor

3. **Download as PNG**
   - The diagram will render automatically
   - Click "PNG" to download the image
   - Save as `class_diagram.png`, `usecase_diagram.png`, etc.

### Files to Convert:
- `class_diagram.puml` → `class_diagram.png`
- `usecase_diagram.puml` → `usecase_diagram.png`
- `usecase_scenarios.puml` → `usecase_scenarios.png`

## Method 2: Mermaid Live Editor

### For Mermaid Diagrams (in .md files)

1. **Visit Mermaid Live Editor**
   - Go to: https://mermaid.live/

2. **Copy Mermaid Code**
   - Open `class_diagram.md` or `usecase_diagram.md`
   - Copy only the code between \`\`\`mermaid and \`\`\`
   - Paste into the live editor

3. **Export as PNG/SVG**
   - Click "Actions" → "Export PNG" or "Export SVG"
   - Save the file

## Method 3: Using VS Code (Best for Developers)

### Install Extensions

1. **For PlantUML:**
   ```
   ext install jebbs.plantuml
   ```
   
2. **For Mermaid:**
   ```
   ext install bierner.markdown-mermaid
   ```

### Generate Images:

**PlantUML:**
- Open any `.puml` file
- Press `Alt+D` to preview
- Right-click on preview → "Export Current Diagram"
- Choose PNG format

**Mermaid:**
- Open `.md` file with Mermaid diagrams
- Use Markdown preview
- Right-click on diagram → "Copy Image" or use screenshot tool

## Method 4: Command Line (For Automation)

### Install PlantUML

**Using npm:**
```bash
npm install -g node-plantuml
```

**Using Java:**
```bash
# Download plantuml.jar from https://plantuml.com/download
java -jar plantuml.jar diagram_file.puml
```

### Generate All PlantUML Images:

```bash
cd diagrams
java -jar plantuml.jar class_diagram.puml
java -jar plantuml.jar usecase_diagram.puml
java -jar plantuml.puml usecase_scenarios.puml
```

This will create PNG files in the same directory.

### Install Mermaid CLI

```bash
npm install -g @mermaid-js/mermaid-cli
```

### Generate Mermaid Images:

```bash
mmdc -i class_diagram.md -o class_diagram_mermaid.png
mmdc -i usecase_diagram.md -o usecase_diagram_mermaid.png
```

## Method 5: Automated Script (Windows PowerShell)

Save this as `generate_diagrams.ps1` and run it:

```powershell
# Generate PlantUML diagrams
$plantumlFiles = @(
    "class_diagram.puml",
    "usecase_diagram.puml",
    "usecase_scenarios.puml"
)

foreach ($file in $plantumlFiles) {
    $url = "http://www.plantuml.com/plantuml/png/"
    $content = Get-Content $file -Raw
    $encoded = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
    $imageUrl = "$url$encoded"
    
    $outputFile = $file -replace '\.puml$', '.png'
    Invoke-WebRequest -Uri $imageUrl -OutFile $outputFile
    Write-Host "Generated: $outputFile"
}
```

## Quick Reference

| Source File | Output File | Method |
|------------|-------------|--------|
| `class_diagram.puml` | `class_diagram.png` | PlantUML |
| `usecase_diagram.puml` | `usecase_diagram.png` | PlantUML |
| `usecase_scenarios.puml` | `usecase_scenarios.png` | PlantUML |
| `class_diagram.md` | `class_diagram_mermaid.png` | Mermaid |
| `usecase_diagram.md` | `usecase_diagram_mermaid.png` | Mermaid |
| `ER_diagram.md` | `ER_diagram.png` | Mermaid |

## Troubleshooting

**PlantUML:**
- If diagrams are too large, add `skinparam dpi 300` to the .puml file
- For better quality, use SVG format instead of PNG

**Mermaid:**
- If text is cut off, adjust theme or add `%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%`
- Some complex diagrams may need to be broken into smaller parts

## Recommended Output

For best results, generate:
- **PNG** for documentation and presentations (300 DPI)
- **SVG** for web use and scalability
- **PDF** for printing

## Pre-Generated Links

You can also view the diagrams online without downloading:

**PlantUML Viewer:**
```
http://www.plantuml.com/plantuml/uml/[ENCODED_CONTENT]
```

**Mermaid Viewer:**
```
https://mermaid.ink/img/[BASE64_ENCODED_CONTENT]
```

---

**Note:** For the easiest approach, use Method 1 (PlantUML Online Server) or Method 2 (Mermaid Live Editor). Both allow you to generate high-quality images in seconds without installing anything.

