# .build Directory

This directory contains the build system for generating static JSON files from guideline markdown files.

## Purpose

The static generator converts markdown guidelines into optimized JSON files that can be served directly by the Cloudflare Worker, eliminating runtime conversion overhead and reducing token usage in AI API calls.

## Directory Structure

```
.build/
├── package.json           # Build dependencies (gray-matter, js-yaml)
├── generate-json.js       # Main generator script (to be implemented)
├── README.md             # This file
├── .gitignore            # Excludes node_modules, keeps generated files
├── composed/             # Generated composed guideline JSON files
│   ├── ruang-murid-murid.json
│   ├── ruang-murid-guru.json
│   └── ...
├── individual/           # Generated individual guideline JSON files
│   ├── reference-style-standards.json
│   ├── core-guidelines-01-general-foundation.json
│   └── ...
└── manifest.json         # Metadata about all generated files
```

## Installation

Install build dependencies:

```bash
cd .build
npm install
```

## Usage

### Generate All JSON Files

```bash
npm run generate
```

This will:
1. Read all markdown files from guideline directories
2. Strip frontmatter and optimize for token efficiency
3. Generate composed JSON files for all tribe/user combinations
4. Generate individual JSON files for each guideline
5. Create manifest.json with metadata

### Validate Only

```bash
npm run validate
```

Validates existing JSON files without regenerating them.

### Local Development

Run the generator directly with options:

```bash
node generate-json.js --verbose
node generate-json.js --output-dir ./test-output
node generate-json.js --validate-only
```

## Generated File Formats

### Composed Guidelines

Composed guidelines combine multiple markdown files into a single JSON file for a specific tribe/user context:

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-11-09T10:30:00Z",
  "commitHash": "abc123def456",
  "context": {
    "tribe": "ruang-murid",
    "user": "murid",
    "feature": null
  },
  "guidelines": {
    "reference": "...",
    "foundation": "...",
    "tribeExecution": "...",
    "examples": "..."
  },
  "metadata": {
    "files": ["Reference/style-standards.md", ...],
    "tokenCount": 12450,
    "originalTokenCount": 14650,
    "tokenSavings": 15.0
  }
}
```

### Individual Guidelines

Individual guidelines are single markdown files converted to JSON:

```json
{
  "id": "reference-style-standards",
  "name": "Style Standards",
  "version": "1.0.0",
  "generatedAt": "2025-11-09T10:30:00Z",
  "commitHash": "abc123def456",
  "content": "...",
  "metadata": {
    "sourceFile": "Reference/style-standards.md",
    "tokenCount": 850
  }
}
```

### Manifest

The manifest provides an index of all generated files:

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-11-09T10:30:00Z",
  "commitHash": "abc123def456",
  "repository": "afnizarnur/pensil-ajaib-data",
  "files": {
    "composed": [...],
    "individual": [...]
  },
  "statistics": {
    "totalFiles": 45,
    "totalTokens": 125000,
    "totalTokenSavings": 18500,
    "averageSavingsPercent": 14.8
  }
}
```

## Token Optimization

The generator applies several optimization techniques:

1. **Whitespace Removal**: Removes excessive whitespace while preserving readability
2. **Newline Consolidation**: Consolidates multiple newlines into single newlines
3. **Comment Removal**: Removes markdown comments
4. **Trailing Whitespace**: Removes trailing whitespace from lines

These optimizations typically reduce token usage by 15-20% while preserving semantic meaning.

## CI/CD Integration

This generator is automatically run by GitHub Actions whenever guideline files change. See `.github/workflows/generate-static-json.yml` for the workflow configuration.

The workflow:
1. Triggers on push to main branch
2. Runs `npm run generate`
3. Commits generated files back to the repository
4. Completes within 120 seconds

## Troubleshooting

### Build Fails with "Invalid Markdown"

Check the error log for the specific file and line number. The generator validates markdown syntax before conversion.

### Missing Generated Files

Ensure all source markdown files exist and are readable. Check the manifest.json for a list of processed files.

### Token Count Discrepancies

Token counts are estimates based on common tokenization patterns. Actual token usage may vary slightly depending on the AI model used.

## Development

When modifying the generator script:

1. Test locally with `npm run generate`
2. Verify output files in `composed/` and `individual/`
3. Check manifest.json for accuracy
4. Test with the Worker to ensure compatibility

## Related Documentation

- [Static Generation Design](../.kiro/specs/static-guideline-generation/design.md)
- [Requirements](../.kiro/specs/static-guideline-generation/requirements.md)
- [Implementation Tasks](../.kiro/specs/static-guideline-generation/tasks.md)
