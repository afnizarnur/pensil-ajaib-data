# TOON Generation Script

This script generates TOON (Token-Oriented Object Notation) format files from markdown guidelines in the pensil-ajaib-data repository.

## Purpose

The TOON format reduces token usage by 40-60% when passing guidelines to Large Language Models, significantly reducing API costs while maintaining full data integrity.

## Installation

This script is designed to be run in the **pensil-ajaib-data** repository, not in this repository.

1. Copy this entire `toon-generator/` directory to the pensil-ajaib-data repository as `.toon/`
2. Navigate to the `.toon/` directory
3. Install dependencies:

```bash
cd .toon
npm install
```

## Usage

### Basic Usage

Run from the `.toon/` directory in pensil-ajaib-data:

```bash
node generate.js
```

This will:
- Read all markdown files from the repository
- Compose guideline combinations (base + features)
- Convert to TOON format
- Write `.toon` files to the current directory
- Generate `index.json` with metadata

### Command Line Options

```bash
# Specify custom source directory (default: ../)
node generate.js --source-dir /path/to/pensil-ajaib-data

# Specify custom output directory (default: ./)
node generate.js --output-dir /path/to/output

# Quiet mode (minimal output)
node generate.js --quiet
```

## Output

The script generates:

1. **TOON files** - One file per guideline combination:
   - `murid-base.toon` - Base guidelines for murid user
   - `guru-base.toon` - Base guidelines for guru user
   - `murid-ai-powered-features.toon` - Murid + AI features
   - etc.

2. **index.json** - Metadata file containing:
   - List of all generated files
   - Token counts (JSON vs TOON)
   - Percentage savings
   - File sizes and checksums
   - Generation timestamp

## File Naming Convention

Files follow the pattern: `{user}-{feature}.toon`

- Base files (no features): `{user}-base.toon`
- With feature: `{user}-{feature}.toon`

Examples:
- `murid-base.toon`
- `guru-base.toon`
- `murid-ai-powered-features.toon`

## Validation

The script automatically validates each generated TOON file by:
1. Decoding the TOON content back to the original structure
2. Comparing keys to ensure data integrity
3. Skipping files that fail validation

## Token Savings

The script calculates and reports:
- Token count for JSON format
- Token count for TOON format
- Percentage savings
- Total tokens saved across all files

Example output:
```
==================================================
Generation Complete!
==================================================
Total files generated: 12
Average token savings: 42.5%
Total JSON tokens: 180,000
Total TOON tokens: 103,500
Total tokens saved: 76,500
Total size: 450.25 KB
Index written to: index.json
==================================================
```

## Integration with GitHub Actions

This script is designed to be run automatically via GitHub Actions whenever markdown files change. See `.github/workflows/generate-toon.yml` in the pensil-ajaib-data repository.

## Troubleshooting

### "No tribes found"
- Ensure you're running the script from the `.toon/` directory
- Check that `Core Guidelines/` directory exists in the parent directory
- Verify tribe directories follow the pattern `{tribe}-tribe/`

### "Failed to convert to TOON"
- Check that the markdown files are valid
- Ensure frontmatter is properly formatted
- Review error messages for specific encoding issues

### "Validation failed"
- The TOON encoding/decoding may have lost data
- Check the original markdown files for unusual characters
- Report the issue with the specific file that failed

## Development

To modify the script:

1. Edit `generate.js`
2. Test locally with sample data
3. Verify token savings are accurate
4. Ensure validation passes for all files

## Related Files

- `generate.js` - Main generation script
- `package.json` - Dependencies
- `index.json` - Generated metadata (output)
- `*.toon` - Generated TOON files (output)
