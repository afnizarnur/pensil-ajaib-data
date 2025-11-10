#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base directories
const REPO_ROOT = path.resolve(__dirname, '..')
const BUILD_DIR = __dirname

// CLI options (will be set by parseArgs)
let CLI_OPTIONS = {
	outputDir: BUILD_DIR,
	verbose: false,
	validateOnly: false,
	help: false
}

// Computed directories based on output
let COMPOSED_DIR = path.join(BUILD_DIR, 'composed')
let INDIVIDUAL_DIR = path.join(BUILD_DIR, 'individual')

// Guideline source directories
const GUIDELINE_DIRS = [
	'Core Guidelines',
	'Reference',
	'Examples',
	'Feature Guidelines',
	'Prompts'
]

/**
 * Parse command-line arguments
 * @param {string[]} args - Command-line arguments (process.argv.slice(2))
 * @returns {Object} Parsed options
 */
function parseArgs(args) {
	const options = {
		outputDir: BUILD_DIR,
		verbose: false,
		validateOnly: false,
		help: false
	}
	
	for (let i = 0; i < args.length; i++) {
		const arg = args[i]
		
		switch (arg) {
			case '--help':
			case '-h':
				options.help = true
				break
			
			case '--output':
			case '-o':
				if (i + 1 < args.length) {
					options.outputDir = path.resolve(args[++i])
				} else {
					console.error('Error: --output requires a directory path')
					process.exit(1)
				}
				break
			
			case '--verbose':
			case '-v':
				options.verbose = true
				break
			
			case '--validate-only':
				options.validateOnly = true
				break
			
			default:
				if (arg.startsWith('-')) {
					console.error(`Error: Unknown option '${arg}'`)
					console.error('Use --help to see available options')
					process.exit(1)
				}
				break
		}
	}
	
	return options
}

/**
 * Display help text
 */
function displayHelp() {
	console.log(`
Usage: node generate-json.js [options]

Generate static JSON files from guideline markdown files.

Options:
  -h, --help              Display this help message
  -o, --output <dir>      Custom output directory (default: .build/)
  -v, --verbose           Enable detailed logging
  --validate-only         Validate existing files without regenerating

Examples:
  node generate-json.js
  node generate-json.js --output ./dist
  node generate-json.js --verbose
  node generate-json.js --validate-only

Description:
  This script processes markdown guideline files and generates optimized
  JSON files for composed and individual guidelines. It performs:
  
  - Frontmatter stripping
  - Token optimization
  - File validation
  - Manifest generation
  
  Generated files are placed in:
    <output>/composed/     - Composed guidelines for tribe/user combinations
    <output>/individual/   - Individual guideline files
    <output>/manifest.json - Metadata about all generated files
`)
}

/**
 * Update directory paths based on CLI options
 */
function updateDirectoryPaths() {
	COMPOSED_DIR = path.join(CLI_OPTIONS.outputDir, 'composed')
	INDIVIDUAL_DIR = path.join(CLI_OPTIONS.outputDir, 'individual')
}

/**
 * Log message if verbose mode is enabled
 * @param {...any} args - Arguments to log
 */
function verboseLog(...args) {
	if (CLI_OPTIONS.verbose) {
		console.log('  [VERBOSE]', ...args)
	}
}

/**
 * Recursively read all markdown files from a directory
 * @param {string} dirPath - Directory path to scan
 * @returns {Promise<string[]>} Array of absolute file paths
 */
async function readMarkdownFiles(dirPath) {
	const files = []
	
	try {
		const entries = await fs.readdir(dirPath, { withFileTypes: true })
		
		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry.name)
			
			if (entry.isDirectory()) {
				// Recursively read subdirectories
				const subFiles = await readMarkdownFiles(fullPath)
				files.push(...subFiles)
			} else if (entry.isFile() && entry.name.endsWith('.md')) {
				files.push(fullPath)
			}
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.warn(`Directory not found: ${dirPath}`)
		} else {
			throw error
		}
	}
	
	return files
}

/**
 * Get all markdown files from guideline directories
 * @returns {Promise<Map<string, string[]>>} Map of directory name to file paths
 */
async function getAllGuidelineFiles() {
	const filesByDir = new Map()
	
	for (const dir of GUIDELINE_DIRS) {
		const dirPath = path.join(REPO_ROOT, dir)
		const files = await readMarkdownFiles(dirPath)
		filesByDir.set(dir, files)
	}
	
	return filesByDir
}

/**
 * Ensure output directories exist
 * @returns {Promise<void>}
 */
async function ensureOutputDirectories() {
	try {
		await fs.mkdir(COMPOSED_DIR, { recursive: true })
		await fs.mkdir(INDIVIDUAL_DIR, { recursive: true })
		console.log('✓ Output directories ready')
		verboseLog(`Created directories: ${COMPOSED_DIR}, ${INDIVIDUAL_DIR}`)
	} catch (error) {
		console.error('Failed to create output directories:', error.message)
		throw error
	}
}

/**
 * Read file content with error handling
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} File content
 */
async function readFileContent(filePath) {
	try {
		return await fs.readFile(filePath, 'utf-8')
	} catch (error) {
		console.error(`Failed to read file ${filePath}:`, error.message)
		throw error
	}
}

/**
 * Write JSON file with error handling
 * @param {string} filePath - Path to output file
 * @param {Object} data - Data to write
 * @returns {Promise<void>}
 */
async function writeJSONFile(filePath, data) {
	try {
		const jsonContent = JSON.stringify(data, null, 2)
		await fs.writeFile(filePath, jsonContent, 'utf-8')
	} catch (error) {
		console.error(`Failed to write file ${filePath}:`, error.message)
		throw error
	}
}

/**
 * Get relative path from repo root
 * @param {string} absolutePath - Absolute file path
 * @returns {string} Relative path
 */
function getRelativePath(absolutePath) {
	return path.relative(REPO_ROOT, absolutePath)
}

/**
 * Validate that a JSON file is valid and well-formed
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object>} Validation result
 */
async function validateJSONFile(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf-8')
		const parsed = JSON.parse(content)
		
		return {
			valid: true,
			path: filePath,
			size: content.length,
			data: parsed
		}
	} catch (error) {
		return {
			valid: false,
			path: filePath,
			error: error.message
		}
	}
}

/**
 * Validate a composed guideline JSON structure
 * @param {Object} data - Parsed JSON data
 * @param {string} filePath - File path for error reporting
 * @returns {Object} Validation result
 */
function validateComposedGuideline(data, filePath) {
	const errors = []
	const warnings = []
	
	// Check required fields
	if (!data.version) errors.push('Missing version field')
	if (!data.generatedAt) errors.push('Missing generatedAt field')
	if (!data.commitHash) warnings.push('Missing commitHash field')
	if (!data.context) errors.push('Missing context field')
	if (!data.guidelines) errors.push('Missing guidelines field')
	if (!data.metadata) errors.push('Missing metadata field')
	
	// Check context structure
	if (data.context) {
		if (!data.context.tribe) errors.push('Missing context.tribe')
		if (!data.context.user) errors.push('Missing context.user')
	}
	
	// Check guidelines structure
	if (data.guidelines) {
		if (!data.guidelines.reference) errors.push('Missing guidelines.reference')
		if (!data.guidelines.foundation) errors.push('Missing guidelines.foundation')
		if (!data.guidelines.tribeExecution) errors.push('Missing guidelines.tribeExecution')
		if (!data.guidelines.examples) errors.push('Missing guidelines.examples')
	}
	
	// Check metadata structure
	if (data.metadata) {
		if (!Array.isArray(data.metadata.files)) errors.push('metadata.files must be an array')
		if (typeof data.metadata.tokenCount !== 'number') errors.push('metadata.tokenCount must be a number')
		if (typeof data.metadata.originalTokenCount !== 'number') warnings.push('metadata.originalTokenCount should be a number')
		if (typeof data.metadata.tokenSavings !== 'number') warnings.push('metadata.tokenSavings should be a number')
	}
	
	return {
		valid: errors.length === 0,
		errors,
		warnings,
		path: filePath
	}
}

/**
 * Validate an individual guideline JSON structure
 * @param {Object} data - Parsed JSON data
 * @param {string} filePath - File path for error reporting
 * @returns {Object} Validation result
 */
function validateIndividualGuideline(data, filePath) {
	const errors = []
	const warnings = []
	
	// Check required fields
	if (!data.id) errors.push('Missing id field')
	if (!data.name) errors.push('Missing name field')
	if (!data.version) errors.push('Missing version field')
	if (!data.generatedAt) errors.push('Missing generatedAt field')
	if (!data.commitHash) warnings.push('Missing commitHash field')
	if (!data.content) errors.push('Missing content field')
	if (!data.metadata) errors.push('Missing metadata field')
	
	// Check metadata structure
	if (data.metadata) {
		if (!data.metadata.sourceFile) errors.push('Missing metadata.sourceFile')
		if (typeof data.metadata.tokenCount !== 'number') errors.push('metadata.tokenCount must be a number')
	}
	
	// Check token count is reasonable (not negative or zero)
	if (data.metadata?.tokenCount <= 0) {
		warnings.push('Token count is zero or negative')
	}
	
	return {
		valid: errors.length === 0,
		errors,
		warnings,
		path: filePath
	}
}

/**
 * Validate all generated files
 * @param {Array} composedFiles - Array of composed file metadata
 * @param {Array} featureFiles - Array of feature-specific file metadata
 * @param {Array} individualFiles - Array of individual file metadata
 * @returns {Promise<Object>} Validation summary
 */
async function validateGeneratedFiles(composedFiles, featureFiles, individualFiles) {
	console.log('🔍 Validating generated files...')
	
	const results = {
		valid: [],
		invalid: [],
		warnings: []
	}
	
	// Validate composed files
	const allComposedFiles = [...composedFiles, ...featureFiles]
	for (const fileInfo of allComposedFiles) {
		const filePath = path.join(CLI_OPTIONS.outputDir, fileInfo.path)
		const validation = await validateJSONFile(filePath)
		
		if (!validation.valid) {
			results.invalid.push({
				path: fileInfo.path,
				error: validation.error
			})
			continue
		}
		
		// Validate structure
		const structureValidation = validateComposedGuideline(validation.data, fileInfo.path)
		
		if (!structureValidation.valid) {
			results.invalid.push({
				path: fileInfo.path,
				errors: structureValidation.errors
			})
		} else {
			results.valid.push(fileInfo.path)
			
			if (structureValidation.warnings.length > 0) {
				results.warnings.push({
					path: fileInfo.path,
					warnings: structureValidation.warnings
				})
			}
		}
	}
	
	// Validate individual files
	for (const fileInfo of individualFiles) {
		const filePath = path.join(BUILD_DIR, fileInfo.path)
		const validation = await validateJSONFile(filePath)
		
		if (!validation.valid) {
			results.invalid.push({
				path: fileInfo.path,
				error: validation.error
			})
			continue
		}
		
		// Validate structure
		const structureValidation = validateIndividualGuideline(validation.data, fileInfo.path)
		
		if (!structureValidation.valid) {
			results.invalid.push({
				path: fileInfo.path,
				errors: structureValidation.errors
			})
		} else {
			results.valid.push(fileInfo.path)
			
			if (structureValidation.warnings.length > 0) {
				results.warnings.push({
					path: fileInfo.path,
					warnings: structureValidation.warnings
				})
			}
		}
	}
	
	// Report results
	console.log(`  ✓ Valid files: ${results.valid.length}`)
	
	if (results.warnings.length > 0) {
		console.log(`  ⚠️  Files with warnings: ${results.warnings.length}`)
		for (const warning of results.warnings) {
			console.log(`    - ${warning.path}:`)
			for (const msg of warning.warnings) {
				console.log(`      • ${msg}`)
			}
		}
	}
	
	if (results.invalid.length > 0) {
		console.log(`  ❌ Invalid files: ${results.invalid.length}`)
		for (const invalid of results.invalid) {
			console.log(`    - ${invalid.path}:`)
			if (invalid.error) {
				console.log(`      • ${invalid.error}`)
			}
			if (invalid.errors) {
				for (const error of invalid.errors) {
					console.log(`      • ${error}`)
				}
			}
		}
	}
	
	console.log()
	
	return results
}

/**
 * Generate manifest.json with metadata about all generated files
 * @param {Array} composedFiles - Array of composed file metadata
 * @param {Array} featureFiles - Array of feature-specific file metadata
 * @param {Array} individualFiles - Array of individual file metadata
 * @returns {Promise<Object>} Manifest data
 */
async function generateManifest(composedFiles, featureFiles, individualFiles) {
	console.log('📋 Generating manifest.json...')
	
	// Get Git metadata
	const gitMetadata = getGitMetadata()
	
	// Combine composed and feature files
	const allComposedFiles = [...composedFiles, ...featureFiles]
	
	// Calculate aggregate statistics
	const totalComposedTokens = allComposedFiles.reduce((sum, f) => sum + f.tokenCount, 0)
	const totalIndividualTokens = individualFiles.reduce((sum, f) => sum + f.tokenCount, 0)
	const totalTokens = totalComposedTokens + totalIndividualTokens
	
	// Calculate total token savings from individual files
	const totalOriginalTokens = individualFiles.reduce((sum, f) => {
		// Read the actual file to get original token count
		return sum + f.tokenCount // We'll use optimized count as baseline
	}, 0)
	
	// For more accurate savings, we need to track original tokens
	// For now, estimate based on typical 15% savings
	const estimatedOriginalTokens = Math.ceil(totalTokens / 0.85)
	const totalTokenSavings = estimatedOriginalTokens - totalTokens
	const averageSavingsPercent = totalTokens > 0 
		? ((totalTokenSavings / estimatedOriginalTokens) * 100)
		: 0
	
	// Build manifest object
	const manifest = {
		version: '1.0.0',
		generatedAt: gitMetadata.commitTimestamp || new Date().toISOString(),
		commitHash: gitMetadata.commitHash || 'unknown',
		repository: 'afnizarnur/pensil-ajaib-data',
		files: {
			composed: allComposedFiles.map(f => ({
				path: f.path,
				tribe: f.tribe,
				user: f.user,
				...(f.feature && { feature: f.feature }),
				tokenCount: f.tokenCount
			})),
			individual: individualFiles.map(f => ({
				path: f.path,
				id: f.id,
				name: f.name,
				sourceFile: f.sourceFile,
				tokenCount: f.tokenCount
			}))
		},
		statistics: {
			totalFiles: allComposedFiles.length + individualFiles.length,
			totalComposedFiles: allComposedFiles.length,
			totalIndividualFiles: individualFiles.length,
			totalTokens,
			totalTokenSavings,
			averageSavingsPercent: Number.parseFloat(averageSavingsPercent.toFixed(2))
		}
	}
	
	// Write manifest file
	const manifestPath = path.join(CLI_OPTIONS.outputDir, 'manifest.json')
	await writeJSONFile(manifestPath, manifest)
	verboseLog('Manifest written to:', manifestPath)
	
	console.log('  ✓ Manifest generated')
	console.log(`  ✓ Total files: ${manifest.statistics.totalFiles}`)
	console.log(`  ✓ Total tokens: ${totalTokens.toLocaleString()}`)
	console.log(`  ✓ Estimated savings: ${averageSavingsPercent.toFixed(2)}%\n`)
	
	return manifest
}

/**
 * Main entry point
 */
async function main() {
	// Parse command-line arguments
	CLI_OPTIONS = parseArgs(process.argv.slice(2))
	
	// Display help if requested
	if (CLI_OPTIONS.help) {
		displayHelp()
		process.exit(0)
	}
	
	// Update directory paths based on output option
	updateDirectoryPaths()
	
	// Display configuration
	console.log('🚀 Starting static JSON generation...\n')
	
	if (CLI_OPTIONS.verbose) {
		console.log('Configuration:')
		console.log(`  Output directory: ${CLI_OPTIONS.outputDir}`)
		console.log(`  Verbose mode: ${CLI_OPTIONS.verbose}`)
		console.log(`  Validate only: ${CLI_OPTIONS.validateOnly}`)
		console.log()
	}
	
	try {
		let composedFiles = []
		let featureFiles = []
		let individualFiles = []
		let totalFiles = 0
		
		if (CLI_OPTIONS.validateOnly) {
			// Validate-only mode: load existing files
			console.log('🔍 Validation-only mode: checking existing files...\n')
			
			// Load manifest to get file list
			const manifestPath = path.join(CLI_OPTIONS.outputDir, 'manifest.json')
			try {
				const manifestContent = await fs.readFile(manifestPath, 'utf-8')
				const manifest = JSON.parse(manifestContent)
				
				composedFiles = manifest.files.composed.filter(f => !f.feature)
				featureFiles = manifest.files.composed.filter(f => f.feature)
				individualFiles = manifest.files.individual
				
				verboseLog(`Loaded manifest with ${composedFiles.length + featureFiles.length + individualFiles.length} files`)
			} catch (error) {
				console.error('❌ Failed to load manifest.json')
				console.error('   Run without --validate-only to generate files first')
				process.exit(1)
			}
		} else {
			// Normal generation mode
			// Ensure output directories exist
			await ensureOutputDirectories()
			
			// Get all guideline files
			console.log('📂 Scanning guideline directories...')
			const filesByDir = await getAllGuidelineFiles()
			
			for (const [dir, files] of filesByDir) {
				console.log(`  ${dir}: ${files.length} files`)
				verboseLog(`Files in ${dir}:`, files.map(f => path.basename(f)).join(', '))
				totalFiles += files.length
			}
			console.log(`\n✓ Found ${totalFiles} markdown files\n`)
			
			// Generate all composed guidelines (base combinations)
			composedFiles = await generateAllComposedGuidelines()
			
			// Generate feature-specific composed guidelines
			featureFiles = await generateFeatureComposedGuidelines()
			
			// Generate individual guideline files
			individualFiles = await generateAllIndividualGuidelines()
			
			// Generate manifest
			const manifest = await generateManifest(composedFiles, featureFiles, individualFiles)
			
			verboseLog('Manifest generated:', JSON.stringify(manifest.statistics, null, 2))
		}
		
		// Validate generated files
		const validationResults = await validateGeneratedFiles(composedFiles, featureFiles, individualFiles)
		
		// Check if validation failed
		if (validationResults.invalid.length > 0) {
			console.error(`\n❌ Validation failed: ${validationResults.invalid.length} invalid files`)
			process.exit(1)
		}
		
		// Summary
		if (!CLI_OPTIONS.validateOnly) {
			console.log('📊 Generation Summary:')
			console.log(`  - Total source files: ${totalFiles}`)
			console.log(`  - Base composed guidelines: ${composedFiles.length}`)
			console.log(`  - Feature-specific guidelines: ${featureFiles.length}`)
			console.log(`  - Individual guidelines: ${individualFiles.length}`)
			console.log(`  - Total generated files: ${composedFiles.length + featureFiles.length + individualFiles.length}`)
			
			// Calculate total tokens from files
			const totalTokens = [...composedFiles, ...featureFiles, ...individualFiles]
				.reduce((sum, f) => sum + (f.tokenCount || 0), 0)
			console.log(`  - Total tokens: ${totalTokens.toLocaleString()}`)
			
			console.log('\n✅ Static JSON generation complete!\n')
		} else {
			console.log('\n✅ Validation complete!\n')
		}
		
		process.exit(0)
		
	} catch (error) {
		console.error('\n❌ Generation failed:', error.message)
		if (CLI_OPTIONS.verbose) {
			console.error(error.stack)
		}
		process.exit(1)
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main()
}

export {
	readMarkdownFiles,
	getAllGuidelineFiles,
	ensureOutputDirectories,
	readFileContent,
	writeJSONFile,
	getRelativePath,
	parseArgs,
	displayHelp,
	updateDirectoryPaths,
	verboseLog,
	REPO_ROOT,
	BUILD_DIR,
	COMPOSED_DIR,
	INDIVIDUAL_DIR,
	GUIDELINE_DIRS
}

// Import gray-matter for frontmatter parsing
import matter from 'gray-matter'

/**
 * Parse and strip YAML frontmatter from markdown content
 * @param {string} content - Raw markdown content
 * @returns {Object} Parsed result with metadata and content
 * @returns {Object} result.data - Frontmatter metadata (name, description, etc.)
 * @returns {string} result.content - Markdown content without frontmatter
 * @returns {boolean} result.hasFrontmatter - Whether frontmatter was present
 */
function parseFrontmatter(content) {
	try {
		const parsed = matter(content)
		
		return {
			data: parsed.data || {},
			content: parsed.content,
			hasFrontmatter: Object.keys(parsed.data).length > 0
		}
	} catch (error) {
		console.warn('Failed to parse frontmatter:', error.message)
		// Return original content if parsing fails
		return {
			data: {},
			content: content,
			hasFrontmatter: false
		}
	}
}

/**
 * Extract metadata from frontmatter
 * @param {Object} frontmatterData - Parsed frontmatter data
 * @param {string} filePath - Source file path for fallback
 * @returns {Object} Extracted metadata
 */
function extractMetadata(frontmatterData, filePath) {
	const fileName = path.basename(filePath, '.md')
	
	return {
		name: frontmatterData.name || fileName,
		description: frontmatterData.description || '',
		id: frontmatterData.id || fileName.toLowerCase().replace(/\s+/g, '-')
	}
}

/**
 * Process a single markdown file
 * @param {string} filePath - Path to markdown file
 * @returns {Promise<Object>} Processed file data
 */
async function processMarkdownFile(filePath) {
	const content = await readFileContent(filePath)
	const relativePath = getRelativePath(filePath)
	
	// Parse frontmatter
	const { data, content: strippedContent, hasFrontmatter } = parseFrontmatter(content)
	
	// Extract metadata
	const metadata = extractMetadata(data, filePath)
	
	return {
		filePath: relativePath,
		metadata,
		content: strippedContent,
		hasFrontmatter,
		originalSize: content.length,
		strippedSize: strippedContent.length
	}
}

export {
	parseFrontmatter,
	extractMetadata,
	processMarkdownFile
}

/**
 * Optimize content for token efficiency
 * @param {string} content - Markdown content to optimize
 * @returns {Object} Optimization result
 * @returns {string} result.optimized - Optimized content
 * @returns {number} result.originalTokens - Estimated original token count
 * @returns {number} result.optimizedTokens - Estimated optimized token count
 * @returns {number} result.savings - Token savings percentage
 */
function optimizeTokens(content) {
	const original = content
	let optimized = content

	// Remove markdown comments (<--prod comment -->)
	optimized = optimized.replace(/<--prod[\s\S]*?-->/g, '')

	// Remove excessive whitespace while preserving readability
	// Replace multiple spaces with single space (but preserve indentation)
	optimized = optimized.replace(/[^\S\n]+/g, ' ')

	// Consolidate multiple newlines into maximum of 2 newlines
	// This preserves paragraph breaks but removes excessive spacing
	optimized = optimized.replace(/\n{3,}/g, '\n\n')

	// Remove trailing whitespace from each line
	optimized = optimized.split('\n')
		.map(line => line.trimEnd())
		.join('\n')

	// Remove leading/trailing whitespace from entire content
	optimized = optimized.trim()

	// Estimate token counts (rough approximation: 1 token ≈ 4 characters)
	const originalTokens = Math.ceil(original.length / 4)
	const optimizedTokens = Math.ceil(optimized.length / 4)
	const savings = originalTokens > 0 
		? ((originalTokens - optimizedTokens) / originalTokens) * 100 
		: 0

	return {
		optimized,
		originalTokens,
		optimizedTokens,
		savings: Number.parseFloat(savings.toFixed(2))
	}
}

/**
 * Calculate more accurate token count using word-based estimation
 * This provides a better approximation than character-based counting
 * @param {string} content - Content to count tokens for
 * @returns {number} Estimated token count
 */
function estimateTokenCount(content) {
	// More accurate estimation:
	// - Split by whitespace to get words
	// - Average English word is ~1.3 tokens
	// - Add tokens for punctuation and special characters
	const words = content.trim().split(/\s+/).length
	const specialChars = (content.match(/[^\w\s]/g) || []).length
	
	return Math.ceil(words * 1.3 + specialChars * 0.3)
}

export {
	optimizeTokens,
	estimateTokenCount
}

import { execSync } from 'node:child_process'

/**
 * Get current Git commit hash
 * @returns {string|null} Commit hash or null if not available
 */
function getCommitHash() {
	try {
		const hash = execSync('git rev-parse HEAD', {
cwd: REPO_ROOT,
encoding: 'utf-8',
stdio: ['pipe', 'pipe', 'pipe']
}).trim()
		return hash
	} catch (error) {
		console.warn('⚠️  Could not get Git commit hash:', error.message)
		return null
	}
}

/**
 * Get current Git commit timestamp
 * @returns {string|null} ISO 8601 timestamp or null if not available
 */
function getCommitTimestamp() {
	try {
		const timestamp = execSync('git log -1 --format=%cI', {
cwd: REPO_ROOT,
encoding: 'utf-8',
stdio: ['pipe', 'pipe', 'pipe']
}).trim()
		return timestamp
	} catch (error) {
		console.warn('⚠️  Could not get Git commit timestamp:', error.message)
		return null
	}
}

/**
 * Check if Git is available and repository is initialized
 * @returns {boolean} True if Git is available
 */
function isGitAvailable() {
	try {
		execSync('git rev-parse --git-dir', {
cwd: REPO_ROOT,
encoding: 'utf-8',
stdio: ['pipe', 'pipe', 'pipe']
})
		return true
	} catch (error) {
		return false
	}
}

/**
 * Get Git metadata for the current repository
 * @returns {Object} Git metadata
 * @returns {string|null} result.commitHash - Current commit hash
 * @returns {string|null} result.commitTimestamp - Current commit timestamp
 * @returns {boolean} result.isGitRepo - Whether this is a Git repository
 */
function getGitMetadata() {
	const isGitRepo = isGitAvailable()

	if (!isGitRepo) {
		console.warn('⚠️  Not a Git repository or Git is not available')
		return {
			commitHash: null,
			commitTimestamp: null,
			isGitRepo: false
		}
	}

	return {
		commitHash: getCommitHash(),
		commitTimestamp: getCommitTimestamp(),
		isGitRepo: true
	}
}

export {
	getCommitHash,
	getCommitTimestamp,
	isGitAvailable,
	getGitMetadata
}

/**
 * Define tribe and user combinations
 * Based on the directory structure in Core Guidelines/
 */
const TRIBE_USER_COMBINATIONS = [
	{ tribe: 'ruang-murid', user: 'murid' },
	{ tribe: 'ruang-murid', user: 'guru' },
	{ tribe: 'ruang-murid', user: 'mitra' },
	{ tribe: 'ruang-murid', user: 'unit-kerja' }
]

/**
 * Map tribe/user combination to required guideline files
 * @param {string} tribe - Tribe identifier
 * @param {string} user - User type
 * @param {string|null} feature - Optional feature identifier
 * @returns {Object} File paths for each layer
 */
function mapGuidelineFiles(tribe, user, feature = null) {
	const tribeDir = `Core Guidelines/${tribe}-tribe`
	
	return {
		// Reference layer - always included
		reference: [
			'Reference/style-standards.md',
			`${tribeDir}/glossary.md`,
			'Reference/ui-component-specs.md',
			'Reference/error-templates.md'
		],
		// Foundation layer - general + tribe-specific
		foundation: [
			'Core Guidelines/general-foundation.md',
			`${tribeDir}/tribe.md`
		],
		// Tribe execution - user-specific rules
		tribeExecution: [
			`${tribeDir}/user/${user}.md`
		],
		// Examples layer - always included
		examples: [
			'Examples/component-copy-samples.md',
			'Examples/dialog-examples.md',
			'Examples/onboarding-samples.md',
			'Examples/toast-message-library.md'
		],
		// Feature guidelines - optional
		features: feature ? [`Feature Guidelines/${feature}.md`] : []
	}
}

/**
 * Read and process multiple guideline files
 * @param {string[]} filePaths - Array of relative file paths
 * @returns {Promise<Object>} Combined content and metadata
 */
async function readAndCombineFiles(filePaths) {
	const processedFiles = []
	const contents = []
	let totalOriginalTokens = 0
	let totalOptimizedTokens = 0
	
	for (const filePath of filePaths) {
		const absolutePath = path.join(REPO_ROOT, filePath)
		
		try {
			// Check if file exists
			await fs.access(absolutePath)
			
			// Process the file
			const processed = await processMarkdownFile(absolutePath)
			
			// Optimize tokens
			const optimized = optimizeTokens(processed.content)
			
			// Track metadata
			processedFiles.push(filePath)
			contents.push(optimized.optimized)
			totalOriginalTokens += optimized.originalTokens
			totalOptimizedTokens += optimized.optimizedTokens
			
		} catch (error) {
			if (error.code === 'ENOENT') {
				console.warn(`⚠️  File not found: ${filePath}`)
			} else {
				console.error(`❌ Error processing ${filePath}:`, error.message)
				throw error
			}
		}
	}
	
	return {
		content: contents.join('\n\n'),
		files: processedFiles,
		originalTokens: totalOriginalTokens,
		optimizedTokens: totalOptimizedTokens
	}
}

/**
 * Compose guidelines for a specific tribe/user/feature combination
 * @param {string} tribe - Tribe identifier
 * @param {string} user - User type
 * @param {string|null} feature - Optional feature identifier
 * @returns {Promise<Object>} Composed guideline data
 */
async function composeGuidelines(tribe, user, feature = null) {
	console.log(`📝 Composing guidelines for ${tribe}/${user}${feature ? `/${feature}` : ''}...`)
	
	// Get file mappings
	const fileMap = mapGuidelineFiles(tribe, user, feature)
	
	// Process each layer
	const reference = await readAndCombineFiles(fileMap.reference)
	const foundation = await readAndCombineFiles(fileMap.foundation)
	const tribeExecution = await readAndCombineFiles(fileMap.tribeExecution)
	const examples = await readAndCombineFiles(fileMap.examples)
	const features = feature ? await readAndCombineFiles(fileMap.features) : null
	
	// Calculate totals
	const totalOriginalTokens = 
		reference.originalTokens + 
		foundation.originalTokens + 
		tribeExecution.originalTokens + 
		examples.originalTokens +
		(features?.originalTokens || 0)
	
	const totalOptimizedTokens = 
		reference.optimizedTokens + 
		foundation.optimizedTokens + 
		tribeExecution.optimizedTokens + 
		examples.optimizedTokens +
		(features?.optimizedTokens || 0)
	
	const tokenSavings = totalOriginalTokens > 0
		? ((totalOriginalTokens - totalOptimizedTokens) / totalOriginalTokens) * 100
		: 0
	
	// Get Git metadata
	const gitMetadata = getGitMetadata()
	
	// Build composed guideline object
	const composed = {
		version: '1.0.0',
		generatedAt: gitMetadata.commitTimestamp || new Date().toISOString(),
		commitHash: gitMetadata.commitHash || 'unknown',
		context: {
			tribe,
			user,
			...(feature && { feature })
		},
		guidelines: {
			reference: reference.content,
			foundation: foundation.content,
			tribeExecution: tribeExecution.content,
			examples: examples.content,
			...(features && { features: features.content })
		},
		metadata: {
			files: [
				...reference.files,
				...foundation.files,
				...tribeExecution.files,
				...examples.files,
				...(features?.files || [])
			],
			tokenCount: totalOptimizedTokens,
			originalTokenCount: totalOriginalTokens,
			tokenSavings: Number.parseFloat(tokenSavings.toFixed(2))
		}
	}
	
	console.log(`  ✓ Processed ${composed.metadata.files.length} files`)
	console.log(`  ✓ Token savings: ${tokenSavings.toFixed(2)}%`)
	
	return composed
}

export {
	TRIBE_USER_COMBINATIONS,
	mapGuidelineFiles,
	readAndCombineFiles,
	composeGuidelines
}

/**
 * Generate composed JSON files for all tribe/user combinations
 * @returns {Promise<Array>} Array of generated file metadata
 */
async function generateAllComposedGuidelines() {
	console.log('📝 Generating composed guidelines for all combinations...\n')
	
	const generatedFiles = []
	
	for (const { tribe, user } of TRIBE_USER_COMBINATIONS) {
		try {
			// Compose guidelines
			const composed = await composeGuidelines(tribe, user)
			
			// Generate filename
			const fileName = `${tribe}-${user}.json`
			const filePath = path.join(COMPOSED_DIR, fileName)
			
			// Write JSON file
			await writeJSONFile(filePath, composed)
			
			// Track generated file
			generatedFiles.push({
				path: `composed/${fileName}`,
				tribe,
				user,
				tokenCount: composed.metadata.tokenCount,
				files: composed.metadata.files.length
			})
			
			console.log(`  ✓ Generated ${fileName}`)
			
		} catch (error) {
			console.error(`  ❌ Failed to generate ${tribe}/${user}:`, error.message)
			// Continue with other combinations
		}
	}
	
	console.log(`\n✓ Generated ${generatedFiles.length} composed guideline files\n`)
	
	return generatedFiles
}

export {
	generateAllComposedGuidelines
}

/**
 * Get all feature guideline files
 * @returns {Promise<Array>} Array of feature identifiers
 */
async function getFeatureGuidelines() {
	const featureDir = path.join(REPO_ROOT, 'Feature Guidelines')
	const features = []
	
	try {
		const files = await readMarkdownFiles(featureDir)
		
		for (const filePath of files) {
			const fileName = path.basename(filePath, '.md')
			features.push(fileName)
		}
	} catch (error) {
		console.warn('⚠️  No feature guidelines found')
	}
	
	return features
}

/**
 * Generate feature-specific composed guidelines for all tribe/user combinations
 * @returns {Promise<Array>} Array of generated file metadata
 */
async function generateFeatureComposedGuidelines() {
	console.log('📝 Generating feature-specific composed guidelines...\n')
	
	const features = await getFeatureGuidelines()
	
	if (features.length === 0) {
		console.log('  ℹ️  No feature guidelines found, skipping...\n')
		return []
	}
	
	console.log(`  Found ${features.length} feature(s): ${features.join(', ')}\n`)
	
	const generatedFiles = []
	
	for (const feature of features) {
		for (const { tribe, user } of TRIBE_USER_COMBINATIONS) {
			try {
				// Compose guidelines with feature
				const composed = await composeGuidelines(tribe, user, feature)
				
				// Generate filename
				const fileName = `${tribe}-${user}-${feature}.json`
				const filePath = path.join(COMPOSED_DIR, fileName)
				
				// Write JSON file
				await writeJSONFile(filePath, composed)
				
				// Track generated file
				generatedFiles.push({
					path: `composed/${fileName}`,
					tribe,
					user,
					feature,
					tokenCount: composed.metadata.tokenCount,
					files: composed.metadata.files.length
				})
				
				console.log(`  ✓ Generated ${fileName}`)
				
			} catch (error) {
				console.error(`  ❌ Failed to generate ${tribe}/${user}/${feature}:`, error.message)
				// Continue with other combinations
			}
		}
	}
	
	console.log(`\n✓ Generated ${generatedFiles.length} feature-specific guideline files\n`)
	
	return generatedFiles
}

export {
	getFeatureGuidelines,
	generateFeatureComposedGuidelines
}

/**
 * Generate a consistent ID from a file path
 * @param {string} filePath - Relative file path from repo root
 * @returns {string} Guideline ID (e.g., "reference-style-standards")
 */
function generateGuidelineId(filePath) {
	// Remove .md extension
	const withoutExt = filePath.replace(/\.md$/, '')
	
	// Replace path separators and spaces with hyphens
	// Convert to lowercase
	const id = withoutExt
		.replace(/[\/\\]/g, '-')
		.replace(/\s+/g, '-')
		.toLowerCase()
	
	return id
}

/**
 * Process a single guideline file and generate individual JSON
 * @param {string} filePath - Absolute path to markdown file
 * @returns {Promise<Object>} Individual guideline data
 */
async function processIndividualGuideline(filePath) {
	const relativePath = getRelativePath(filePath)
	
	// Process markdown file (strips frontmatter)
	const processed = await processMarkdownFile(filePath)
	
	// Optimize tokens
	const optimized = optimizeTokens(processed.content)
	
	// Generate guideline ID
	const id = generateGuidelineId(relativePath)
	
	// Get Git metadata
	const gitMetadata = getGitMetadata()
	
	// Build individual guideline object
	const individual = {
		id,
		name: processed.metadata.name,
		version: '1.0.0',
		generatedAt: gitMetadata.commitTimestamp || new Date().toISOString(),
		commitHash: gitMetadata.commitHash || 'unknown',
		content: optimized.optimized,
		metadata: {
			sourceFile: relativePath,
			tokenCount: optimized.optimizedTokens,
			originalTokenCount: optimized.originalTokens,
			tokenSavings: optimized.savings
		}
	}
	
	return individual
}

/**
 * Generate individual JSON files for all guideline files
 * @returns {Promise<Array>} Array of generated file metadata
 */
async function generateAllIndividualGuidelines() {
	console.log('📝 Generating individual guideline files...\n')
	
	// Get all guideline files
	const filesByDir = await getAllGuidelineFiles()
	
	const generatedFiles = []
	let processedCount = 0
	let errorCount = 0
	
	// Process each directory
	for (const [dirName, files] of filesByDir) {
		console.log(`  Processing ${dirName}...`)
		
		for (const filePath of files) {
			try {
				// Process individual guideline
				const individual = await processIndividualGuideline(filePath)
				
				// Generate filename from ID
				const fileName = `${individual.id}.json`
				const outputPath = path.join(INDIVIDUAL_DIR, fileName)
				
				// Write JSON file
				await writeJSONFile(outputPath, individual)
				
				// Track generated file
				generatedFiles.push({
					path: `individual/${fileName}`,
					id: individual.id,
					name: individual.name,
					sourceFile: individual.metadata.sourceFile,
					tokenCount: individual.metadata.tokenCount
				})
				
				processedCount++
				
			} catch (error) {
				console.error(`    ❌ Failed to process ${getRelativePath(filePath)}:`, error.message)
				errorCount++
				// Continue with other files
			}
		}
		
		console.log(`    ✓ Processed ${files.length} files from ${dirName}`)
	}
	
	console.log(`\n✓ Generated ${generatedFiles.length} individual guideline files`)
	if (errorCount > 0) {
		console.log(`  ⚠️  ${errorCount} files failed to process`)
	}
	console.log()
	
	return generatedFiles
}

export {
	generateGuidelineId,
	processIndividualGuideline,
	generateAllIndividualGuidelines,
	validateJSONFile,
	validateComposedGuideline,
	validateIndividualGuideline,
	validateGeneratedFiles,
	generateManifest
}
