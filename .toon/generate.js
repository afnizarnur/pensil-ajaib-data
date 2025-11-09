#!/usr/bin/env node

/**
 * TOON Generation Script
 * Generates TOON format files from markdown guidelines
 * 
 * This script is designed to be run in the pensil-ajaib-data repository
 * Usage: node generate-toon.js [--source-dir <path>] [--output-dir <path>]
 */

import { readFile, readdir, writeFile, mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { encode, decode } from '@toon-format/toon'
import { encode as encodeTokens } from 'gpt-tokenizer'

/**
 * Parse command line arguments
 */
function parseArgs() {
	const args = process.argv.slice(2)
	const options = {
		sourceDir: '../',  // Default: parent directory (repo root)
		outputDir: './',   // Default: current directory (.toon/)
		verbose: true
	}

	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--source-dir' && args[i + 1]) {
			options.sourceDir = args[i + 1]
			i++
		} else if (args[i] === '--output-dir' && args[i + 1]) {
			options.outputDir = args[i + 1]
			i++
		} else if (args[i] === '--quiet') {
			options.verbose = false
		}
	}

	return options
}

/**
 * Strip frontmatter from markdown content
 * @param {string} content - Markdown content with potential frontmatter
 * @returns {string} Content without frontmatter
 */
function stripFrontmatter(content) {
	const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
	return content.replace(frontmatterRegex, '').trim()
}

/**
 * Read a markdown file from the repository
 * @param {string} sourceDir - Repository root directory
 * @param {string} relativePath - Relative path to the markdown file
 * @returns {Promise<string|null>} File content or null if not found
 */
async function readMarkdownFile(sourceDir, relativePath) {
	try {
		const fullPath = join(sourceDir, relativePath)
		const content = await readFile(fullPath, 'utf-8')
		return stripFrontmatter(content)
	} catch (error) {
		if (error.code === 'ENOENT') {
			return null
		}
		throw error
	}
}

/**
 * Get all tribe directories from Core Guidelines
 * @param {string} sourceDir - Repository root directory
 * @returns {Promise<string[]>} Array of tribe IDs
 */
async function getTribes(sourceDir) {
	try {
		const coreGuidelinesPath = join(sourceDir, 'Core Guidelines')
		const entries = await readdir(coreGuidelinesPath, { withFileTypes: true })
		
		return entries
			.filter(entry => entry.isDirectory() && entry.name.includes('tribe'))
			.map(entry => entry.name.replace('-tribe', ''))
	} catch (error) {
		console.error('Error reading tribes:', error.message)
		return []
	}
}

/**
 * Get all users for a specific tribe
 * @param {string} sourceDir - Repository root directory
 * @param {string} tribeId - Tribe identifier
 * @returns {Promise<string[]>} Array of user IDs
 */
async function getTribeUsers(sourceDir, tribeId) {
	try {
		const userPath = join(sourceDir, 'Core Guidelines', `${tribeId}-tribe`, 'user')
		const entries = await readdir(userPath, { withFileTypes: true })
		
		return entries
			.filter(entry => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
			.map(entry => entry.name.replace('.md', ''))
	} catch (error) {
		console.error(`Error reading users for tribe ${tribeId}:`, error.message)
		return []
	}
}

/**
 * Get all feature guideline files
 * @param {string} sourceDir - Repository root directory
 * @returns {Promise<string[]>} Array of feature IDs
 */
async function getFeatures(sourceDir) {
	try {
		const featuresPath = join(sourceDir, 'Feature Guidelines')
		const entries = await readdir(featuresPath, { withFileTypes: true })
		
		return entries
			.filter(entry => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
			.map(entry => entry.name.replace('.md', ''))
	} catch (error) {
		console.error('Error reading features:', error.message)
		return []
	}
}

/**
 * Compose guidelines for a specific context
 * Matches the backend's guideline-composer.js logic
 * 
 * @param {Object} params
 * @param {string} params.sourceDir - Repository root directory
 * @param {string} params.tribe - Tribe ID (e.g., "ruang-murid")
 * @param {string} params.user - User type (e.g., "murid", "guru")
 * @param {string} [params.feature] - Feature ID (optional)
 * @returns {Promise<Object>} Composed guidelines object
 */
async function composeGuidelines({ sourceDir, tribe, user, feature }) {
	const filesUsed = []
	
	// Build file paths based on actual repo structure
	const paths = {
		// Reference layer (style standards, glossary, specs)
		styleStandards: 'Reference/style-standards.md',
		glossary: 'Reference/rm-glossary.md',
		uiSpecs: 'Reference/ui-component-specs.md',
		errorTemplates: 'Reference/error-templates.md',

		// Foundation layer
		generalFoundation: 'Core Guidelines/general-foundation.md',
		tribeGlossary: `Core Guidelines/${tribe}-tribe/glossary.md`,
		tribeDoc: `Core Guidelines/${tribe}-tribe/tribe.md`,

		// Tribe execution layer (user-specific)
		userExecution: `Core Guidelines/${tribe}-tribe/user/${user}.md`,

		// Examples layer (ALL examples automatically included)
		exampleComponentCopy: 'Examples/component-copy-samples.md',
		exampleDialogs: 'Examples/dialog-examples.md',
		exampleOnboarding: 'Examples/onboarding-samples.md',
		exampleToasts: 'Examples/toast-message-library.md',

		// Optional layers
		...(feature && { feature: `Feature Guidelines/${feature}.md` })
	}

	// Fetch all files
	const contents = {}
	for (const [key, path] of Object.entries(paths)) {
		const content = await readMarkdownFile(sourceDir, path)
		if (content) {
			contents[key] = content
			filesUsed.push(path)
		}
	}

	// Compose guidelines according to hierarchy
	const composed = {
		// Reference: Highest priority (style + glossaries + specs)
		reference: [
			contents.styleStandards || '',
			contents.glossary || '',
			contents.tribeGlossary || '',
			contents.uiSpecs || '',
			contents.errorTemplates || ''
		]
			.filter(Boolean)
			.join('\n\n---\n\n'),

		// Foundation: General + tribe context
		foundation: [
			contents.generalFoundation || '',
			contents.tribeDoc || ''
		]
			.filter(Boolean)
			.join('\n\n---\n\n'),

		// Tribe execution: User-specific rules
		tribeExecution: contents.userExecution || '',

		// Examples: All UI component examples automatically included
		examples: [
			contents.exampleComponentCopy || '',
			contents.exampleDialogs || '',
			contents.exampleOnboarding || '',
			contents.exampleToasts || ''
		]
			.filter(Boolean)
			.join('\n\n---\n\n'),

		// Optional: Feature-specific
		...(contents.feature && { features: contents.feature })
	}

	return {
		guidelines: composed,
		metadata: {
			files: filesUsed,
			tribe,
			user,
			...(feature && { feature })
		}
	}
}

/**
 * Convert composed guidelines to TOON format
 * @param {Object} composed - Composed guidelines object
 * @returns {string|null} TOON formatted string or null on error
 */
function convertToToon(composed) {
	try {
		// Convert the guidelines object to TOON format
		const toonContent = encode(composed.guidelines)
		return toonContent
	} catch (error) {
		console.error('Error encoding to TOON:', error.message)
		return null
	}
}

/**
 * Validate TOON content by attempting to decode it
 * @param {string} toonContent - TOON formatted content
 * @param {Object} originalGuidelines - Original guidelines object for comparison
 * @returns {boolean} True if validation passes
 */
function validateToonContent(toonContent, originalGuidelines) {
	try {
		// Attempt to decode the TOON content
		const decoded = decode(toonContent)
		
		// Basic validation: check that decoded content has the same keys
		const originalKeys = Object.keys(originalGuidelines).sort()
		const decodedKeys = Object.keys(decoded).sort()
		
		if (originalKeys.length !== decodedKeys.length) {
			console.error('Validation failed: Key count mismatch')
			return false
		}
		
		for (let i = 0; i < originalKeys.length; i++) {
			if (originalKeys[i] !== decodedKeys[i]) {
				console.error(`Validation failed: Key mismatch at index ${i}`)
				return false
			}
		}
		
		return true
	} catch (error) {
		console.error('Validation failed: Unable to decode TOON content:', error.message)
		return false
	}
}

/**
 * Generate TOON filename based on parameters
 * @param {string} tribe - Tribe ID
 * @param {string} [feature] - Feature ID (optional)
 * @param {string} [uiElement] - UI element ID (optional)
 * @returns {string} Filename with .toon extension
 */
function generateToonFilename(tribe, feature, uiElement) {
	let filename = tribe
	
	if (feature) {
		filename += `-${feature}`
	}
	
	if (uiElement) {
		filename += `-${uiElement}`
	} else if (!feature) {
		filename += '-base'
	}
	
	return `${filename}.toon`
}

/**
 * Write TOON content to file
 * @param {string} outputDir - Output directory path
 * @param {string} filename - Filename
 * @param {string} content - TOON content
 * @returns {Promise<void>}
 */
async function writeToonFile(outputDir, filename, content) {
	const filepath = join(outputDir, filename)
	await writeFile(filepath, content, 'utf-8')
}

/**
 * Count tokens in a string using GPT tokenizer
 * @param {string} text - Text to count tokens for
 * @returns {number} Token count
 */
function countTokens(text) {
	try {
		const tokens = encodeTokens(text)
		return tokens.length
	} catch (error) {
		console.error('Error counting tokens:', error.message)
		return 0
	}
}

/**
 * Calculate SHA-256 checksum of content
 * @param {string} content - Content to hash
 * @returns {string} Hex checksum
 */
function calculateChecksum(content) {
	return createHash('sha256').update(content).digest('hex')
}

/**
 * Calculate token savings between JSON and TOON formats
 * @param {Object} guidelines - Guidelines object
 * @param {string} toonContent - TOON formatted content
 * @returns {Object} Token statistics
 */
function calculateTokenSavings(guidelines, toonContent) {
	const jsonContent = JSON.stringify(guidelines, null, 2)
	const jsonTokens = countTokens(jsonContent)
	const toonTokens = countTokens(toonContent)
	const savings = jsonTokens > 0 ? ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1) : '0.0'
	
	return {
		json: jsonTokens,
		toon: toonTokens,
		savings: `${savings}%`
	}
}

/**
 * Main generation function
 */
async function main() {
	const options = parseArgs()
	
	if (options.verbose) {
		console.log('TOON Generation Script')
		console.log('======================')
		console.log(`Source directory: ${options.sourceDir}`)
		console.log(`Output directory: ${options.outputDir}`)
		console.log('')
	}

	try {
		// Ensure output directory exists
		await mkdir(options.outputDir, { recursive: true })

		// Get all tribes
		const tribes = await getTribes(options.sourceDir)
		
		if (tribes.length === 0) {
			console.error('No tribes found in Core Guidelines directory')
			process.exit(1)
		}

		if (options.verbose) {
			console.log(`Found ${tribes.length} tribes: ${tribes.join(', ')}`)
		}

		const generatedFiles = []

		// For each tribe, get users and compose guidelines
		for (const tribe of tribes) {
			const users = await getTribeUsers(options.sourceDir, tribe)
			
			if (users.length === 0) {
				console.warn(`No users found for tribe: ${tribe}`)
				continue
			}

			if (options.verbose) {
				console.log(`\nProcessing tribe: ${tribe}`)
				console.log(`  Users: ${users.join(', ')}`)
			}

			// Generate base guideline for each user (no features)
			for (const user of users) {
				try {
					const composed = await composeGuidelines({
						sourceDir: options.sourceDir,
						tribe,
						user
					})

					if (options.verbose) {
						console.log(`  Composed base guidelines for ${user}`)
						console.log(`    Files used: ${composed.metadata.files.length}`)
					}

					// Convert to TOON format
					const toonContent = convertToToon(composed)
					
					if (!toonContent) {
						console.error(`  Failed to convert to TOON for ${user}`)
						continue
					}

					if (options.verbose) {
						console.log(`  Converted to TOON format`)
					}

					// Validate TOON content
					if (!validateToonContent(toonContent, composed.guidelines)) {
						console.error(`  Validation failed for ${user}, skipping`)
						continue
					}

					if (options.verbose) {
						console.log(`  Validation passed`)
					}

					// Generate filename and write to file
					// For base files, we use the user as the primary identifier
					// This matches the backend pattern where user is the main parameter
					const filename = generateToonFilename(user)
					await writeToonFile(options.outputDir, filename, toonContent)

					// Calculate token savings and file metadata
					const tokens = calculateTokenSavings(composed.guidelines, toonContent)
					const filepath = join(options.outputDir, filename)
					const fileStats = await stat(filepath)
					const checksum = calculateChecksum(toonContent)

					generatedFiles.push({
						path: filename,
						tribe,
						user,
						feature: null,
						uiElement: null,
						tokens,
						size_bytes: fileStats.size,
						checksum: `sha256:${checksum}`
					})

					if (options.verbose) {
						console.log(`  Written to ${filename}`)
						console.log(`    Tokens: JSON=${tokens.json}, TOON=${tokens.toon}, Savings=${tokens.savings}`)
					}
				} catch (error) {
					console.error(`  Error processing ${user}:`, error.message)
					continue
				}
			}
		}

		// Get all features and generate combinations
		const features = await getFeatures(options.sourceDir)
		
		if (features.length > 0 && options.verbose) {
			console.log(`\nFound ${features.length} features: ${features.join(', ')}`)
		}

		// Generate feature combinations for each tribe/user
		for (const tribe of tribes) {
			const users = await getTribeUsers(options.sourceDir, tribe)
			
			for (const user of users) {
				for (const feature of features) {
					try {
						const composed = await composeGuidelines({
							sourceDir: options.sourceDir,
							tribe,
							user,
							feature
						})

						const toonContent = convertToToon(composed)
						
						if (!toonContent) {
							console.error(`  Failed to convert to TOON for ${user}-${feature}`)
							continue
						}

						// Validate TOON content
						if (!validateToonContent(toonContent, composed.guidelines)) {
							console.error(`  Validation failed for ${user}-${feature}, skipping`)
							continue
						}

						const filename = generateToonFilename(user, feature)
						await writeToonFile(options.outputDir, filename, toonContent)

						// Calculate token savings and file metadata
						const tokens = calculateTokenSavings(composed.guidelines, toonContent)
						const filepath = join(options.outputDir, filename)
						const fileStats = await stat(filepath)
						const checksum = calculateChecksum(toonContent)

						generatedFiles.push({
							path: filename,
							tribe,
							user,
							feature,
							uiElement: null,
							tokens,
							size_bytes: fileStats.size,
							checksum: `sha256:${checksum}`
						})

						if (options.verbose) {
							console.log(`  Generated ${filename} (Savings: ${tokens.savings})`)
						}
					} catch (error) {
						console.error(`  Error processing ${user}-${feature}:`, error.message)
						continue
					}
				}
			}
		}

		// Calculate statistics
		const totalSavings = generatedFiles.reduce((sum, file) => {
			const savingsPercent = parseFloat(file.tokens.savings.replace('%', ''))
			return sum + savingsPercent
		}, 0)
		const averageSavings = generatedFiles.length > 0 
			? (totalSavings / generatedFiles.length).toFixed(1) 
			: '0.0'

		const totalJsonTokens = generatedFiles.reduce((sum, file) => sum + file.tokens.json, 0)
		const totalToonTokens = generatedFiles.reduce((sum, file) => sum + file.tokens.toon, 0)
		const totalSizeBytes = generatedFiles.reduce((sum, file) => sum + file.size_bytes, 0)

		// Generate index.json
		const index = {
			generated_at: new Date().toISOString(),
			version: '1.0.0',
			files: generatedFiles,
			total_files: generatedFiles.length,
			average_savings: `${averageSavings}%`,
			statistics: {
				total_json_tokens: totalJsonTokens,
				total_toon_tokens: totalToonTokens,
				total_size_bytes: totalSizeBytes
			}
		}

		const indexPath = join(options.outputDir, 'index.json')
		await writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8')

		if (options.verbose) {
			console.log(`\n${'='.repeat(50)}`)
			console.log('Generation Complete!')
			console.log(`${'='.repeat(50)}`)
			console.log(`Total files generated: ${generatedFiles.length}`)
			console.log(`Average token savings: ${averageSavings}%`)
			console.log(`Total JSON tokens: ${totalJsonTokens.toLocaleString()}`)
			console.log(`Total TOON tokens: ${totalToonTokens.toLocaleString()}`)
			console.log(`Total tokens saved: ${(totalJsonTokens - totalToonTokens).toLocaleString()}`)
			console.log(`Total size: ${(totalSizeBytes / 1024).toFixed(2)} KB`)
			console.log(`Index written to: index.json`)
			console.log(`${'='.repeat(50)}`)
		}

	} catch (error) {
		console.error('Error during generation:', error)
		process.exit(1)
	}
}

// Run the script
main()
